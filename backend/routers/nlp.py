"""
routers/nlp.py
NLP intent parsing — converts natural language queries
into structured knowledge graph queries.
"""

import re
import json
from pathlib import Path
from typing import List, Dict, Optional, Any

from fastapi import APIRouter, Query, HTTPException
from pydantic import BaseModel

router = APIRouter()
DATA_PATH = Path(__file__).parent.parent.parent / "data" / "heritage_sites.json"

# Lazy-load spaCy
_nlp = None
def get_nlp():
    global _nlp
    if _nlp is None:
        import spacy
        try:
            _nlp = spacy.load("en_core_web_sm")
        except OSError:
            from spacy.cli import download
            download("en_core_web_sm")
            _nlp = spacy.load("en_core_web_sm")
    return _nlp


def load_sites() -> List[Dict]:
    if not DATA_PATH.exists():
        return []
    with open(DATA_PATH) as f:
        return json.load(f)


# ─────────────────────────────────────────────
# Intent definitions
# ─────────────────────────────────────────────
INDIA_STATES = [
    "andhra pradesh","arunachal pradesh","assam","bihar","chhattisgarh","goa",
    "gujarat","haryana","himachal pradesh","jharkhand","karnataka","kerala",
    "madhya pradesh","maharashtra","manipur","meghalaya","mizoram","nagaland",
    "odisha","punjab","rajasthan","sikkim","tamil nadu","telangana","tripura",
    "uttar pradesh","uttarakhand","west bengal","delhi","chandigarh",
]

CATEGORIES = ["cultural","natural","mixed"]

HERITAGE_KEYWORDS = {
    "temple","fort","cave","palace","mosque","stupa","mausoleum","park","wildlife",
    "sanctuary","ruins","monastery","garden","railway","stepwell","university",
    "observatory","valley","mountain","glacier","forest","ancient","medieval",
}

COUNT_PATTERNS = [r"\bhow many\b", r"\bcount\b", r"\bnumber of\b", r"\btotal\b"]
OLDEST_PATTERNS = [r"\boldest\b", r"\bfirst\b", r"\bearliest\b"]
RECENT_PATTERNS = [r"\brecent\b", r"\blatest\b", r"\bnew\b", r"\bnewest\b"]
LIST_PATTERNS   = [r"\blist\b", r"\bshow\b", r"\bgive me\b", r"\bwhat are\b", r"\ball\b"]


class ParsedIntent(BaseModel):
    intent: str                    # "filter", "count", "oldest", "recent", "detail", "general"
    entities: Dict[str, Any]
    cypher: Optional[str]
    explanation: str


def parse_intent(query: str, use_spacy: bool = True) -> ParsedIntent:
    q = query.lower().strip()
    entities: Dict[str, Any] = {}

    # Try spaCy NER first
    if use_spacy:
        try:
            nlp = get_nlp()
            doc = nlp(query)
            gpe_ents = [e.text for e in doc.ents if e.label_ == "GPE"]
            # Map GPE to known states
            for g in gpe_ents:
                for st in INDIA_STATES:
                    if g.lower() in st or st in g.lower():
                        entities["state"] = st.title()
        except Exception:
            pass

    # Rule-based state detection
    if "state" not in entities:
        for st in INDIA_STATES:
            if st in q:
                entities["state"] = st.title()
                break

    # Category detection
    for cat in CATEGORIES:
        if cat in q:
            entities["category"] = cat.capitalize()
            break

    # Keyword detection
    kws_found = [kw for kw in HERITAGE_KEYWORDS if kw in q]
    if kws_found:
        entities["keywords"] = kws_found

    # Year extraction
    years = re.findall(r"\b(1[89]\d{2}|20[0-2]\d)\b", q)
    if len(years) == 2:
        entities["year_from"], entities["year_to"] = int(years[0]), int(years[1])
    elif len(years) == 1:
        entities["year"] = int(years[0])

    # Determine intent
    if any(re.search(p, q) for p in COUNT_PATTERNS):
        intent = "count"
    elif any(re.search(p, q) for p in OLDEST_PATTERNS):
        intent = "oldest"
    elif any(re.search(p, q) for p in RECENT_PATTERNS):
        intent = "recent"
    elif entities.get("state") or entities.get("category") or entities.get("keywords"):
        intent = "filter"
    else:
        intent = "general"

    # Build Cypher
    cypher = _build_cypher(intent, entities)
    explanation = _explain_intent(intent, entities, q)

    return ParsedIntent(intent=intent, entities=entities, cypher=cypher, explanation=explanation)


