"""GTM Signals Dashboard — Pipeline Configuration

Signal weights, source reliability, scoring thresholds, and discovery config.
Edit these values to tune scoring for your market and data sources.
"""

import os
from pathlib import Path

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
PROJECT_ROOT = Path(__file__).parent
DATA_DIR = PROJECT_ROOT / "data"

# ---------------------------------------------------------------------------
# API Keys (from environment or .env file)
# ---------------------------------------------------------------------------
EXA_API_KEY = os.getenv("EXA_API_KEY", "")
SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY", "")

# ---------------------------------------------------------------------------
# Exa Configuration
# ---------------------------------------------------------------------------
EXA_RESULTS_PER_QUERY = 100
EXA_RATE_LIMIT_DELAY = 0.5   # Seconds between requests
EXA_MAX_RETRIES = 3

# ---------------------------------------------------------------------------
# Intent Scoring
# ---------------------------------------------------------------------------
INTENT_SCORE_THRESHOLD = 25   # Minimum score (0-100) to qualify
SIGNAL_RECENCY_HALF_LIFE_DAYS = 14
SIGNAL_RECENCY_LAMBDA = 0.693 / SIGNAL_RECENCY_HALF_LIFE_DAYS  # ln(2) / half_life

# Signal Weights (0-10): how much each signal type matters
SIGNAL_WEIGHTS = {
    "tool_evaluation":    10,  # Actively comparing tools
    "vendor_switch":      10,  # Switching from a competitor
    "tech_stack_change":   9,  # Changing infrastructure
    "hiring_signal":       8,  # Hiring for relevant roles
    "expansion_signal":    8,  # Growing team or market
    "pain_expression":     7,  # Expressing frustration with current tools
    "budget_mention":      6,  # Discussing budget allocation
    "competitor_mention":  5,  # Mentioning a competitor
    "community_active":    4,  # Active in relevant communities
    "content_engagement":  3,  # Engaging with relevant content
}

# Source Reliability (0-1): how trustworthy each data source is
SOURCE_RELIABILITY = {
    "exa":        0.85,
    "apify_g2":   0.90,
    "apify_cb":   0.88,  # Crunchbase
    "reddit":     0.70,
    "linkedin":   0.80,
    "job_board":  0.90,
    "news":       0.80,
    "social":     0.60,
    "manual":     0.95,
}

# ---------------------------------------------------------------------------
# Enterprise Validation Thresholds
# ---------------------------------------------------------------------------
MIN_EMPLOYEE_COUNT = 20
QUALITY_SCORE_THRESHOLD = 40  # Out of 100

# ---------------------------------------------------------------------------
# Verticals (customize for your market)
# ---------------------------------------------------------------------------
VERTICALS = [
    "martech",
    "salestech",
    "customer_success",
    "devtools",
    "data_analytics",
    "hr_tech",
    "fintech",
    "ecommerce",
    "healthtech",
    "cybersecurity",
    "cloud_infrastructure",
    "ai_ml",
    "productivity",
    "communications",
]

# ---------------------------------------------------------------------------
# Company Size Tiers
# ---------------------------------------------------------------------------
COMPANY_TIERS = {
    "startup":        (1, 50),
    "scaleup":        (51, 200),
    "mid_market":     (201, 1000),
    "enterprise":     (1001, 10000),
    "large_enterprise": (10001, None),
}

# ---------------------------------------------------------------------------
# Batch Sizes
# ---------------------------------------------------------------------------
BATCH_SIZE_EXA = 50
BATCH_SIZE_DB_INSERT = 500
