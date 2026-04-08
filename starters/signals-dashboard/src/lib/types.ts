export interface DomainHealth {
  id: number;
  domain_name: string;
  warmup_status: "not_started" | "warming" | "warm" | "paused" | "burnt";
  daily_limit: number;
  daily_sent: number;
  bounce_rate: number;
  reply_rate: number;
  reputation: number;
  is_active: boolean;
  paused_reason: string | null;
  last_health_at: string | null;
}

export interface Campaign {
  id: number;
  name: string;
  campaign_type: string;
  status: "draft" | "scheduled" | "active" | "paused" | "completed" | "cancelled";
  icp_segment: string | null;
  sequence_steps: number;
  daily_volume: number;
  total_sent: number;
  total_delivered: number;
  total_opened: number;
  total_replied: number;
  total_bounced: number;
  reply_rate: number;
  bounce_rate: number;
  started_at: string | null;
  next_send_at: string | null;
}

export interface VolumeSnapshot {
  hour: string;
  sent: number;
  delivered: number;
  bounced: number;
  replied: number;
}

export interface Alert {
  id: number;
  severity: "info" | "warning" | "critical";
  category: string;
  title: string;
  message: string;
  is_resolved: boolean;
  created_at: string;
}

export interface ResponseQueueItem {
  id: number;
  from_email: string;
  subject: string | null;
  classification: string;
  confidence: number | null;
  is_processed: boolean;
  received_at: string;
  campaign_name?: string;
}

export interface DashboardStats {
  total_companies: number;
  total_contacts: number;
  total_ranked_contacts: number;
  active_campaigns: number;
  today_sent: number;
  today_replied: number;
  today_bounced: number;
  overall_reply_rate: number;
  overall_bounce_rate: number;
  domains_active: number;
  domains_total: number;
  unprocessed_responses: number;
}
