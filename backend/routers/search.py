"""
routers/search.py
Semantic search, site detail, and filter endpoints.
"""

import json
import re
from pathlib import Path
from typing import List, Optional, Dict, Any

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel

router = APIRouter()
DATA_PATH = Path(__file__).parent.parent.parent / "data" / "heritage_sites.json"


def load_sites() -> List[Dict]:
    if not DATA_PATH.exists():
        raise HTTPException(404, "Dataset not found. Run POST /api/scrape-data first.")
    with open(DATA_PATH) as f:
        return json.load(f)


# ─────────────────────────────────────────────
# Search engine
# ─────────────────────────────────────────────
def score_site(site: Dict, query: str) -> float:
    """Simple TF-style relevance scoring."""
    q = query.lower().strip()
    score = 0.0

    name   = site.get("name", "").lower()
    state  = site.get("state", "").lower()
    cat    = site.get("category", "").lower()
    desc   = site.get("description", "").lower()
    kws    = " ".join(site.get("keywords", [])).lower()
    locs   = " ".join(site.get("entities", {}).get("locations", [])).lower()
    hist   = " ".join(site.get("entities", {}).get("historical", [])).lower()

    if q in name:   score += 10
    if q in state:  score += 6
    if q in cat:    score += 5
    if q in kws:    score += 4
    if q in locs:   score += 3
    if q in desc:   score += 2
    if q in hist:   score += 1

    # Partial word matches
    for word in q.split():
        if len(word) >= 3:
            if word in name:   score += 3
            if word in state:  score += 2
            if word in kws:    score += 1.5
            if word in desc:   score += 0.5

    return score


@router.get("/search")
def search(
    q: str = Query("", description="Search query"),
    category: Optional[str] = Query(None),
    state: Optional[str] = Query(None),
    year_from: Optional[int] = Query(None),
    year_to: Optional[int] = Query(None),
    limit: int = Query(42, le=100),
    offset: int = Query(0),
):
    """
    Semantic search across UNESCO heritage sites.
    Supports full-text query + filters.
    """
    sites = load_sites()

    # Apply hard filters first
    if category:
        sites = [s for s in sites if s.get("category", "").lower() == category.lower()]
    if state:
        sites = [s for s in sites if state.lower() in s.get("state", "").lower()]
    if year_from:
        sites = [s for s in sites if s.get("year") and s["year"] >= year_from]
    if year_to:
        sites = [s for s in sites if s.get("year") and s["year"] <= year_to]

    # Score and rank
    if q.strip():
        scored = [(score_site(s, q), s) for s in sites]
        scored = [(sc, s) for sc, s in scored if sc > 0]
        scored.sort(key=lambda x: x[0], reverse=True)
        sites = [s for _, s in scored]

    total = len(sites)
    sites = sites[offset:offset + limit]

    return {
        "query": q,
        "total": total,
        "offset": offset,
        "limit": limit,
        "results": sites,
    }


# ─────────────────────────────────────────────
# Site detail
# ─────────────────────────────────────────────
@router.get("/site/{site_id}")
def get_site(site_id: int):
    """Return full detail for a single heritage site by ID."""
    sites = load_sites()
    site = next((s for s in sites if s.get("id") == site_id), None)
    if not site:
        raise HTTPException(404, f"Site with id {site_id} not found")
    # Add related sites (same state or category)
    related = [
        s for s in sites
        if s.get("id") != site_id and (
            s.get("state") == site.get("state") or
            s.get("category") == site.get("category")
        )
    ][:4]
    return {**site, "related": related}


@router.get("/site/name/{name}")
def get_site_by_name(name: str):
    """Return site by name (case-insensitive)."""
    sites = load_sites()
    site = next((s for s in sites if s["name"].lower() == name.lower()), None)
    if not site:
        raise HTTPException(404, f"Site '{name}' not found")
    return site


# ─────────────────────────────────────────────
# Filters
# ─────────────────────────────────────────────
@router.get("/filters")
def get_filters():
    """Return all available filter options (states, categories, keywords, year range)."""
    sites = load_sites()
    from collections import Counter

    states    = sorted(set(s.get("state", "") for s in sites if s.get("state")))
    cats      = sorted(set(s.get("category", "") for s in sites if s.get("category")))
    kw_counts = Counter(kw for s in sites for kw in s.get("keywords", []))
    top_kws   = [kw for kw, _ in kw_counts.most_common(20)]
    years     = sorted(s["year"] for s in sites if s.get("year"))

    return {
        "states": states,
        "categories": cats,
        "keywords": top_kws,
        "year_range": {"min": years[0] if years else 1983, "max": years[-1] if years else 2024},
    }


# ─────────────────────────────────────────────
# Autocomplete
# ─────────────────────────────────────────────
@router.get("/autocomplete")
def autocomplete(q: str = Query(..., min_length=1)):
    """Return name suggestions for search autocomplete."""
    if not q:
        return {"suggestions": []}
    sites = load_sites()
    q_lower = q.lower()
    matches = []
    for s in sites:
        if q_lower in s["name"].lower() or q_lower in s.get("state", "").lower():
            matches.append({
                "name": s["name"],
                "state": s.get("state"),
                "category": s.get("category"),
                "year": s.get("year"),
            })
    return {"suggestions": matches[:8]}
