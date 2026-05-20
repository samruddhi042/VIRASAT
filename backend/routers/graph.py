"""
routers/graph.py
Neo4j Knowledge Graph — build, query, and visualize
node/relationship data for UNESCO Heritage Sites.
"""

import json
import logging
from pathlib import Path
from typing import List, Dict, Any, Optional

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel

logger = logging.getLogger(__name__)
router = APIRouter()

DATA_PATH = Path(__file__).parent.parent.parent / "data" / "heritage_sites.json"

# ─────────────────────────────────────────────
# Neo4j driver — lazy-loaded
# ─────────────────────────────────────────────
_driver = None

def get_driver():
    global _driver
    if _driver is None:
        try:
            from neo4j import GraphDatabase
            _driver = GraphDatabase.driver(
                "bolt://localhost:7687",
                auth=("neo4j", "virasatpass"),
            )
            _driver.verify_connectivity()
        except Exception as e:
            logger.warning(f"Neo4j not available: {e}. Graph queries will use mock mode.")
            _driver = "unavailable"
    return _driver


def neo4j_available() -> bool:
    d = get_driver()
    return d != "unavailable" and d is not None


def load_sites() -> List[Dict]:
    if not DATA_PATH.exists():
        raise HTTPException(404, "Dataset not found. Run POST /api/scrape-data first.")
    with open(DATA_PATH) as f:
        return json.load(f)


# ─────────────────────────────────────────────
# Cypher Queries (reference)
# ─────────────────────────────────────────────
CYPHER_QUERIES = {
    "create_constraints": """
        CREATE CONSTRAINT site_name IF NOT EXISTS FOR (s:Site) REQUIRE s.name IS UNIQUE;
        CREATE CONSTRAINT state_name IF NOT EXISTS FOR (st:State) REQUIRE st.name IS UNIQUE;
        CREATE CONSTRAINT category_name IF NOT EXISTS FOR (c:Category) REQUIRE c.name IS UNIQUE;
        CREATE CONSTRAINT keyword_name IF NOT EXISTS FOR (k:Keyword) REQUIRE k.name IS UNIQUE;
    """,
    "insert_site": """
        MERGE (s:Site {name: $name})
        SET s.id = $id, s.year = $year, s.description = $description,
            s.country = $country, s.image_url = $image_url
        WITH s
        MERGE (st:State {name: $state})
        MERGE (c:Category {name: $category})
        MERGE (s)-[:LOCATED_IN]->(st)
        MERGE (s)-[:TYPE]->(c)
        WITH s
        UNWIND $keywords AS kw
          MERGE (k:Keyword {name: kw})
          MERGE (s)-[:HAS_KEYWORD]->(k)
        WITH s
        UNWIND $locations AS loc
          MERGE (l:Location {name: loc})
          MERGE (s)-[:MENTIONS_LOCATION]->(l)
    """,
    "get_site_subgraph": """
        MATCH (s:Site {name: $name})-[r]->(n)
        RETURN s, r, n
        UNION
        MATCH (s:Site {name: $name})<-[r]-(n)
        RETURN s, r, n
    """,
    "find_by_state": """
        MATCH (s:Site)-[:LOCATED_IN]->(st:State {name: $state})
        RETURN s.name AS name, s.year AS year, s.description AS description
        ORDER BY s.year
    """,
    "find_by_category": """
        MATCH (s:Site)-[:TYPE]->(c:Category {name: $category})
        RETURN s.name AS name, s.year AS year, s.description AS description
        ORDER BY s.name
    """,
    "find_by_keyword": """
        MATCH (s:Site)-[:HAS_KEYWORD]->(k:Keyword {name: $keyword})
        RETURN s.name AS name, k.name AS keyword, s.state AS state
    """,
    "all_states": """
        MATCH (st:State)<-[:LOCATED_IN]-(s:Site)
        RETURN st.name AS state, COUNT(s) AS site_count
        ORDER BY site_count DESC
    """,
    "full_graph": """
        MATCH (s:Site)-[r]->(n)
        RETURN s.name AS source, type(r) AS relationship,
               n.name AS target, labels(n)[0] AS target_type
        LIMIT 200
    """,
}


# ─────────────────────────────────────────────
# Graph builder (runs against Neo4j OR returns mock)
# ─────────────────────────────────────────────
class BuildResult(BaseModel):
    status: str
    nodes_created: int
    relationships_created: int
    message: str


@router.post("/build-graph", response_model=BuildResult)
def build_graph():
    """
    Load the scraped JSON dataset and insert all nodes and
    relationships into Neo4j. Creates constraints first.
    Falls back to summary if Neo4j is unavailable.
    """
    sites = load_sites()

    if not neo4j_available():
        # Return a detailed mock summary showing what WOULD be inserted
        states   = set(s["state"] for s in sites)
        cats     = set(s["category"] for s in sites)
        keywords = set(kw for s in sites for kw in s.get("keywords", []))
        nodes = len(sites) + len(states) + len(cats) + len(keywords)
        rels  = (len(sites)*2) + sum(len(s.get("keywords",[])) for s in sites)
        return BuildResult(
            status="mock",
            nodes_created=nodes,
            relationships_created=rels,
            message=f"Neo4j not running. In production: would create {nodes} nodes "
                    f"({len(sites)} Sites, {len(states)} States, {len(cats)} Categories, "
                    f"{len(keywords)} Keywords) and {rels} relationships.",
        )

    driver = get_driver()
    nodes_created = 0
    rels_created  = 0

    with driver.session() as session:
        # Constraints
        for stmt in CYPHER_QUERIES["create_constraints"].strip().split(";"):
            if stmt.strip():
                try:
                    session.run(stmt)
                except Exception:
                    pass

        for site in sites:
            result = session.run(
                CYPHER_QUERIES["insert_site"],
                name        = site["name"],
                id          = site["id"],
                year        = site.get("year"),
                description = site.get("description", ""),
                country     = site.get("country", "India"),
                image_url   = site.get("image_url", ""),
                state       = site.get("state", "Unknown"),
                category    = site.get("category", "Cultural"),
                keywords    = site.get("keywords", []),
                locations   = site.get("entities", {}).get("locations", []),
            )
            summary = result.consume()
            nodes_created += summary.counters.nodes_created
            rels_created  += summary.counters.relationships_created

    return BuildResult(
        status="success",
        nodes_created=nodes_created,
        relationships_created=rels_created,
        message=f"Graph built: {nodes_created} nodes, {rels_created} relationships in Neo4j.",
    )


