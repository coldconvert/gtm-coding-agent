"""
research-skeleton.py — Account Research Pipeline

A skeleton script for researching target accounts using enrichment APIs.
Fill in your API keys and customize the research sources.

Usage:
    python research-skeleton.py accounts.csv --output enriched.csv

Requirements:
    pip install requests python-dotenv
"""

import csv
import json
import os
import sys
import time
from datetime import datetime
from pathlib import Path

import requests
from dotenv import load_dotenv

load_dotenv()

# --- Configuration ---
# Add your API keys to a .env file (never commit this)
# ENRICHMENT_API_KEY=your_key_here
# RESEARCH_API_KEY=your_key_here

ENRICHMENT_API_KEY = os.getenv("ENRICHMENT_API_KEY", "")
RESEARCH_API_KEY = os.getenv("RESEARCH_API_KEY", "")

RATE_LIMIT_DELAY = 1.0  # seconds between API calls


def read_accounts(filepath: str) -> list[dict]:
    """Read a CSV of target accounts. Expects at minimum a 'domain' column."""
    accounts = []
    with open(filepath, "r") as f:
        reader = csv.DictReader(f)
        for row in reader:
            accounts.append(row)
    print(f"Loaded {len(accounts)} accounts from {filepath}")
    return accounts


def enrich_company(domain: str) -> dict:
    """
    Enrich a company by domain using your enrichment API.

    Replace this with your actual enrichment provider:
    - Apollo: https://docs.apollo.io/
    - Clearbit: https://dashboard.clearbit.com/docs
    - Clay: https://docs.clay.com/
    """
    if not ENRICHMENT_API_KEY:
        return {"error": "No ENRICHMENT_API_KEY set in .env"}

    # Example: Apollo enrichment (replace with your provider)
    # response = requests.get(
    #     "https://api.apollo.io/v1/organizations/enrich",
    #     params={"domain": domain},
    #     headers={"X-Api-Key": ENRICHMENT_API_KEY}
    # )
    # return response.json()

    # Placeholder — replace with real API call
    return {
        "domain": domain,
        "enriched": False,
        "note": "Replace this function with your enrichment API call",
    }


def research_company(domain: str) -> dict:
    """
    Research a company using a web search/research API.

    Options:
    - Exa (https://docs.exa.ai/) — AI-powered search
    - Firecrawl (https://docs.firecrawl.dev/) — web scraping
    - Perplexity API — research queries
    """
    if not RESEARCH_API_KEY:
        return {"error": "No RESEARCH_API_KEY set in .env"}

    # Example: Exa search (replace with your provider)
    # response = requests.post(
    #     "https://api.exa.ai/search",
    #     json={
    #         "query": f"{domain} company news funding",
    #         "num_results": 5,
    #         "use_autoprompt": True,
    #     },
    #     headers={"x-api-key": RESEARCH_API_KEY}
    # )
    # return response.json()

    # Placeholder — replace with real API call
    return {
        "domain": domain,
        "researched": False,
        "note": "Replace this function with your research API call",
    }


def score_account(enrichment_data: dict, research_data: dict) -> int:
    """
    Score an account against your ICP criteria.
    Returns a score from 0-100.

    Customize these criteria to match your ICP.
    """
    score = 0

    # Example scoring criteria (customize these):
    # employee_count = enrichment_data.get("employee_count", 0)
    # if 50 <= employee_count <= 500:
    #     score += 30  # Right size
    # elif 20 <= employee_count < 50:
    #     score += 15  # Slightly small but possible

    # funding = enrichment_data.get("funding_total", 0)
    # if funding >= 10_000_000:
    #     score += 20  # Well-funded

    # tech_stack = enrichment_data.get("technologies", [])
    # target_techs = {"snowflake", "bigquery", "redshift"}
    # if target_techs & set(t.lower() for t in tech_stack):
    #     score += 25  # Uses target technology

    # recent_news = research_data.get("results", [])
    # if any("hiring" in r.get("title", "").lower() for r in recent_news):
    #     score += 15  # Growth signal

    return score


def process_accounts(accounts: list[dict]) -> list[dict]:
    """Process each account: enrich, research, score."""
    results = []

    for i, account in enumerate(accounts):
        domain = account.get("domain", "").strip()
        if not domain:
            print(f"  Skipping row {i+1}: no domain")
            continue

        print(f"  [{i+1}/{len(accounts)}] Processing {domain}...")

        # Enrich
        enrichment = enrich_company(domain)
        time.sleep(RATE_LIMIT_DELAY)

        # Research
        research = research_company(domain)
        time.sleep(RATE_LIMIT_DELAY)

        # Score
        score = score_account(enrichment, research)

        results.append(
            {
                "domain": domain,
                "score": score,
                "enrichment": json.dumps(enrichment),
                "research": json.dumps(research),
                "processed_at": datetime.now().isoformat(),
                **account,  # Preserve original columns
            }
        )

    return results


def write_results(results: list[dict], output_path: str):
    """Write enriched results to CSV."""
    if not results:
        print("No results to write.")
        return

    fieldnames = results[0].keys()
    with open(output_path, "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(results)

    print(f"Wrote {len(results)} results to {output_path}")


def main():
    if len(sys.argv) < 2:
        print("Usage: python research-skeleton.py <input.csv> [--output enriched.csv]")
        sys.exit(1)

    input_file = sys.argv[1]
    output_file = "enriched.csv"

    if "--output" in sys.argv:
        idx = sys.argv.index("--output")
        if idx + 1 < len(sys.argv):
            output_file = sys.argv[idx + 1]

    print(f"\n--- Account Research Pipeline ---")
    print(f"Input:  {input_file}")
    print(f"Output: {output_file}\n")

    accounts = read_accounts(input_file)
    results = process_accounts(accounts)
    write_results(results, output_file)

    # Summary
    scored = [r for r in results if r["score"] > 0]
    print(f"\nDone. {len(scored)}/{len(results)} accounts scored > 0.")


if __name__ == "__main__":
    main()
