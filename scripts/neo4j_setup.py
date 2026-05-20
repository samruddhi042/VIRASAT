"""
scripts/neo4j_setup.py
──────────────────────
Complete Neo4j database setup script for Virasat.
Run AFTER the backend has scraped and saved data:
  python scripts/neo4j_setup.py

Requirements:
  pip install neo4j python-dotenv --break-system-packages

Neo4j must be running:
  docker run -d \
    --name virasat-neo4j \
    -p 7474:7474 -p 7687:7687 \
    -e NEO4J_AUTH=neo4j/virasatpass \
    neo4j:5
"""

import json
import os
from pathlib import Path
from dotenv import load_dotenv
from neo4j import GraphDatabase

load_dotenv()

NEO4J_URI  = os.getenv("NEO4J_URI",  "bolt://localhost:7687")
NEO4J_USER = os.getenv("NEO4J_USER", "neo4j")
NEO4J_PASS = os.getenv("NEO4J_PASS", "virasatpass")

DATA_PATH  = Path(__file__).parent.parent / "data" / "heritage_sites.json"


# ─── Cypher statements ────────────────────────────────────────────────────────

CONSTRAINTS = [
    "CREATE CONSTRAINT site_name_unique     IF NOT EXISTS FOR (s:Site)     REQUIRE s.name IS UNIQUE",
    "CREATE CONSTRAINT state_name_unique    IF NOT EXISTS FOR (st:State)   REQUIRE st.name IS UNIQUE",
    "CREATE CONSTRAINT category_name_unique IF NOT EXISTS FOR (c:Category) REQUIRE c.name IS UNIQUE",
    "CREATE CONSTRAINT keyword_name_unique  IF NOT EXISTS FOR (k:Keyword)  REQUIRE k.name IS UNIQUE",
    "CREATE CONSTRAINT location_name_unique IF NOT EXISTS FOR (l:Location) REQUIRE l.name IS UNIQUE",
]

INSERT_SITE = """
MERGE (s:Site {name: $name})
SET   s.id          = $id,
      s.year        = $year,
      s.description = $description,
      s.country     = $country,
      s.image_url   = $image_url,
      s.emoji       = $emoji

WITH s
MERGE (st:State {name: $state})
MERGE (s)-[:LOCATED_IN]->(st)

WITH s
MERGE (c:Category {name: $category})
MERGE (s)-[:TYPE]->(c)

WITH s
UNWIND $keywords AS kw
  MERGE (k:Keyword {name: kw})
  MERGE (s)-[:HAS_KEYWORD]->(k)

WITH s
UNWIND $locations AS loc
  MERGE (l:Location {name: loc})
  MERGE (s)-[:MENTIONS_LOCATION]->(l)

WITH s
UNWIND $persons AS p
  MERGE (pe:Person {name: p})
  MERGE (s)-[:ASSOCIATED_WITH]->(pe)

RETURN s.name AS created
"""