# ─────────────────────────────────────────────
# Graph query endpoints
# ─────────────────────────────────────────────
@router.get("/graph/{site_name}")
def site_subgraph(site_name: str):
    """Return the subgraph for a single heritage site (nodes + edges for Cytoscape)."""
    sites = load_sites()
    site = next((s for s in sites if s["name"].lower() == site_name.lower()), None)
    if not site:
        raise HTTPException(404, f"Site '{site_name}' not found")

    nodes = [{"id": f"site_{site['id']}", "label": site["name"], "type": "site",
               "data": {"year": site.get("year"), "category": site.get("category")}}]
    edges = []

    # State node
    nodes.append({"id": f"state_{site['state']}", "label": site["state"], "type": "state"})
    edges.append({"source": f"site_{site['id']}", "target": f"state_{site['state']}", "label": "LOCATED_IN"})

    # Category node
    nodes.append({"id": f"cat_{site['category']}", "label": site["category"], "type": "category"})
    edges.append({"source": f"site_{site['id']}", "target": f"cat_{site['category']}", "label": "TYPE"})

    # Keyword nodes
    for kw in site.get("keywords", []):
        kw_id = f"kw_{kw.replace(' ', '_')}"
        nodes.append({"id": kw_id, "label": kw, "type": "keyword"})
        edges.append({"source": f"site_{site['id']}", "target": kw_id, "label": "HAS_KEYWORD"})

    # Location entity nodes
    for loc in site.get("entities", {}).get("locations", [])[:4]:
        loc_id = f"loc_{loc.replace(' ', '_')}"
        nodes.append({"id": loc_id, "label": loc, "type": "location"})
        edges.append({"source": f"site_{site['id']}", "target": loc_id, "label": "MENTIONS_LOCATION"})

    return {"site": site["name"], "nodes": nodes, "edges": edges,
            "cypher": f"MATCH (s:Site {{name: '{site['name']}'}})-[r]->(n) RETURN s, r, n"}


@router.get("/graph-full")
def full_graph(limit: int = Query(150, le=300)):
    """Return the complete graph data for Cytoscape.js visualization."""
    sites = load_sites()[:limit]
    nodes, edges, seen_nodes = [], [], set()

    def add_node(nid, label, ntype):
        if nid not in seen_nodes:
            nodes.append({"id": nid, "label": label, "type": ntype})
            seen_nodes.add(nid)

    for s in sites:
        sid = f"site_{s['id']}"
        add_node(sid, s["name"], "site")
        st_id = f"state_{s['state']}"
        add_node(st_id, s["state"], "state")
        edges.append({"source": sid, "target": st_id, "label": "LOCATED_IN"})
        cat_id = f"cat_{s['category']}"
        add_node(cat_id, s["category"], "category")
        edges.append({"source": sid, "target": cat_id, "label": "TYPE"})
        for kw in s.get("keywords", [])[:3]:
            kw_id = f"kw_{kw}"
            add_node(kw_id, kw, "keyword")
            edges.append({"source": sid, "target": kw_id, "label": "HAS_KEYWORD"})

    return {"nodes": nodes, "edges": edges,
            "stats": {"sites": len(sites), "total_nodes": len(nodes), "total_edges": len(edges)}}


@router.get("/cypher-examples")
def cypher_examples():
    """Return sample Cypher queries for reference."""
    return {
        "queries": [
            {"name": "Sites in a State", "cypher": "MATCH (s:Site)-[:LOCATED_IN]->(st:State {name: 'Maharashtra'}) RETURN s.name, s.year ORDER BY s.year"},
            {"name": "Natural Sites", "cypher": "MATCH (s:Site)-[:TYPE]->(c:Category {name: 'Natural'}) RETURN s.name, s.description"},
            {"name": "Sites with Keyword", "cypher": "MATCH (s:Site)-[:HAS_KEYWORD]->(k:Keyword {name: 'temple'}) RETURN s.name, s.state"},
            {"name": "Count by Category", "cypher": "MATCH (s:Site)-[:TYPE]->(c:Category) RETURN c.name, COUNT(s) AS count ORDER BY count DESC"},
            {"name": "Sites per State", "cypher": "MATCH (st:State)<-[:LOCATED_IN]-(s:Site) RETURN st.name, COUNT(s) AS total ORDER BY total DESC"},
            {"name": "Full Subgraph", "cypher": "MATCH (s:Site {name: 'Taj Mahal'})-[r]->(n) RETURN s, r, n"},
            {"name": "Keyword Network", "cypher": "MATCH (k:Keyword)<-[:HAS_KEYWORD]-(s:Site)-[:HAS_KEYWORD]->(k2:Keyword) WHERE k.name = 'temple' RETURN s.name, k2.name"},
        ],
        "schema": {
            "nodes": ["Site", "State", "Category", "Keyword", "Location"],
            "relationships": ["LOCATED_IN", "TYPE", "HAS_KEYWORD", "MENTIONS_LOCATION"],
        },
    }
