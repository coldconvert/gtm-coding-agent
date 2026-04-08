"use client";

import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { usePoll } from "@/hooks/use-poll";

interface DatabaseStats {
  totals: {
    companies: number;
    contacts: number;
    ranked_contacts: number;
    overflow_contacts: number;
  };
  enrichment: {
    companies_with_icp: number;
    companies_with_research: number;
    companies_with_tech_stack: number;
    contacts_with_email: number;
    contacts_valid_email: number;
    contacts_with_title: number;
    contacts_with_linkedin: number;
    icp_coverage_pct: number;
    research_coverage_pct: number;
    email_coverage_pct: number;
  };
  stages: Record<string, number>;
  sources: Record<string, number>;
  score_distribution: Record<string, number>;
  top_companies: Array<{
    id: number; name: string; domain: string; icp_score: number;
    stage: string; industry: string; employee_count: number; source: string;
  }>;
  recent_companies: Array<{
    id: number; name: string; domain: string; icp_score: number;
    stage: string; source: string; created_at: string;
  }>;
  signals: {
    total_signals: number;
    companies_with_signals: number;
    signal_coverage_pct: number;
  };
}

const STAGE_COLORS: Record<string, string> = {
  prospect: "#3b82f6",
  qualified: "#22c55e",
  opportunity: "#a855f7",
  customer: "#eab308",
  churned: "#ef4444",
  archived: "#6b7280",
};

const SOURCE_COLORS = ["#3b82f6", "#22c55e", "#a855f7", "#eab308", "#ef4444", "#06b6d4", "#f97316", "#ec4899"];

