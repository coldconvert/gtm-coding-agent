#!/usr/bin/env python3
"""Company discovery via Exa API.

Discovers companies by searching across verticals and intent signals.
Outputs results to CSV for review before loading to Supabase.

Prerequisites:
    pip install exa-py python-dotenv
    export EXA_API_KEY=your-key-here

Usage:
    python discover_companies.py                     # Discover across all verticals
    python discover_companies.py --vertical salestech # Single vertical
    python discover_companies.py --dry-run            # Print queries, don't execute
    python discover_companies.py --output results.csv # Custom output path
"""

import csv
import logging
import os
import sys
import time
from dataclasses import dataclass, field
from pathlib import Path
from typing import Optional
from urllib.parse import urlparse

from dotenv import load_dotenv

load_dotenv()

from config import (
    EXA_API_KEY, EXA_RATE_LIMIT_DELAY, EXA_MAX_RETRIES,
    EXA_RESULTS_PER_QUERY, VERTICALS,
)

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
log = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Query Definitions
# ---------------------------------------------------------------------------

# Templates: customize these for your target market
VERTICAL_QUERIES = {
    "martech": [
        "B2B marketing technology SaaS company",
        "enterprise marketing automation platform",
        "marketing analytics software company",
    ],
    "salestech": [
        "B2B sales technology software company",
        "sales engagement platform enterprise",
        "CRM software company for sales teams",
        "revenue operations platform company",
    ],
    "customer_success": [
        "customer success platform SaaS company",
        "customer experience management software",
    ],
    "devtools": [
        "developer tools SaaS company",
        "API management platform company",
        "CI/CD pipeline automation company",
    ],
    "data_analytics": [
        "business intelligence software company",
        "data analytics platform enterprise",
        "product analytics software company",
    ],
    "hr_tech": [
        "HR technology software company",
        "talent acquisition platform enterprise",
    ],
    "fintech": [
        "B2B fintech software company",
        "payment processing platform enterprise",
    ],
    "ecommerce": [
        "ecommerce platform software company",
        "ecommerce analytics and optimization tool",
    ],
    "ai_ml": [
        "AI and machine learning platform company",
        "enterprise AI software company",
    ],
    "cybersecurity": [
        "cybersecurity software company enterprise",
        "cloud security platform company",
    ],
}

# Signal queries: detect buying intent across all verticals
SIGNAL_QUERIES = [
    "company evaluating new software tools 2024",
    "company switching from legacy platform",
    "hiring VP of Sales or Head of Growth",
    "company expanding sales team rapidly",
    "frustrated with current CRM solution",
    "company announcing new funding round",
    "looking for alternative to Salesforce",
    "company scaling outbound sales operations",
]


def extract_domain(url: str) -> str:
    """Extract clean domain from URL."""
    try:
        parsed = urlparse(url)
        domain = parsed.netloc or parsed.path
        domain = domain.lower().replace("www.", "")
        return domain.split("/")[0]
    except Exception:
        return ""


def search_exa(query: str, num_results: int = 100) -> list[dict]:
    """Execute a single Exa search query."""
    try:
        from exa_py import Exa
    except ImportError:
        log.error("Install exa-py: pip install exa-py")
        return []

    if not EXA_API_KEY:
        log.error("EXA_API_KEY not set. Export it or add to .env")
        return []

    exa = Exa(api_key=EXA_API_KEY)
    results = []

    for attempt in range(EXA_MAX_RETRIES):
        try:
            response = exa.search(
                query,
                type="neural",
                num_results=num_results,
                category="company",
                use_autoprompt=True,
            )
            for r in response.results:
                domain = extract_domain(r.url)
                if domain:
                    results.append({
                        "domain": domain,
                        "name": r.title or "",
                        "url": r.url,
                        "exa_score": getattr(r, "score", 0),
                        "query": query,
                    })
            return results
        except Exception as e:
            log.warning(f"Exa query failed (attempt {attempt + 1}): {e}")
            time.sleep(EXA_RATE_LIMIT_DELAY * (attempt + 1))

    return results


def discover_vertical(vertical: str) -> list[dict]:
    """Discover companies in a specific vertical."""
    queries = VERTICAL_QUERIES.get(vertical, [])
    if not queries:
        log.warning(f"No queries defined for vertical: {vertical}")
        return []

    all_results = []
    seen_domains = set()

    for query in queries:
        log.info(f"  Searching: {query}")
        results = search_exa(query, EXA_RESULTS_PER_QUERY)

        for r in results:
            if r["domain"] not in seen_domains:
                r["vertical"] = vertical
                r["source"] = "exa_vertical"
                all_results.append(r)
                seen_domains.add(r["domain"])

        time.sleep(EXA_RATE_LIMIT_DELAY)

    return all_results


def discover_signals() -> list[dict]:
    """Discover companies showing buying intent signals."""
    all_results = []
    seen_domains = set()

    for query in SIGNAL_QUERIES:
        log.info(f"  Signal search: {query}")
        results = search_exa(query, EXA_RESULTS_PER_QUERY)

        for r in results:
            if r["domain"] not in seen_domains:
                r["vertical"] = "unknown"
                r["source"] = "exa_signal"
                all_results.append(r)
                seen_domains.add(r["domain"])

        time.sleep(EXA_RATE_LIMIT_DELAY)

    return all_results


def save_to_csv(results: list[dict], output_path: str):
    """Save discovery results to CSV."""
    if not results:
        log.warning("No results to save")
        return

    fieldnames = ["domain", "name", "vertical", "source", "url", "exa_score", "query"]
    with open(output_path, "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(results)

    log.info(f"Saved {len(results)} companies to {output_path}")


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="GTM Company Discovery via Exa")
    parser.add_argument("--vertical", help="Discover a single vertical")
    parser.add_argument("--signals", action="store_true", help="Run signal-based discovery")
    parser.add_argument("--output", default="data/discovered_companies.csv")
    parser.add_argument("--dry-run", action="store_true", help="Print queries without executing")
    args = parser.parse_args()

    os.makedirs("data", exist_ok=True)

    if args.dry_run:
        print("\n--- Vertical Queries ---")
        for v, queries in VERTICAL_QUERIES.items():
            for q in queries:
                print(f"  [{v}] {q}")
        print(f"\n--- Signal Queries ---")
        for q in SIGNAL_QUERIES:
            print(f"  {q}")
        print(f"\nTotal: {sum(len(q) for q in VERTICAL_QUERIES.values()) + len(SIGNAL_QUERIES)} queries")
        sys.exit(0)

    all_results = []

    if args.vertical:
        log.info(f"Discovering vertical: {args.vertical}")
        all_results = discover_vertical(args.vertical)
    elif args.signals:
        log.info("Running signal-based discovery")
        all_results = discover_signals()
    else:
        # Run all verticals
        for vertical in VERTICALS:
            if vertical in VERTICAL_QUERIES:
                log.info(f"Discovering vertical: {vertical}")
                results = discover_vertical(vertical)
                all_results.extend(results)
                log.info(f"  Found {len(results)} companies")

        # Then signals
        log.info("Running signal-based discovery")
        signal_results = discover_signals()
        all_results.extend(signal_results)
        log.info(f"  Found {len(signal_results)} signal companies")

    # Deduplicate by domain
    seen = set()
    unique = []
    for r in all_results:
        if r["domain"] not in seen:
            unique.append(r)
            seen.add(r["domain"])

    log.info(f"Total unique companies: {len(unique)} (from {len(all_results)} raw)")
    save_to_csv(unique, args.output)
