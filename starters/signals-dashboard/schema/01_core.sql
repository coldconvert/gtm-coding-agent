-- ============================================================
-- GTM Signals Dashboard — Core Schema
-- ============================================================
--
-- Core tables for tracking companies, contacts, deals, and
-- intent signals in a go-to-market pipeline.
--
-- Designed for Supabase (PostgreSQL). Service-role key
-- bypasses RLS, so backend scripts work without policy setup.
--
-- Run order: 01_core.sql -> 02_campaigns.sql -> 03_seed_data.sql
-- ============================================================

-- ============================================================
-- Extensions
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- fuzzy text search

-- ============================================================
-- Companies
-- ============================================================
-- Each row is a target account in your pipeline. ICP score
-- (0-100) ranks how well they match your ideal customer
-- profile. Stage tracks where they sit in the funnel.
-- ============================================================
CREATE TABLE IF NOT EXISTS companies (
    id              BIGSERIAL PRIMARY KEY,
    name            TEXT NOT NULL,
    domain          TEXT,
    industry        TEXT,
    employee_count  INTEGER,
    annual_revenue  BIGINT,
    funding         TEXT,
    tech_stack      TEXT[],
    geography       TEXT,
    icp_score       SMALLINT CHECK (icp_score BETWEEN 0 AND 100),
    icp_segment     TEXT,
    stage           TEXT NOT NULL DEFAULT 'prospect'
                    CHECK (stage IN ('prospect', 'qualified', 'opportunity',
                                     'customer', 'churned', 'archived')),
    outreach_status TEXT DEFAULT 'none'
                    CHECK (outreach_status IN ('none', 'researching', 'sequenced',
                                               'replied', 'meeting', 'paused')),
    gap_analysis    JSONB,
    exa_research    JSONB,
    source          TEXT,
    notes           TEXT,
    tags            TEXT[] DEFAULT '{}',

    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Company Contacts (max 3 ranked per company)
-- ============================================================
-- The people you reach out to. Each company keeps at most 3
-- "ranked" contacts (contact_rank 1-3). The trigger below
-- enforces this limit at the database level. unified_score
-- (0-100) blends engagement, seniority, and fit signals.
-- ============================================================
CREATE TABLE IF NOT EXISTS company_contacts (
    id              BIGSERIAL PRIMARY KEY,
    company_id      BIGINT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    first_name      TEXT NOT NULL,
    last_name       TEXT,
    email           TEXT,
    email_status    TEXT DEFAULT 'unknown'
                    CHECK (email_status IN ('unknown', 'valid', 'invalid', 'catch_all', 'risky')),
    phone           TEXT,
    title           TEXT,
    seniority       TEXT CHECK (seniority IN ('c_level', 'vp', 'director', 'manager', 'individual', NULL)),
    persona         TEXT,
    linkedin_url    TEXT,
    apollo_id       TEXT,

    -- Scoring & ranking
    unified_score   SMALLINT DEFAULT 0 CHECK (unified_score BETWEEN 0 AND 100),
    contact_rank    SMALLINT CHECK (contact_rank BETWEEN 1 AND 3 OR contact_rank IS NULL),
    is_primary      BOOLEAN DEFAULT FALSE,
    score_breakdown JSONB,

    -- Status
    source          TEXT,
    vibe            TEXT,
    notes           TEXT,

    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_company_rank UNIQUE (company_id, contact_rank)
);

-- ============================================================
-- Contact Overflow
-- ============================================================
-- When enrichment finds more than 3 contacts for a company,
-- the extras land here. They are never synced to your CRM
-- but stay available if a ranked contact churns.
-- ============================================================
CREATE TABLE IF NOT EXISTS contact_overflow (
    id              BIGSERIAL PRIMARY KEY,
    company_id      BIGINT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    first_name      TEXT NOT NULL,
    last_name       TEXT,
    email           TEXT,
    email_status    TEXT,
    title           TEXT,
    seniority       TEXT,
    linkedin_url    TEXT,
    apollo_id       TEXT,
    unified_score   SMALLINT DEFAULT 0,
    source          TEXT,
    notes           TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Deals
-- ============================================================
-- Revenue opportunities tied to a company and optionally a
-- contact. value_cents stores monetary amounts in cents to
-- avoid floating-point rounding issues.
-- ============================================================
CREATE TABLE IF NOT EXISTS company_deals (
    id              BIGSERIAL PRIMARY KEY,
    company_id      BIGINT REFERENCES companies(id) ON DELETE CASCADE,
    contact_id      BIGINT REFERENCES company_contacts(id) ON DELETE SET NULL,
    title           TEXT NOT NULL,
    value_cents     BIGINT DEFAULT 0,
    stage           TEXT NOT NULL DEFAULT 'discovery'
                    CHECK (stage IN ('discovery', 'demo', 'proposal',
                                     'negotiation', 'closed_won', 'closed_lost')),
    probability     SMALLINT DEFAULT 0,
    pipeline        TEXT DEFAULT 'default',
    expected_close  DATE,
    notes           TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Company Signals
-- ============================================================
-- Intent and engagement signals mapped to companies. These
-- power the "signals feed" in the dashboard. signal_source
-- identifies where the signal came from (e.g. linkedin_intent,
-- reddit_intent, engagement). signal_type classifies the kind
-- of signal (pain_point, tool_evaluation, competitor_mention,
-- hiring_signal, budget_mention, etc.).
-- ============================================================
CREATE TABLE IF NOT EXISTS company_signals (
    id              BIGSERIAL PRIMARY KEY,
    company_id      BIGINT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    signal_source   TEXT NOT NULL,       -- 'linkedin_intent', 'reddit_intent', 'engagement'
    signal_type     TEXT NOT NULL,       -- 'pain_point', 'tool_evaluation', 'competitor_mention', etc.
    signal_snippet  TEXT,                -- The quote to use in outreach
    outreach_hook   TEXT,                -- Pre-written hook sentence
    author_name     TEXT,
    author_company  TEXT,
    platform        TEXT,                -- 'linkedin', 'reddit', 'twitter'
    source_url      TEXT,
    score           REAL DEFAULT 0,
    published_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Indexes
-- ============================================================

-- Companies
CREATE INDEX IF NOT EXISTS idx_companies_domain ON companies(domain);
CREATE INDEX IF NOT EXISTS idx_companies_stage ON companies(stage);
CREATE INDEX IF NOT EXISTS idx_companies_icp ON companies(icp_score DESC) WHERE icp_score IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_companies_name_trgm ON companies USING gin(name gin_trgm_ops);

-- Company contacts
CREATE INDEX IF NOT EXISTS idx_cc_company ON company_contacts(company_id);
CREATE INDEX IF NOT EXISTS idx_cc_email ON company_contacts(email) WHERE email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_cc_rank ON company_contacts(company_id, contact_rank) WHERE contact_rank IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_cc_score ON company_contacts(company_id, unified_score DESC);

-- Overflow & deals
CREATE INDEX IF NOT EXISTS idx_overflow_company ON contact_overflow(company_id);
CREATE INDEX IF NOT EXISTS idx_deals_company ON company_deals(company_id);

-- Signals
CREATE INDEX IF NOT EXISTS idx_cs_company ON company_signals(company_id);
CREATE INDEX IF NOT EXISTS idx_cs_type ON company_signals(signal_type);
CREATE INDEX IF NOT EXISTS idx_cs_source ON company_signals(signal_source);

-- ============================================================
-- Trigger: Enforce max 3 ranked contacts per company
-- ============================================================
-- Prevents inserting or promoting a 4th ranked contact.
-- To add a new ranked contact when the limit is reached,
-- first set an existing contact's contact_rank to NULL.
-- ============================================================
CREATE OR REPLACE FUNCTION enforce_contact_limit()
RETURNS TRIGGER AS $$
DECLARE
    ranked_count INTEGER;
BEGIN
    IF NEW.contact_rank IS NOT NULL THEN
        SELECT COUNT(*) INTO ranked_count
        FROM company_contacts
        WHERE company_id = NEW.company_id
          AND contact_rank IS NOT NULL
          AND id != COALESCE(NEW.id, -1);

        IF ranked_count >= 3 THEN
            RAISE EXCEPTION 'Company % already has 3 ranked contacts. Demote one first.',
                NEW.company_id;
        END IF;
    END IF;

    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_contact_limit ON company_contacts;
CREATE TRIGGER trg_contact_limit
    BEFORE INSERT OR UPDATE ON company_contacts
    FOR EACH ROW
    EXECUTE FUNCTION enforce_contact_limit();

-- ============================================================
-- Trigger: Auto-update timestamps
-- ============================================================
-- Keeps updated_at current on every UPDATE for companies and
-- deals. (Contacts get this via the enforce_contact_limit
-- trigger above.)
-- ============================================================
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_companies_updated ON companies;
CREATE TRIGGER trg_companies_updated
    BEFORE UPDATE ON companies
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trg_deals_updated ON company_deals;
CREATE TRIGGER trg_deals_updated
    BEFORE UPDATE ON company_deals
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- ============================================================
-- Views
-- ============================================================

-- v_needs_contacts: Companies that still have room for more
-- ranked contacts. Useful for driving enrichment workflows.
CREATE OR REPLACE VIEW v_needs_contacts AS
SELECT
    c.id, c.name, c.domain, c.icp_score,
    COUNT(ct.id) FILTER (WHERE ct.contact_rank IS NOT NULL) AS ranked_contacts,
    3 - COUNT(ct.id) FILTER (WHERE ct.contact_rank IS NOT NULL) AS contacts_needed
FROM companies c
LEFT JOIN company_contacts ct ON ct.company_id = c.id
WHERE c.stage NOT IN ('archived', 'churned') AND c.domain IS NOT NULL
GROUP BY c.id
HAVING COUNT(ct.id) FILTER (WHERE ct.contact_rank IS NOT NULL) < 3
ORDER BY c.icp_score DESC NULLS LAST;

-- ============================================================
-- Row-Level Security
-- ============================================================
-- RLS is enabled but no policies are created here. Supabase
-- service-role key bypasses RLS, so backend scripts work
-- without extra setup. Add policies when you expose tables
-- to authenticated frontend users.
-- ============================================================
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_overflow ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_signals ENABLE ROW LEVEL SECURITY;