function EnrichmentBar({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  const pct = total > 0 ? (value / total) * 100 : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-zinc-400">{label}</span>
        <span className="font-mono text-xs">{value.toLocaleString()} / {total.toLocaleString()} ({pct.toFixed(0)}%)</span>
      </div>
      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

export default function DatabasePage() {
  const { data: db, loading } = usePoll<DatabaseStats>("/api/database", 30000);

  if (loading || !db) {
    return (
      <div className="max-w-[1400px] mx-auto space-y-6">
        <h2 className="text-xl font-semibold">Database Intelligence</h2>
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-24 bg-zinc-800 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const stageData = Object.entries(db.stages).map(([name, value]) => ({ name, value }));
  const sourceData = Object.entries(db.sources)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ name, value }));
  const scoreData = Object.entries(db.score_distribution).map(([name, value]) => ({ name, value }));

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Database Intelligence</h2>
        <a href="/accounts" className="text-sm text-blue-400 hover:underline">
          Browse all accounts &rarr;
        </a>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard title="Companies" value={db.totals.companies.toLocaleString()} />
        <StatCard title="Contacts (Ranked)" value={db.totals.ranked_contacts.toLocaleString()} subtitle={`${db.totals.overflow_contacts.toLocaleString()} in overflow`} />
        <StatCard title="Total Contacts" value={db.totals.contacts.toLocaleString()} subtitle="max 3 ranked per company" />
        <StatCard title="ICP Scored" value={`${db.enrichment.icp_coverage_pct.toFixed(0)}%`} subtitle={`${db.enrichment.companies_with_icp} companies`} />
        <StatCard title="Email Coverage" value={`${db.enrichment.email_coverage_pct.toFixed(0)}%`} subtitle={`${db.enrichment.contacts_valid_email} verified`} />
        <StatCard title="Signal Coverage" value={`${db.signals.signal_coverage_pct.toFixed(0)}%`} subtitle={`${db.signals.companies_with_signals} companies · ${db.signals.total_signals} signals`} />
      </div>

      {/* Enrichment Coverage */}
      <Card>
        <CardHeader><CardTitle>Enrichment Coverage</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <EnrichmentBar label="ICP Score" value={db.enrichment.companies_with_icp} total={db.totals.companies} color="#3b82f6" />
          <EnrichmentBar label="Exa Research" value={db.enrichment.companies_with_research} total={db.totals.companies} color="#22c55e" />
          <EnrichmentBar label="Tech Stack" value={db.enrichment.companies_with_tech_stack} total={db.totals.companies} color="#a855f7" />
          <EnrichmentBar label="Contact Email" value={db.enrichment.contacts_with_email} total={db.totals.contacts} color="#eab308" />
          <EnrichmentBar label="Valid Email" value={db.enrichment.contacts_valid_email} total={db.totals.contacts} color="#22c55e" />
          <EnrichmentBar label="Job Title" value={db.enrichment.contacts_with_title} total={db.totals.contacts} color="#06b6d4" />
          <EnrichmentBar label="LinkedIn URL" value={db.enrichment.contacts_with_linkedin} total={db.totals.contacts} color="#f97316" />
          <EnrichmentBar label="Signal Coverage" value={db.signals.companies_with_signals} total={db.totals.companies} color="#ec4899" />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pipeline Stage */}
        <Card>
          <CardHeader><CardTitle>Pipeline Stage</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={stageData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2}>
                  {stageData.map((entry) => (
                    <Cell key={entry.name} fill={STAGE_COLORS[entry.name] || "#6b7280"} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#18181b", border: "1px solid #333", borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 mt-2">
              {stageData.map((s) => (
                <div key={s.name} className="flex items-center gap-1.5 text-xs">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: STAGE_COLORS[s.name] || "#6b7280" }} />
                  <span className="text-zinc-400">{s.name}</span>
                  <span className="font-mono">{s.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contact Sources */}
        <Card>
          <CardHeader><CardTitle>Contact Sources</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={sourceData} layout="vertical" margin={{ left: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis type="number" tick={{ fill: "#888", fontSize: 11 }} />
                <YAxis dataKey="name" type="category" tick={{ fill: "#888", fontSize: 11 }} width={55} />
                <Tooltip contentStyle={{ backgroundColor: "#18181b", border: "1px solid #333", borderRadius: 8 }} />
                <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Contact Score Distribution */}
        <Card>
          <CardHeader><CardTitle>Contact Score Distribution</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={scoreData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" tick={{ fill: "#888", fontSize: 11 }} />
                <YAxis tick={{ fill: "#888", fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: "#18181b", border: "1px solid #333", borderRadius: 8 }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {scoreData.map((_, i) => (
                    <Cell key={i} fill={SOURCE_COLORS[i % SOURCE_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Companies by ICP */}
      <Card>
        <CardHeader><CardTitle>Top Companies by ICP Score</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800 text-left text-zinc-400">
                  <th className="pb-2 pr-4">Company</th>
                  <th className="pb-2 pr-4">Domain</th>
                  <th className="pb-2 pr-4">Industry</th>
                  <th className="pb-2 pr-4">Employees</th>
                  <th className="pb-2 pr-4">ICP</th>
                  <th className="pb-2 pr-4">Stage</th>
                  <th className="pb-2">Source</th>
                </tr>
              </thead>
              <tbody>
                {db.top_companies.map((c) => (
                  <tr key={c.id} className="border-b border-zinc-800/50 hover:bg-zinc-900/50">
                    <td className="py-2 pr-4 font-medium">{c.name}</td>
                    <td className="py-2 pr-4 font-mono text-xs text-zinc-400">{c.domain}</td>
                    <td className="py-2 pr-4 text-zinc-400">{c.industry || "-"}</td>
                    <td className="py-2 pr-4 tabular-nums">{c.employee_count?.toLocaleString() || "-"}</td>
                    <td className="py-2 pr-4">
                      <span className={`font-mono font-bold ${c.icp_score >= 70 ? "text-green-400" : c.icp_score >= 40 ? "text-yellow-400" : "text-zinc-400"}`}>
                        {c.icp_score}
                      </span>
                    </td>
                    <td className="py-2 pr-4">
                      <Badge variant="outline" className="text-xs">{c.stage}</Badge>
                    </td>
                    <td className="py-2 text-xs text-zinc-400">{c.source || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
