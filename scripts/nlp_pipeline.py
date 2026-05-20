"""
scripts/nlp_pipeline.py
───────────────────────
Standalone NLP processing script using spaCy.
Reads heritage_sites.json, runs full NLP, and writes enriched output.

Usage:
  python scripts/nlp_pipeline.py
  python scripts/nlp_pipeline.py --input data/heritage_sites.json --output data/enriched.json
"""

import json
import argparse
import re
from pathlib import Path
from collections import Counter

# ─── spaCy setup ──────────────────────────────────────────────────────────────
def load_spacy():
    import spacy
    try:
        return spacy.load("en_core_web_sm")
    except OSError:
        print("[INFO] Downloading spaCy model en_core_web_sm ...")
        from spacy.cli import download
        download("en_core_web_sm")
        return spacy.load("en_core_web_sm")


# ─── Heritage domain vocabulary ────────────────────────────────────────────────
HERITAGE_KWS = {
    "temple", "fort", "cave", "palace", "mosque", "stupa", "mausoleum",
    "park", "wildlife", "sanctuary", "ruins", "monastery", "garden",
    "railway", "stepwell", "university", "observatory", "valley",
    "mountain", "river", "lake", "forest", "beach", "island", "cathedral",
    "citadel", "amphitheatre", "aqueduct", "pyramid", "tomb", "shrine",
}

DYNASTY_PATTERNS = [
    r"(?:Mughal|Gupta|Maurya|Chola|Pallava|Chalukya|Rashtrakuta|Vijayanagara|"
    r"Hoysala|Kakatiya|Ikshvaku|Solanki|Chandela|Rajput|Maratha|Peshwa|"
    r"Marwa[rn]|Mewa[rn]) (?:Empire|dynasty|period|rule|era|king|ruler|dynasty)?",
]

CENTURY_PATTERN = r"\b(\d+)(?:st|nd|rd|th)[\s-]century\b"
BCE_CE_PATTERN  = r"\b\d{2,4}\s*(?:BCE|CE|BC|AD)\b"
YEAR_RANGE_PAT  = r"\b\d{4}[\s–-]+\d{4}\b"


def extract_nlp(doc, text: str) -> dict:
    """Full NLP extraction pipeline for a site description."""

    # 1. Named Entity Recognition
    locations  = list({e.text.strip() for e in doc.ents if e.label_ in ("GPE", "LOC") and len(e.text) > 2})
    persons    = list({e.text.strip() for e in doc.ents if e.label_ == "PERSON" and len(e.text) > 2})
    orgs       = list({e.text.strip() for e in doc.ents if e.label_ == "ORG"})
    dates      = list({e.text.strip() for e in doc.ents if e.label_ == "DATE"})

    # 2. Rule-based historical extraction
    dynasties  = []
    for pat in DYNASTY_PATTERNS:
        dynasties += re.findall(pat, text, re.IGNORECASE)

    centuries  = re.findall(CENTURY_PATTERN, text, re.IGNORECASE)
    bce_ce     = re.findall(BCE_CE_PATTERN, text, re.IGNORECASE)
    year_range = re.findall(YEAR_RANGE_PAT, text)

    historical = list(set(dates + orgs + dynasties + bce_ce + year_range + [f"{c}th century" for c in centuries]))[:10]

    # 3. Heritage keyword extraction (domain-specific)
    keywords = []
    text_lower = text.lower()
    for token in doc:
        if token.lemma_.lower() in HERITAGE_KWS and not token.is_stop and token.is_alpha:
            keywords.append(token.lemma_.lower())
    # Also scan noun chunks
    for chunk in doc.noun_chunks:
        if any(kw in chunk.text.lower() for kw in HERITAGE_KWS):
            root = chunk.root.lemma_.lower()
            if root in HERITAGE_KWS:
                keywords.append(root)
    keywords = list(set(keywords))[:8]

    # 4. Sentiment / significance markers (simple rule-based)
    significance_words = [
        w for w in ["finest", "greatest", "oldest", "largest", "first", "unique",
                    "outstanding", "remarkable", "magnificent", "extraordinary"]
        if w in text_lower
    ]

    # 5. Architecture styles
    arch_styles = [
        style for style in [
            "Dravidian", "Nagara", "Vesara", "Gothic", "Baroque", "Mughal",
            "Chalukya", "Hoysala", "Buddhist", "Islamic", "Rajput", "Colonial",
        ]
        if style.lower() in text_lower
    ]

    return {
        "locations":      locations[:8],
        "persons":        persons[:6],
        "historical":     historical[:8],
        "keywords":       keywords,
        "dynasties":      list(set(dynasties))[:5],
        "arch_styles":    arch_styles[:4],
        "significance":   significance_words[:3],
    }


