-- ============================================================
-- GTM Signals Dashboard — Sample Seed Data
-- ============================================================
--
-- Realistic B2B sample data so the dashboard works out of the
-- box. Run after 01_core.sql and 02_campaigns.sql.
--
-- Contains: 5 companies, 10 contacts, 5 signals, 2 sending
-- domains, 1 campaign, 3 send queue entries, and 1 alert.
-- ============================================================

-- ============================================================
-- Companies
-- ============================================================
INSERT INTO companies (id, name, domain, industry, employee_count, annual_revenue, funding, tech_stack, geography, icp_score, icp_segment, stage, outreach_status, source, tags) VALUES
(1, 'Acme Analytics',    'acmeanalytics.com',    'Data & Analytics',    120,  15000000, 'Series A',  ARRAY['Snowflake', 'dbt', 'Looker'],        'US - West',    85, 'enterprise',  'qualified',   'researching', 'linkedin_intent', ARRAY['high-icp', 'data-infra']),
(2, 'DataSync Corp',     'datasynccorp.com',     'Data Integration',    45,   4000000,  'Seed',      ARRAY['Fivetran', 'Postgres', 'React'],      'US - East',    72, 'mid-market',  'prospect',    'none',        'reddit_intent',   ARRAY['mid-market']),
(3, 'NovaBuild Software','novabuild.io',         'Developer Tools',     200,  30000000, 'Series B',  ARRAY['AWS', 'Kubernetes', 'Go'],            'US - West',    68, 'enterprise',  'opportunity', 'sequenced',   'engagement',      ARRAY['devtools', 'enterprise']),
(4, 'PeakRevenue AI',    'peakrevenue.ai',       'Revenue Operations',  30,   2500000,  'Pre-Seed',  ARRAY['HubSpot', 'Salesforce', 'Python'],    'US - Central', 52, 'smb',         'prospect',    'none',        'linkedin_intent', ARRAY['revops']),
(5, 'Meridian Cloud',    'meridiancloud.com',    'Cloud Infrastructure',85,   12000000, 'Series A',  ARRAY['Terraform', 'GCP', 'TypeScript'],     'EU - UK',      34, 'mid-market',  'prospect',    'none',        'reddit_intent',   ARRAY['cloud-infra']);

-- Reset sequence after explicit IDs
SELECT setval('companies_id_seq', 5);

-- ============================================================
-- Company Contacts (10 across 5 companies)
-- ============================================================
INSERT INTO company_contacts (id, company_id, first_name, last_name, email, email_status, title, seniority, unified_score, contact_rank, is_primary, source) VALUES
-- Acme Analytics (3 contacts)
(1,  1, 'Sarah',   'Chen',      'sarah.chen@acmeanalytics.com',     'valid',   'VP of Sales',            'vp',         88, 1, TRUE,  'apollo'),
(2,  1, 'Marcus',  'Rivera',    'marcus.r@acmeanalytics.com',       'valid',   'Director of Marketing',  'director',   72, 2, FALSE, 'apollo'),
(3,  1, 'Priya',   'Sharma',    'priya@acmeanalytics.com',          'valid',   'Head of Partnerships',   'director',   65, 3, FALSE, 'linkedin'),

-- DataSync Corp (2 contacts)
(4,  2, 'James',   'Okafor',    'james@datasynccorp.com',           'valid',   'CEO & Co-Founder',       'c_level',    80, 1, TRUE,  'linkedin'),
(5,  2, 'Emily',   'Tran',      'emily.tran@datasynccorp.com',      'catch_all','Head of Product',       'director',   55, 2, FALSE, 'apollo'),

-- NovaBuild Software (2 contacts)
(6,  3, 'Alex',    'Petrov',    'alex.petrov@novabuild.io',         'valid',   'CTO',                    'c_level',    91, 1, TRUE,  'engagement'),
(7,  3, 'Rachel',  'Kim',       'rachel.kim@novabuild.io',          'valid',   'Director of Engineering','director',   68, 2, FALSE, 'apollo'),

-- PeakRevenue AI (2 contacts)
(8,  4, 'David',   'Nguyen',    'david@peakrevenue.ai',             'valid',   'Founder',                'c_level',    45, 1, TRUE,  'reddit_intent'),
(9,  4, 'Laura',   'Martinez',  'laura.m@peakrevenue.ai',           'risky',   'VP of Revenue',          'vp',         38, 2, FALSE, 'apollo'),

-- Meridian Cloud (1 contact)
(10, 5, 'Tom',     'Galloway',  'tom.galloway@meridiancloud.com',   'valid',   'Manager, Cloud Ops',     'manager',    30, 1, TRUE,  'linkedin');

SELECT setval('company_contacts_id_seq', 10);

