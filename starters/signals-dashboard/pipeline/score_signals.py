#!/usr/bin/env python3
"""Intent scoring engine for GTM signal intelligence.

Aggregates signals across all sources into a composite intent score per company.

Methodology:
  Company Intent Score = sum(signal_weight * source_reliability * recency_factor)
  Normalized to 0-100 scale.

  Components:
  - Signal count and diversity bonus
  - Source diversity bonus (signals from multiple sources are stronger)
  - Recency-weighted: exponential decay, half-life = 14 days
  - Capped per signal type to prevent single-source inflation

Usage:
    python score_signals.py                      # Score all from CSV
    python score_signals.py --input signals.csv  # Score from specific file
    python score_signals.py --push               # Score and push to Supabase
"""

import csv
import json
import logging
import math
import os
import sys
from collections import defaultdict
from datetime import datetime
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

from config import (
    SIGNAL_WEIGHTS, SOURCE_RELIABILITY,
    SIGNAL_RECENCY_LAMBDA, INTENT_SCORE_THRESHOLD,
)

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
log = logging.getLogger(__name__)

# Max contribution per signal type (prevents one type from dominating)
MAX_PER_SIGNAL_TYPE = 20.0
# Bonuses
DIVERSITY_BONUS_PER_TYPE = 2.0     # +2 per distinct signal type
SOURCE_DIVERSITY_BONUS = 3.0       # +3 per distinct source
# Normalization ceiling
RAW_SCORE_CEILING = 100.0


def calculate_recency_factor(detected_at: str) -> float:
    """Exponential decay: e^(-lambda * days_old). Half-life = 14 days."""
    if not detected_at:
        return 0.3  # Unknown age, conservative estimate

    try:
        dt = datetime.fromisoformat(detected_at.replace("Z", "+00:00"))
        now = datetime.now(dt.tzinfo) if dt.tzinfo else datetime.now()
        age_days = (now - dt).total_seconds() / 86400
    except (ValueError, TypeError):
        return 0.3

    return math.exp(-SIGNAL_RECENCY_LAMBDA * max(age_days, 0))


def score_company_signals(signals: list[dict]) -> dict:
    """Calculate intent score for a company's signals.

    Args:
        signals: List of dicts with keys: signal_type, source, detected_at

    Returns:
        Dict with score breakdown.
    """
    if not signals:
        return {
            "signal_count": 0,
            "intent_score": 0.0,
            "signal_type_diversity": 0,
            "source_diversity": 0,
            "weighted_signal_sum": 0.0,
        }

    # Aggregate by signal type with cap
    type_scores = defaultdict(float)
    type_counts = defaultdict(int)
    source_set = set()

    for signal in signals:
        signal_type = signal.get("signal_type", "unknown")
        source = signal.get("source", "unknown")
        detected_at = signal.get("detected_at", "")

        weight = SIGNAL_WEIGHTS.get(signal_type, 3)
        reliability = SOURCE_RELIABILITY.get(source, 0.5)
        recency = calculate_recency_factor(detected_at)
        weighted = weight * reliability * recency

        # Cap per signal type
        if type_scores[signal_type] < MAX_PER_SIGNAL_TYPE:
            contribution = min(weighted, MAX_PER_SIGNAL_TYPE - type_scores[signal_type])
            type_scores[signal_type] += contribution

        type_counts[signal_type] += 1
        source_set.add(source)

    # Raw weighted sum
    weighted_sum = sum(type_scores.values())

    # Diversity bonuses
    type_diversity = len(type_scores)
    source_diversity = len(source_set)
    diversity_bonus = (type_diversity * DIVERSITY_BONUS_PER_TYPE +
                       source_diversity * SOURCE_DIVERSITY_BONUS)

    # Raw score
    raw_score = weighted_sum + diversity_bonus

    # Normalize to 0-100
    if raw_score <= 0:
        intent_score = 0.0
    elif raw_score >= RAW_SCORE_CEILING:
        intent_score = 100.0
    else:
        intent_score = min(100.0, (raw_score / RAW_SCORE_CEILING) * 100.0)

    return {
        "signal_count": len(signals),
        "signal_type_diversity": type_diversity,
        "source_diversity": source_diversity,
        "weighted_signal_sum": round(weighted_sum, 2),
        "diversity_bonus": round(diversity_bonus, 2),
        "raw_score": round(raw_score, 2),
        "intent_score": round(intent_score, 2),
        "type_breakdown": {k: round(v, 2) for k, v in type_scores.items()},
        "type_counts": dict(type_counts),
        "sources": list(source_set),
    }


def score_from_csv(csv_path: str) -> dict[str, dict]:
    """Read signals from CSV and score by company.

    Expected CSV columns: company_domain, signal_type, source, detected_at
    """
    company_signals = defaultdict(list)

    with open(csv_path, "r") as f:
        reader = csv.DictReader(f)
        for row in reader:
            domain = row.get("company_domain", "").strip()
            if domain:
                company_signals[domain].append(row)

    results = {}
    for domain, signals in company_signals.items():
        results[domain] = score_company_signals(signals)
        results[domain]["domain"] = domain

    log.info(f"Scored {len(results)} companies from {csv_path}")
    return results


def push_scores_to_supabase(scores: dict[str, dict]) -> int:
    """Push scored signals to Supabase company_signals table."""
    from supabase import create_client

    url = os.getenv("SUPABASE_URL", "")
    key = os.getenv("SUPABASE_SERVICE_KEY", "")
    if not url or not key:
        log.error("SUPABASE_URL and SUPABASE_SERVICE_KEY required for push")
        return 0

    client = create_client(url, key)
    pushed = 0

    for domain, score_data in scores.items():
        if score_data["intent_score"] < INTENT_SCORE_THRESHOLD:
            continue

        # Update company icp_score with intent score
        result = client.table("companies").update({
            "icp_score": int(score_data["intent_score"]),
        }).eq("domain", domain).execute()

        if result.data:
            pushed += 1

    log.info(f"Pushed scores for {pushed} companies to Supabase")
    return pushed


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="GTM Signal Scorer")
    parser.add_argument("--input", default="data/signals.csv", help="Input CSV path")
    parser.add_argument("--push", action="store_true", help="Push scores to Supabase")
    parser.add_argument("--threshold", type=float, default=INTENT_SCORE_THRESHOLD)
    args = parser.parse_args()

    if not Path(args.input).exists():
        log.error(f"Input file not found: {args.input}")
        log.info("Create a CSV with columns: company_domain, signal_type, source, detected_at")
        sys.exit(1)

    scores = score_from_csv(args.input)

    # Print results
    above_threshold = {k: v for k, v in scores.items() if v["intent_score"] >= args.threshold}
    log.info(f"Total: {len(scores)} companies, {len(above_threshold)} above threshold ({args.threshold})")

    for domain, data in sorted(above_threshold.items(), key=lambda x: x[1]["intent_score"], reverse=True)[:20]:
        print(f"  {domain}: {data['intent_score']:.1f} ({data['signal_count']} signals, {data['signal_type_diversity']} types)")

    if args.push:
        push_scores_to_supabase(scores)
