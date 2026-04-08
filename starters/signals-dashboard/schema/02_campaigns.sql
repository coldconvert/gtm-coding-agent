-- ============================================================
-- GTM Signals Dashboard — Campaign Schema
-- ============================================================
--
-- Tables for outbound email campaigns, domain warmup tracking,
-- send queues, response classification, and alerting.
--
-- Depends on: 01_core.sql (companies, company_contacts)
-- ============================================================

-- ============================================================
-- Sending Domains
-- ============================================================
-- Each outbound domain you warm up and send from. The dashboard
-- tracks SPF/DKIM/DMARC status, warmup progress, and live
-- reputation metrics. Domains auto-pause when bounce rate
-- exceeds thresholds (see trigger below).
-- ============================================================
CREATE TABLE IF NOT EXISTS sending_domains (
    id              BIGSERIAL PRIMARY KEY,
    domain_name     TEXT NOT NULL UNIQUE,
    spf_status      TEXT DEFAULT 'pending',
    dkim_status     TEXT DEFAULT 'pending',
    dmarc_status    TEXT DEFAULT 'pending',
    warmup_status   TEXT DEFAULT 'not_started'
                    CHECK (warmup_status IN ('not_started', 'warming', 'warm', 'paused', 'burnt')),
    daily_limit     INTEGER DEFAULT 0,
    daily_sent      INTEGER DEFAULT 0,
    bounce_rate     REAL DEFAULT 0,
    reply_rate      REAL DEFAULT 0,
    reputation      REAL DEFAULT 0 CHECK (reputation BETWEEN 0 AND 100),
    is_active       BOOLEAN DEFAULT TRUE,
    paused_reason   TEXT,
    paused_at       TIMESTAMPTZ,
    last_health_at  TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Campaigns
-- ============================================================
-- A campaign groups a set of outbound sends around a shared
-- audience segment and sequence. campaign_type lets you slice
-- performance by motion (e.g. 'reddit_competitor',
-- 'yc_founders', 'content_download'). Performance counters
-- are auto-updated by the trg_campaign_stats trigger.
-- ============================================================
CREATE TABLE IF NOT EXISTS campaigns (
    id              BIGSERIAL PRIMARY KEY,
    name            TEXT NOT NULL,
    campaign_type   TEXT NOT NULL,
    status          TEXT DEFAULT 'draft'
                    CHECK (status IN ('draft', 'scheduled', 'active', 'paused', 'completed', 'cancelled')),
    icp_segment     TEXT,

    -- Sequence config
    sequence_steps  SMALLINT DEFAULT 3 CHECK (sequence_steps BETWEEN 1 AND 7),
    send_window_start SMALLINT DEFAULT 9,   -- hour in recipient TZ
    send_window_end   SMALLINT DEFAULT 17,
    daily_volume    INTEGER DEFAULT 100,

    -- A/B testing
    ab_test_active  BOOLEAN DEFAULT FALSE,
    ab_variants     JSONB,  -- [{ name: "A", subject: "...", template_id: 1 }]

    -- Performance (auto-updated by trigger)
    total_sent      INTEGER DEFAULT 0,
    total_delivered  INTEGER DEFAULT 0,
    total_opened    INTEGER DEFAULT 0,
    total_replied   INTEGER DEFAULT 0,
    total_bounced   INTEGER DEFAULT 0,
    total_unsubscribed INTEGER DEFAULT 0,
    reply_rate      REAL DEFAULT 0,
    bounce_rate     REAL DEFAULT 0,

    -- Scheduling
    started_at      TIMESTAMPTZ,
    completed_at    TIMESTAMPTZ,
    next_send_at    TIMESTAMPTZ,

    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Email Templates
-- ============================================================
-- Reusable, variable-rich email templates keyed by
-- campaign_type and step_number. The variables array lists
-- placeholder names (e.g. {first_name, company, pain_point})
-- that get rendered at send time.
-- ============================================================
CREATE TABLE IF NOT EXISTS email_templates (
    id              BIGSERIAL PRIMARY KEY,
    campaign_type   TEXT NOT NULL,
    name            TEXT NOT NULL,
    step_number     SMALLINT DEFAULT 1,
    subject         TEXT NOT NULL,
    body_text       TEXT NOT NULL,
    body_html       TEXT,
    variables       TEXT[] DEFAULT '{}',
    is_active       BOOLEAN DEFAULT TRUE,

    -- A/B testing metrics
    times_sent      INTEGER DEFAULT 0,
    times_opened    INTEGER DEFAULT 0,
    times_replied   INTEGER DEFAULT 0,

    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Send Queue
-- ============================================================
-- Every individual email send gets a row here. Status
-- progresses through: queued -> sending -> sent -> delivered
-- -> opened -> replied (or bounced/failed at any point).
-- Updating status fires the trg_campaign_stats trigger to
-- keep campaign-level counters in sync.
-- ============================================================
CREATE TABLE IF NOT EXISTS send_queue (
    id              BIGSERIAL PRIMARY KEY,
    campaign_id     BIGINT REFERENCES campaigns(id) ON DELETE CASCADE,
    contact_id      BIGINT REFERENCES company_contacts(id) ON DELETE SET NULL,
    company_id      BIGINT REFERENCES companies(id) ON DELETE SET NULL,
    domain_id       BIGINT REFERENCES sending_domains(id),
    template_id     BIGINT REFERENCES email_templates(id),

    -- Send details
    from_email      TEXT NOT NULL,
    to_email        TEXT NOT NULL,
    subject         TEXT NOT NULL,
    body_rendered   TEXT,
    step_number     SMALLINT DEFAULT 1,
    ab_variant      TEXT,

    -- Status tracking
    status          TEXT DEFAULT 'queued'
                    CHECK (status IN ('queued', 'sending', 'sent', 'delivered',
                                      'opened', 'replied', 'bounced', 'failed',
                                      'unsubscribed', 'cancelled')),

    -- Timestamps
    scheduled_for   TIMESTAMPTZ,
    sent_at         TIMESTAMPTZ,
    delivered_at    TIMESTAMPTZ,
    opened_at       TIMESTAMPTZ,
    replied_at      TIMESTAMPTZ,
    bounced_at      TIMESTAMPTZ,

    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Email Responses (incoming replies)
-- ============================================================
-- When a prospect replies, the response is classified (hot_lead,
-- meeting_request, out_of_office, etc.) and routed for action.
-- engagement_delta feeds back into the contact's unified_score.
-- ============================================================
CREATE TABLE IF NOT EXISTS email_responses (
    id              BIGSERIAL PRIMARY KEY,
    send_id         BIGINT REFERENCES send_queue(id),
    campaign_id     BIGINT REFERENCES campaigns(id),
    contact_id      BIGINT REFERENCES company_contacts(id),

    -- Email content
    from_email      TEXT NOT NULL,
    to_email        TEXT NOT NULL,
    subject         TEXT,
    body_text       TEXT,
    body_html       TEXT,

    -- Classification
    classification  TEXT DEFAULT 'unclassified'
                    CHECK (classification IN ('unclassified', 'hot_lead', 'warm_lead',
                                              'meeting_request', 'question', 'not_interested',
                                              'auto_responder', 'out_of_office', 'unsubscribe',
                                              'complaint', 'bounce')),
    confidence      REAL,
    classification_method TEXT,  -- 'rules', 'llm', 'manual'

    -- Processing
    is_processed    BOOLEAN DEFAULT FALSE,
    processed_at    TIMESTAMPTZ,
    routed_to       TEXT,  -- 'action_queue', 'unsubscribe', 'ignore'

    -- Lead scoring impact
    engagement_delta SMALLINT DEFAULT 0,

    received_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Domain Health Snapshots
-- ============================================================
-- Daily time-series data for each sending domain. Powers the
-- domain health charts in the dashboard.
-- ============================================================
CREATE TABLE IF NOT EXISTS domain_health (
    id              BIGSERIAL PRIMARY KEY,
    domain_id       BIGINT NOT NULL REFERENCES sending_domains(id) ON DELETE CASCADE,
    snapshot_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    daily_sent      INTEGER DEFAULT 0,
    daily_delivered INTEGER DEFAULT 0,
    daily_bounced   INTEGER DEFAULT 0,
    daily_replied   INTEGER DEFAULT 0,
    daily_opened    INTEGER DEFAULT 0,

    bounce_rate     REAL DEFAULT 0,
    reply_rate      REAL DEFAULT 0,
    open_rate       REAL DEFAULT 0,
    reputation      REAL DEFAULT 0,

    is_healthy      BOOLEAN DEFAULT TRUE,
    alert_message   TEXT
);

-- ============================================================
-- System Alerts
-- ============================================================
-- Operational alerts surfaced in the dashboard. Categories
-- include 'domain', 'campaign', 'system', and 'response'.
-- ============================================================
CREATE TABLE IF NOT EXISTS system_alerts (
    id              BIGSERIAL PRIMARY KEY,
    severity        TEXT NOT NULL CHECK (severity IN ('info', 'warning', 'critical')),
    category        TEXT NOT NULL,  -- 'domain', 'campaign', 'system', 'response'
    title           TEXT NOT NULL,
    message         TEXT NOT NULL,
    metadata        JSONB,
    is_resolved     BOOLEAN DEFAULT FALSE,
    resolved_at     TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Unsubscribes (global suppression list)
-- ============================================================
-- Any email that appears here must never be contacted again.
-- source tracks how the unsubscribe happened ('reply', 'link',
-- 'manual', 'complaint').
-- ============================================================
CREATE TABLE IF NOT EXISTS unsubscribes (
    id              BIGSERIAL PRIMARY KEY,
    email           TEXT NOT NULL UNIQUE,
    reason          TEXT,
    source          TEXT,  -- 'reply', 'link', 'manual', 'complaint'
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_type ON campaigns(campaign_type);

CREATE INDEX IF NOT EXISTS idx_sendq_status ON send_queue(status);
CREATE INDEX IF NOT EXISTS idx_sendq_campaign ON send_queue(campaign_id);
CREATE INDEX IF NOT EXISTS idx_sendq_scheduled ON send_queue(scheduled_for) WHERE status = 'queued';
CREATE INDEX IF NOT EXISTS idx_sendq_domain ON send_queue(domain_id);
CREATE INDEX IF NOT EXISTS idx_sendq_contact ON send_queue(contact_id);

CREATE INDEX IF NOT EXISTS idx_responses_campaign ON email_responses(campaign_id);
CREATE INDEX IF NOT EXISTS idx_responses_class ON email_responses(classification);
CREATE INDEX IF NOT EXISTS idx_responses_unprocessed ON email_responses(is_processed) WHERE is_processed = FALSE;

CREATE INDEX IF NOT EXISTS idx_dhealth_domain ON domain_health(domain_id, snapshot_at DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_unresolved ON system_alerts(is_resolved, created_at DESC) WHERE is_resolved = FALSE;
CREATE INDEX IF NOT EXISTS idx_unsub_email ON unsubscribes(email);

-- ============================================================
-- Trigger: Auto-pause domain on high bounce rate
-- ============================================================
-- When a domain_health snapshot is inserted with bounce_rate
-- above 2%, the sending domain is automatically paused and a
-- critical alert is created.
-- ============================================================
CREATE OR REPLACE FUNCTION check_domain_health()
RETURNS TRIGGER AS $$
BEGIN
    -- If bounce rate exceeds 2%, pause the domain
    IF NEW.bounce_rate > 2.0 AND NEW.is_healthy = TRUE THEN
        UPDATE sending_domains
        SET is_active = FALSE,
            paused_reason = 'Auto-paused: bounce rate ' || NEW.bounce_rate || '%',
            paused_at = NOW(),
            warmup_status = 'paused'
        WHERE id = NEW.domain_id;

        INSERT INTO system_alerts (severity, category, title, message, metadata)
        VALUES ('critical', 'domain', 'Domain auto-paused',
                'Bounce rate exceeded 2% threshold',
                jsonb_build_object('domain_id', NEW.domain_id, 'bounce_rate', NEW.bounce_rate));

        NEW.is_healthy = FALSE;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_domain_health_check ON domain_health;
CREATE TRIGGER trg_domain_health_check
    BEFORE INSERT ON domain_health
    FOR EACH ROW
    EXECUTE FUNCTION check_domain_health();

-- ============================================================
-- Trigger: Update campaign stats on send status change
-- ============================================================
-- Fires on every send_queue UPDATE. Recalculates the parent
-- campaign's aggregate counters so dashboard stats stay fresh
-- without a separate cron job.
-- ============================================================
CREATE OR REPLACE FUNCTION update_campaign_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status != OLD.status THEN
        UPDATE campaigns SET
            total_sent = (SELECT COUNT(*) FROM send_queue WHERE campaign_id = NEW.campaign_id AND status IN ('sent', 'delivered', 'opened', 'replied')),
            total_delivered = (SELECT COUNT(*) FROM send_queue WHERE campaign_id = NEW.campaign_id AND status IN ('delivered', 'opened', 'replied')),
            total_opened = (SELECT COUNT(*) FROM send_queue WHERE campaign_id = NEW.campaign_id AND status IN ('opened', 'replied')),
            total_replied = (SELECT COUNT(*) FROM send_queue WHERE campaign_id = NEW.campaign_id AND status = 'replied'),
            total_bounced = (SELECT COUNT(*) FROM send_queue WHERE campaign_id = NEW.campaign_id AND status = 'bounced'),
            reply_rate = CASE
                WHEN (SELECT COUNT(*) FROM send_queue WHERE campaign_id = NEW.campaign_id AND status IN ('sent', 'delivered', 'opened', 'replied')) > 0
                THEN (SELECT COUNT(*)::REAL FROM send_queue WHERE campaign_id = NEW.campaign_id AND status = 'replied') * 100.0 /
                     (SELECT COUNT(*) FROM send_queue WHERE campaign_id = NEW.campaign_id AND status IN ('sent', 'delivered', 'opened', 'replied'))
                ELSE 0 END,
            bounce_rate = CASE
                WHEN (SELECT COUNT(*) FROM send_queue WHERE campaign_id = NEW.campaign_id AND status IN ('sent', 'delivered', 'opened', 'replied', 'bounced')) > 0
                THEN (SELECT COUNT(*)::REAL FROM send_queue WHERE campaign_id = NEW.campaign_id AND status = 'bounced') * 100.0 /
                     (SELECT COUNT(*) FROM send_queue WHERE campaign_id = NEW.campaign_id AND status IN ('sent', 'delivered', 'opened', 'replied', 'bounced'))
                ELSE 0 END,
            updated_at = NOW()
        WHERE id = NEW.campaign_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_campaign_stats ON send_queue;
CREATE TRIGGER trg_campaign_stats
    AFTER UPDATE ON send_queue
    FOR EACH ROW
    EXECUTE FUNCTION update_campaign_stats();

-- ============================================================
-- Row-Level Security
-- ============================================================
ALTER TABLE sending_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE send_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE domain_health ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE unsubscribes ENABLE ROW LEVEL SECURITY;