-- ============================================================
-- Company Signals (5 signals, different types and sources)
-- ============================================================
INSERT INTO company_signals (id, company_id, signal_source, signal_type, signal_snippet, outreach_hook, author_name, author_company, platform, source_url, score, published_at, created_at) VALUES
(1, 1, 'linkedin_intent', 'pain_point',
   'We spent 3 months trying to get our analytics pipeline reliable. Still breaking every Monday.',
   'Saw your post about analytics pipeline reliability. We built something that might help.',
   'Sarah Chen', 'Acme Analytics', 'linkedin',
   'https://linkedin.com/posts/example-1', 0.92,
   NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 day'),

(2, 2, 'reddit_intent', 'tool_evaluation',
   'Has anyone compared Fivetran vs Airbyte for mid-size teams? We are evaluating both.',
   'Noticed you are evaluating data integration tools. Happy to share what we have seen work at similar scale.',
   'James Okafor', 'DataSync Corp', 'reddit',
   'https://reddit.com/r/dataengineering/example-2', 0.85,
   NOW() - INTERVAL '3 days', NOW() - INTERVAL '2 days'),

(3, 3, 'engagement', 'competitor_mention',
   'We switched from CompetitorX last quarter. The migration was painful but worth it.',
   'Saw your team moved off CompetitorX. Curious how the transition went and if there are still gaps.',
   'Alex Petrov', 'NovaBuild Software', 'linkedin',
   'https://linkedin.com/posts/example-3', 0.78,
   NOW() - INTERVAL '5 days', NOW() - INTERVAL '3 days'),

(4, 4, 'linkedin_intent', 'hiring_signal',
   'Hiring our first RevOps analyst. If you know someone great, send them our way.',
   'Congrats on the RevOps hire. Building that function from scratch is a great signal. We help teams at that stage.',
   'David Nguyen', 'PeakRevenue AI', 'linkedin',
   'https://linkedin.com/posts/example-4', 0.65,
   NOW() - INTERVAL '1 day', NOW() - INTERVAL '12 hours'),

(5, 1, 'reddit_intent', 'budget_mention',
   'Our board just approved a 40% increase in data tooling budget for next year.',
   'Sounds like your data budget is growing. We help teams in that position get the most out of the spend.',
   'Marcus Rivera', 'Acme Analytics', 'reddit',
   'https://reddit.com/r/startups/example-5', 0.88,
   NOW() - INTERVAL '4 days', NOW() - INTERVAL '2 days');

SELECT setval('company_signals_id_seq', 5);

-- ============================================================
-- Sending Domains (2 domains)
-- ============================================================
INSERT INTO sending_domains (id, domain_name, spf_status, dkim_status, dmarc_status, warmup_status, daily_limit, daily_sent, bounce_rate, reply_rate, reputation, is_active) VALUES
(1, 'outreach-one.com',  'pass', 'pass', 'pass', 'warm',    50, 12, 0.8, 4.2, 82.0, TRUE),
(2, 'outreach-two.com',  'pass', 'pass', 'none', 'warming', 20, 5,  0.0, 0.0, 65.0, TRUE);

SELECT setval('sending_domains_id_seq', 2);

-- ============================================================
-- Email Template (1 template for the campaign)
-- ============================================================
INSERT INTO email_templates (id, campaign_type, name, step_number, subject, body_text, variables, is_active, times_sent, times_opened, times_replied) VALUES
(1, 'pain_point_outbound', 'Pain Point Opener', 1,
   'Quick question about {{pain_point}}',
   'Hi {{first_name}},

Saw your post about {{pain_point}} at {{company}}. We ran into the same thing and built a fix.

Worth a 15-min look?

Best,
{{sender_name}}',
   ARRAY['first_name', 'company', 'pain_point', 'sender_name'],
   TRUE, 12, 5, 2);

SELECT setval('email_templates_id_seq', 1);

-- ============================================================
-- Campaign (1 active campaign)
-- ============================================================
INSERT INTO campaigns (id, name, campaign_type, status, icp_segment, sequence_steps, daily_volume, total_sent, total_delivered, total_replied, total_bounced, reply_rate, bounce_rate, started_at, next_send_at) VALUES
(1, 'Q2 Pain Point Outbound', 'pain_point_outbound', 'active', 'enterprise', 3, 25,
   12, 10, 2, 0, 16.7, 0.0,
   NOW() - INTERVAL '5 days', NOW() + INTERVAL '8 hours');

SELECT setval('campaigns_id_seq', 1);

-- ============================================================
-- Send Queue (3 entries in different states)
-- ============================================================
INSERT INTO send_queue (id, campaign_id, contact_id, company_id, domain_id, template_id, from_email, to_email, subject, step_number, status, scheduled_for, sent_at, delivered_at, replied_at) VALUES
(1, 1, 1, 1, 1, 1,
   'hello@outreach-one.com', 'sarah.chen@acmeanalytics.com',
   'Quick question about analytics pipelines',
   1, 'replied',
   NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days', NOW() - INTERVAL '3 days'),

(2, 1, 4, 2, 1, 1,
   'hello@outreach-one.com', 'james@datasynccorp.com',
   'Quick question about data integration',
   1, 'delivered',
   NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days', NULL),

(3, 1, 6, 3, 2, 1,
   'hello@outreach-two.com', 'alex.petrov@novabuild.io',
   'Quick question about your dev toolchain',
   1, 'sent',
   NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day', NULL, NULL);

SELECT setval('send_queue_id_seq', 3);

-- ============================================================
-- System Alert (1 info-level alert)
-- ============================================================
INSERT INTO system_alerts (id, severity, category, title, message, metadata, is_resolved) VALUES
(1, 'info', 'campaign', 'Campaign daily volume reached',
   'Q2 Pain Point Outbound hit its daily send limit of 25 emails.',
   '{"campaign_id": 1, "daily_volume": 25, "daily_sent": 25}',
   FALSE);

SELECT setval('system_alerts_id_seq', 1);