def _build_cypher(intent: str, entities: Dict) -> Optional[str]:
    state    = entities.get("state")
    category = entities.get("category")
    keywords = entities.get("keywords", [])

    if intent == "count":
        if category:
            return f"MATCH (s:Site)-[:TYPE]->(c:Category {{name: '{category}'}}) RETURN COUNT(s) AS total"
        if state:
            return f"MATCH (s:Site)-[:LOCATED_IN]->(st:State {{name: '{state}'}}) RETURN COUNT(s) AS total"
        return "MATCH (s:Site) RETURN COUNT(s) AS total"

    if intent == "oldest":
        base = "MATCH (s:Site)"
        where = ""
        if state:
            base = f"MATCH (s:Site)-[:LOCATED_IN]->(st:State {{name: '{state}'}})"
        if category:
            base += f"\nMATCH (s)-[:TYPE]->(c:Category {{name: '{category}'}})"
        return f"{base}{where}\nRETURN s.name, s.year ORDER BY s.year ASC LIMIT 5"

    if intent == "recent":
        return "MATCH (s:Site) RETURN s.name, s.year ORDER BY s.year DESC LIMIT 5"

    if intent == "filter":
        parts, where_clauses = ["MATCH (s:Site)"], []
        if state:
            parts.append(f"MATCH (s)-[:LOCATED_IN]->(st:State {{name: '{state}'}})")
        if category:
            parts.append(f"MATCH (s)-[:TYPE]->(c:Category {{name: '{category}'}})")
        if keywords:
            parts.append(f"MATCH (s)-[:HAS_KEYWORD]->(k:Keyword) WHERE k.name IN {keywords}")
        return "\n".join(parts) + "\nRETURN s.name, s.year, s.description ORDER BY s.year"

    return "MATCH (s:Site)-[r]->(n) RETURN s, r, n LIMIT 25"


def _explain_intent(intent: str, entities: Dict, q: str) -> str:
    state    = entities.get("state")
    category = entities.get("category")
    keywords = entities.get("keywords", [])

    if intent == "count":
        parts = ["Counting sites"]
        if state: parts.append(f"in {state}")
        if category: parts.append(f"of category '{category}'")
        return " ".join(parts)

    if intent == "oldest":
        return f"Finding oldest/first inscribed sites{f' in {state}' if state else ''}"

    if intent == "recent":
        return "Finding most recently inscribed sites"

    if intent == "filter":
        parts = ["Filtering sites"]
        if state: parts.append(f"in {state}")
        if category: parts.append(f"of type '{category}'")
        if keywords: parts.append(f"with keywords: {', '.join(keywords)}")
        return " ".join(parts)

    return f"General knowledge graph query for: '{q}'"


def _execute_intent(intent: ParsedIntent) -> List[Dict]:
    """Execute the parsed intent against the local JSON dataset."""
    sites = load_sites()
    state    = intent.entities.get("state", "").lower()
    category = intent.entities.get("category", "").lower()
    keywords = [k.lower() for k in intent.entities.get("keywords", [])]

    filtered = sites

    if state:
        filtered = [s for s in filtered if state in s.get("state", "").lower()]
    if category:
        filtered = [s for s in filtered if s.get("category", "").lower() == category]
    if keywords:
        filtered = [s for s in filtered if any(kw in s.get("keywords", []) for kw in keywords)]

    if intent.intent == "oldest":
        filtered.sort(key=lambda s: s.get("year") or 9999)
        return filtered[:5]
    if intent.intent == "recent":
        filtered.sort(key=lambda s: s.get("year") or 0, reverse=True)
        return filtered[:5]
    if intent.intent == "count":
        return [{"count": len(filtered), "description": intent.explanation}]

    return filtered[:20]


# ─────────────────────────────────────────────
# API Endpoints
# ─────────────────────────────────────────────
@router.get("/nlp/parse")
def nlp_parse(q: str = Query(..., min_length=1)):
    """Parse a natural language query into structured intent + Cypher."""
    intent = parse_intent(q)
    results = _execute_intent(intent)
    return {
        "query":       q,
        "intent":      intent.intent,
        "entities":    intent.entities,
        "cypher":      intent.cypher,
        "explanation": intent.explanation,
        "results":     results,
        "count":       len(results),
    }


@router.get("/nlp/extract")
def nlp_extract(text: str = Query(..., min_length=5)):
    """Run full spaCy NER on arbitrary text and return entities."""
    try:
        nlp = get_nlp()
        doc = nlp(text[:3000])
        return {
            "text": text[:200] + "..." if len(text) > 200 else text,
            "entities": [
                {"text": ent.text, "label": ent.label_, "start": ent.start_char, "end": ent.end_char}
                for ent in doc.ents
            ],
            "keywords": list({t.lemma_.lower() for t in doc
                              if t.lemma_.lower() in HERITAGE_KEYWORDS and not t.is_stop}),
            "noun_chunks": [chunk.text for chunk in doc.noun_chunks][:15],
        }
    except Exception as e:
        raise HTTPException(500, f"spaCy error: {e}")


@router.post("/chat")
async def chat(body: Dict[str, Any]):
    """
    Simple knowledge-graph-backed chat endpoint.
    Parses intent and returns a natural language answer.
    """
    q = body.get("message", "").strip()
    if not q:
        raise HTTPException(400, "message field required")

    intent  = parse_intent(q)
    results = _execute_intent(intent)

    # Generate response text
    if intent.intent == "count":
        answer = f"There are {results[0]['count']} heritage sites matching your query."
    elif not results:
        answer = "I couldn't find any matching heritage sites. Try a different query."
    elif intent.intent in ("oldest", "recent"):
        label = "oldest" if intent.intent == "oldest" else "most recently inscribed"
        answer = f"The {label} sites are:\n" + "\n".join(
            f"• {s['name']} ({s.get('year', 'N/A')}) — {s.get('state', '')}"
            for s in results
        )
    else:
        answer = f"Found {len(results)} site(s):\n" + "\n".join(
            f"• {s['name']} ({s.get('year', 'N/A')}) — {s.get('state', '')}"
            for s in results[:6]
        )
        if len(results) > 6:
            answer += f"\n…and {len(results)-6} more."

    return {
        "query":   q,
        "answer":  answer,
        "intent":  intent.intent,
        "cypher":  intent.cypher,
        "results": results[:6],
    }
