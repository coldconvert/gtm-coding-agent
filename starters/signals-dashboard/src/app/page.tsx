"use client";

import { StatCard } from "@/components/stat-card";
import { DomainGrid } from "@/components/domain-grid";
import { CampaignsTable } from "@/components/campaigns-table";
import { VolumeChart } from "@/components/volume-chart";
import { AlertsBanner } from "@/components/alerts-banner";
import type { DashboardStats } from "@/lib/types";
import { usePoll } from "@/hooks/use-poll";

/** Daily send target — adjust to match your infrastructure capacity */
const DAILY_TARGET = 24000;

export default function Dashboard() {
  const { data: stats, loading } = usePoll<DashboardStats>("/api/stats", 15000);

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <AlertsBanner />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <StatCard
          title="Companies"
          value={loading ? "-" : stats?.total_companies.toLocaleString() || "0"}
          subtitle={`${stats?.total_ranked_contacts.toLocaleString() || "0"} ranked contacts`}
        />
        <StatCard
          title="Active Campaigns"
          value={loading ? "-" : stats?.active_campaigns || 0}
        />
        <StatCard
          title="Sent Today"
          value={loading ? "-" : stats?.today_sent.toLocaleString() || "0"}
          subtitle={`${((stats?.today_sent || 0) / DAILY_TARGET * 100).toFixed(0)}% of target`}
        />
        <StatCard
          title="Replies Today"
          value={loading ? "-" : stats?.today_replied || 0}
          subtitle={`${stats?.overall_reply_rate.toFixed(1) || "0.0"}% rate`}
        />
        <StatCard
          title="Bounce Rate"
          value={loading ? "-" : `${stats?.overall_bounce_rate.toFixed(1) || "0.0"}%`}
          alert={(stats?.overall_bounce_rate || 0) > 2}
        />
        <StatCard
          title="Domains"
          value={loading ? "-" : `${stats?.domains_active || 0}/${stats?.domains_total || 0}`}
          subtitle={`${stats?.unprocessed_responses || 0} unprocessed replies`}
        />
      </div>

      {/* Volume Chart */}
      <VolumeChart />

      {/* Domain Health + Campaigns */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <DomainGrid />
        <CampaignsTable />
      </div>
    </div>
  );
}
