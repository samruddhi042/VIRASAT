"""
Virasat — UNESCO Heritage India Knowledge Graph
FastAPI Backend
"""

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import json
import os
from pathlib import Path

from routers import scraper, graph, search, nlp

app = FastAPI(
    title="Virasat API",
    description="AI-powered Knowledge Graph for UNESCO World Heritage Sites in India",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(scraper.router, prefix="/api", tags=["Scraper"])
app.include_router(graph.router,   prefix="/api", tags=["Graph"])
app.include_router(search.router,  prefix="/api", tags=["Search"])
app.include_router(nlp.router,     prefix="/api", tags=["NLP"])


@app.get("/")
def root():
    return {
        "project": "Virasat",
        "description": "UNESCO Heritage India Knowledge Graph",
        "version": "1.0.0",
        "endpoints": ["/api/scrape-data", "/api/build-graph", "/api/search",
                      "/api/site/{id}", "/api/graph/{site}", "/api/filters",
                      "/api/nlp/parse", "/api/stats"],
    }


@app.get("/api/stats")
def stats():
    data_path = Path(__file__).parent.parent / "data" / "heritage_sites.json"
    if not data_path.exists():
        raise HTTPException(404, "Dataset not found. Run /api/scrape-data first.")
    with open(data_path) as f:
        sites = json.load(f)
    from collections import Counter
    cats   = Counter(s["category"] for s in sites)
    states = Counter(s["state"] for s in sites)
    years  = sorted(set(s["year"] for s in sites))
    return {
        "total": len(sites),
        "by_category": dict(cats),
        "by_state": dict(states),
        "year_range": {"first": years[0], "last": years[-1]},
        "top_states": dict(states.most_common(5)),
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
