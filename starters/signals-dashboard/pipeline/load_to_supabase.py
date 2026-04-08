#!/usr/bin/env python3
"""Load discovered companies and signals into Supabase.

Reads from CSV files produced by discover_companies.py and score_signals.py,
then upserts into the Supabase tables that power the dashboard.

Prerequisites:
    pip install supabase python-dotenv
    Set SUPABASE_URL and SUPABASE_SERVICE_KEY in .env

Usage:
    python load_to_supabase.py --companies data/discovered_companies.csv
    python load_to_supabase.py --signals data/signals.csv
    python load_to_supabase.py --companies data/discovered_companies.csv --signals data/signals.csv
    python load_to_supabase.py --dry-run --companies data/discovered_companies.csv
"""

import csv
import logging
import os
import sys
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

from config import BATCH_SIZE_DB_INSERT

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
log = logging.getLogger(__name__)


def get_supabase_client():
    """Create Supabase client from environment variables."""
    from supabase import create_client

    url = os.getenv("SUPABASE_URL", "")
    key = os.getenv("SUPABASE_SERVICE_KEY", "")
    if not url or not key:
        log.error("Set SUPABASE_URL and SUPABASE_SERVICE_KEY in .env")
        sys.exit(1)
    return create_client(url, key)


def load_companies(csv_path: str, dry_run: bool = False) -> int:
    """Load companies from CSV into Supabase companies table.

    Expected CSV columns: domain, name, vertical, source, url, exa_score
    Deduplicates by domain (skips if domain already exists).
    """
    if not Path(csv_path).exists():
        log.error(f"File not found: {csv_path}")
        return 0

    rows = []
    with open(csv_path, "r") as f:
        reader = csv.DictReader(f)
        for row in reader:
            domain = row.get("domain", "").strip()
            if not domain:
                continue
            rows.append({
                "name": row.get("name", domain),
                "domain": domain,
                "industry": row.get("vertical", ""),
                "source": row.get("source", "exa"),
                "stage": "prospect",
            })

    log.info(f"Read {len(rows)} companies from {csv_path}")

    if dry_run:
        log.info(f"[DRY RUN] Would upsert {len(rows)} companies")
        for r in rows[:5]:
            log.info(f"  {r['domain']}: {r['name']} ({r['industry']})")
        return len(rows)

    client = get_supabase_client()
    loaded = 0

    # Batch upsert
    for i in range(0, len(rows), BATCH_SIZE_DB_INSERT):
        batch = rows[i:i + BATCH_SIZE_DB_INSERT]
        try:
            result = client.table("companies").upsert(
                batch,
                on_conflict="domain",
            ).execute()
            loaded += len(result.data) if result.data else 0
            log.info(f"  Batch {i // BATCH_SIZE_DB_INSERT + 1}: upserted {len(batch)} companies")
        except Exception as e:
            log.error(f"  Batch failed: {e}")

    log.info(f"Loaded {loaded} companies to Supabase")
    return loaded


def load_signals(csv_path: str, dry_run: bool = False) -> int:
    """Load signals from CSV into Supabase company_signals table.

    Expected CSV columns: company_domain, signal_type, source, detected_at,
                         signal_snippet, author_name, platform, score
    Matches signals to companies by domain.
    """
    if not Path(csv_path).exists():
        log.error(f"File not found: {csv_path}")
        return 0

    rows = []
    with open(csv_path, "r") as f:
        reader = csv.DictReader(f)
        for row in reader:
            domain = row.get("company_domain", "").strip()
            if not domain:
                continue
            rows.append({
                "domain": domain,
                "signal_type": row.get("signal_type", "unknown"),
                "signal_source": row.get("source", "unknown"),
                "signal_snippet": row.get("signal_snippet", ""),
                "author_name": row.get("author_name", ""),
                "platform": row.get("platform", ""),
                "score": float(row.get("score", 0)),
                "published_at": row.get("detected_at", ""),
            })

    log.info(f"Read {len(rows)} signals from {csv_path}")

    if dry_run:
        log.info(f"[DRY RUN] Would load {len(rows)} signals")
        return len(rows)

    client = get_supabase_client()

    # First, build domain -> company_id lookup
    companies = client.table("companies").select("id, domain").execute()
    domain_to_id = {c["domain"]: c["id"] for c in (companies.data or []) if c.get("domain")}
    log.info(f"Found {len(domain_to_id)} companies in Supabase for matching")

    # Match signals to companies
    matched = []
    unmatched = 0
    for row in rows:
        company_id = domain_to_id.get(row["domain"])
        if company_id:
            matched.append({
                "company_id": company_id,
                "signal_type": row["signal_type"],
                "signal_source": row["signal_source"],
                "signal_snippet": row["signal_snippet"],
                "author_name": row["author_name"],
                "platform": row["platform"],
                "score": row["score"],
                "published_at": row["published_at"] or None,
            })
        else:
            unmatched += 1

    log.info(f"Matched {len(matched)} signals, {unmatched} unmatched (company not found)")

    # Batch insert
    loaded = 0
    for i in range(0, len(matched), BATCH_SIZE_DB_INSERT):
        batch = matched[i:i + BATCH_SIZE_DB_INSERT]
        try:
            result = client.table("company_signals").insert(batch).execute()
            loaded += len(result.data) if result.data else 0
        except Exception as e:
            log.error(f"  Signal batch failed: {e}")

    log.info(f"Loaded {loaded} signals to Supabase")
    return loaded


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Load data to Supabase")
    parser.add_argument("--companies", help="CSV path for companies")
    parser.add_argument("--signals", help="CSV path for signals")
    parser.add_argument("--dry-run", action="store_true", help="Preview without writing")
    args = parser.parse_args()

    if not args.companies and not args.signals:
        log.error("Specify --companies and/or --signals CSV path")
        sys.exit(1)

    if args.companies:
        load_companies(args.companies, dry_run=args.dry_run)

    if args.signals:
        load_signals(args.signals, dry_run=args.dry_run)