def process_site(site: dict, nlp) -> dict:
    """Process a single site through the full NLP pipeline."""
    text = site.get("description", "")
    if not text:
        return site

    doc = nlp(text[:5000])
    entities = extract_nlp(doc, text)

    # Merge with existing entities if present
    existing = site.get("entities", {})
    merged = {
        "locations":   list(set(existing.get("locations", []) + entities["locations"]))[:8],
        "persons":     list(set(existing.get("persons", [])   + entities["persons"]))[:6],
        "historical":  list(set(existing.get("historical", [])+ entities["historical"]))[:8],
        "keywords":    list(set(existing.get("keywords", [])  + entities["keywords"]))[:8],
        "dynasties":   entities["dynasties"],
        "arch_styles": entities["arch_styles"],
        "significance":entities["significance"],
    }

    # Auto-assign keywords from description if none exist
    kws = site.get("keywords", [])
    if not kws:
        kws = merged["keywords"][:5]

    return {**site, "entities": merged, "keywords": kws, "nlp_processed": True}


def generate_stats(sites: list) -> dict:
    """Generate corpus-level NLP statistics."""
    all_locs     = [loc for s in sites for loc in s.get("entities", {}).get("locations", [])]
    all_kws      = [kw  for s in sites for kw  in s.get("keywords", [])]
    all_persons  = [p   for s in sites for p   in s.get("entities", {}).get("persons", [])]
    all_styles   = [st  for s in sites for st  in s.get("entities", {}).get("arch_styles", [])]

    return {
        "total_sites":        len(sites),
        "top_locations":      Counter(all_locs).most_common(10),
        "top_keywords":       Counter(all_kws).most_common(15),
        "top_persons":        Counter(all_persons).most_common(10),
        "top_arch_styles":    Counter(all_styles).most_common(8),
        "sites_by_category":  Counter(s.get("category") for s in sites),
        "sites_by_decade":    Counter((s.get("year", 0) // 10) * 10 for s in sites),
    }


# ─── CLI ──────────────────────────────────────────────────────────────────────
def main():
    parser = argparse.ArgumentParser(description="Virasat NLP Pipeline")
    parser.add_argument("--input",  default="data/heritage_sites.json")
    parser.add_argument("--output", default="data/enriched_sites.json")
    parser.add_argument("--stats",  default="data/nlp_stats.json")
    args = parser.parse_args()

    input_path  = Path(args.input)
    output_path = Path(args.output)
    stats_path  = Path(args.stats)

    if not input_path.exists():
        print(f"[ERROR] Input file not found: {input_path}")
        print("  Run: POST http://localhost:8000/api/scrape-data?use_fallback=true")
        return

    with open(input_path) as f:
        sites = json.load(f)

    print(f"[INFO] Loading spaCy ...")
    nlp = load_spacy()

    print(f"[INFO] Processing {len(sites)} sites through NLP pipeline ...\n")
    enriched = []
    for i, site in enumerate(sites, 1):
        result = process_site(site, nlp)
        enriched.append(result)
        ents = result.get("entities", {})
        print(f"  [{i:02d}/{len(sites)}] {site['name']}")
        print(f"         Locations : {', '.join(ents.get('locations', [])[:3]) or 'none'}")
        print(f"         Persons   : {', '.join(ents.get('persons', [])[:3]) or 'none'}")
        print(f"         Keywords  : {', '.join(result.get('keywords', [])[:4]) or 'none'}")
        print()

    # Write enriched data
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "w") as f:
        json.dump(enriched, f, indent=2, ensure_ascii=False)
    print(f"[OK] Enriched data written to {output_path}")

    # Write stats
    stats = generate_stats(enriched)
    with open(stats_path, "w") as f:
        json.dump(stats, f, indent=2, ensure_ascii=False)
    print(f"[OK] NLP stats written to {stats_path}\n")

    # Print summary
    print("─── NLP Statistics ───────────────────────────────────────────")
    print(f"  Sites processed  : {stats['total_sites']}")
    print(f"  Top keywords     : {', '.join(k for k,_ in stats['top_keywords'][:6])}")
    print(f"  Top locations    : {', '.join(l for l,_ in stats['top_locations'][:5])}")
    print(f"  Top persons      : {', '.join(p for p,_ in stats['top_persons'][:4])}")
    print(f"  Arch styles found: {', '.join(s for s,_ in stats['top_arch_styles'][:4])}")
    print()


if __name__ == "__main__":
    main()