# Reference queries shown in the UI
SAMPLE_QUERIES = {
    "All sites in Maharashtra":
        "MATCH (s:Site)-[:LOCATED_IN]->(st:State {name: 'Maharashtra'}) RETURN s.name, s.year ORDER BY s.year",

    "All natural sites":
        "MATCH (s:Site)-[:TYPE]->(c:Category {name: 'Natural'}) RETURN s.name, s.description",

    "Sites with keyword 'temple'":
        "MATCH (s:Site)-[:HAS_KEYWORD]->(k:Keyword {name: 'temple'}) RETURN s.name, s.state",

    "Count by category":
        "MATCH (s:Site)-[:TYPE]->(c:Category) RETURN c.name AS category, COUNT(s) AS count ORDER BY count DESC",

    "Sites per state":
        "MATCH (st:State)<-[:LOCATED_IN]-(s:Site) RETURN st.name AS state, COUNT(s) AS total ORDER BY total DESC",

    "Full subgraph for one site":
        "MATCH (s:Site {name: 'Taj Mahal'})-[r]->(n) RETURN s, r, n",

    "Shared keywords between two sites":
        """MATCH (s1:Site {name: 'Ajanta Caves'})-[:HAS_KEYWORD]->(k)<-[:HAS_KEYWORD]-(s2:Site)
WHERE s1 <> s2 RETURN s2.name, collect(k.name) AS shared_keywords""",

    "Sites and their historical persons":
        "MATCH (s:Site)-[:ASSOCIATED_WITH]->(p:Person) RETURN s.name, collect(p.name) AS persons",

    "Sites inscribed in the 1980s":
        "MATCH (s:Site) WHERE s.year >= 1983 AND s.year < 1990 RETURN s.name, s.year ORDER BY s.year",

    "Keyword co-occurrence network":
        """MATCH (k1:Keyword)<-[:HAS_KEYWORD]-(s:Site)-[:HAS_KEYWORD]->(k2:Keyword)
WHERE k1.name < k2.name
RETURN k1.name, k2.name, COUNT(s) AS shared_sites
ORDER BY shared_sites DESC LIMIT 20""",
}


# ─── Main ─────────────────────────────────────────────────────────────────────

def main():
    if not DATA_PATH.exists():
        print(f"[ERROR] Dataset not found at {DATA_PATH}")
        print("  Run: POST http://localhost:8000/api/scrape-data?use_fallback=true")
        return

    with open(DATA_PATH) as f:
        sites = json.load(f)

    print(f"[INFO] Connecting to Neo4j at {NEO4J_URI} ...")
    driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASS))

    try:
        driver.verify_connectivity()
        print("[OK]   Connected to Neo4j\n")
    except Exception as e:
        print(f"[ERROR] Cannot connect to Neo4j: {e}")
        print("  Make sure Neo4j is running (see docker command above)")
        return

    with driver.session() as session:
        # 1. Constraints
        print("[1/3] Creating constraints ...")
        for stmt in CONSTRAINTS:
            try:
                session.run(stmt)
            except Exception as e:
                print(f"      Warning: {e}")
        print("      Done.\n")

        # 2. Insert all sites
        print(f"[2/3] Inserting {len(sites)} sites ...")
        for i, site in enumerate(sites, 1):
            ents = site.get("entities", {})
            session.run(
                INSERT_SITE,
                name        = site["name"],
                id          = site.get("id", i),
                year        = site.get("year"),
                description = site.get("description", ""),
                country     = site.get("country", "India"),
                image_url   = site.get("image_url", ""),
                emoji       = site.get("emoji", "🏛️"),
                state       = site.get("state", "Unknown"),
                category    = site.get("category", "Cultural"),
                keywords    = site.get("keywords", []),
                locations   = ents.get("locations", []),
                persons     = ents.get("persons", []),
            )
            print(f"      [{i}/{len(sites)}] {site['name']}")

        print("\n      Done.\n")

        # 3. Print summary
        print("[3/3] Graph summary:")
        for label in ["Site", "State", "Category", "Keyword", "Location", "Person"]:
            result = session.run(f"MATCH (n:{label}) RETURN COUNT(n) AS c")
            count = result.single()["c"]
            print(f"      {label}: {count} nodes")

        rel_result = session.run("MATCH ()-[r]->() RETURN COUNT(r) AS c")
        print(f"      Relationships: {rel_result.single()['c']}")

    driver.close()
    print("\n[DONE] Knowledge graph is ready!")
    print("       Open Neo4j Browser at http://localhost:7474")
    print("       Username: neo4j  |  Password: virasatpass\n")
    print("─── Sample Queries ────────────────────────────────────────────")
    for name, q in list(SAMPLE_QUERIES.items())[:3]:
        print(f"\n  // {name}")
        print(f"  {q}")
    print("\n  (See scripts/neo4j_setup.py for all 10 sample queries)")


if __name__ == "__main__":
    main()
