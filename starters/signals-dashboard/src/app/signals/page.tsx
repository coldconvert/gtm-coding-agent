"use client";

import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { usePoll } from "@/hooks/use-poll";

interface SignalStats {
  totals: {
    total_signals: number;
    companies_with_signals: number;
    total_companies: number;
    avg_signals_per_company: number;
    top_signal_type: string;
  };
  type_distribution: Record<string, number>;
  source_distribution: Record<string, number>;
  signal_rich_companies: Array<{
    id: number;
    name: string;
    domain: string;
    icp_score: number | null;
    signal_count: number;
    top_types: string[];
  }>;
}

const SIGNAL_TYPE_COLORS: Record<string, string> = {
  pain_point: "#ef4444",
  tool_rec: "#3b82f6",
  comparison: "#a855f7",
  budget: "#eab308",
  broken_process: "#f97316",
  scaling: "#06b6d4",
  migration: "#ec4899",
  hiring: "#22c55e",
  how_to: "#6366f1",
  launching: "#14b8a6",
  engagement: "#71717a",
  collab: "#f59e0b",
  stack_share: "#8b5cf6",
  ama: "#64748b",
  wins: "#10b981",
  hot_take: "#f43f5e",
  roast: "#d946ef",
};

const SOURCE_COLORS: Record<string, string> = {
  linkedin_intent: "#3b82f6",
  engagement: "#f97316",
  reddit_intent: "#ef4444",
};

const BADGE_COLORS: Record<string, string> = {
  pain_point: "bg-red-600", tool_rec: "bg-blue-600", comparison: "bg-purple-600",
  budget: "bg-yellow-600", broken_process: "bg-orange-600", scaling: "bg-cyan-600",
  migration: "bg-pink-600", hiring: "bg-green-600", engagement: "bg-zinc-600",
};

export default function SignalsPage() {
  const { data: stats, loading } = usePoll<SignalStats>("/api/signals", 30000);

  if (loading || !stats) {
    return (
      <div className="max-w-[1400px] mx-auto space-y-6">
        <h2 className="text-xl font-semibold">Signal Intelligence</h2>
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-zinc-800 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const typeData = Object.entries(stats.type_distribution)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ name: name.replace(/_/g, " "), value, key: name }));

  const sourceData = Object.entries(stats.source_distribution)
    .map(([name, value]) => ({ name: name.replace(/_/g, " "), value, key: name }));

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Signal Intelligence</h2>
        <a href="/accounts" className="text-sm text-blue-400 hover:underline">Browse accounts &rarr;</a>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Signals" value={stats.totals.total_signals.toLocaleString()} />
        <StatCard
          title="Companies w/ Signals"
          value={stats.totals.companies_with_signals.toLocaleString()}
          subtitle={`of ${stats.totals.total_companies.toLocaleString()} companies`}
        />
        <StatCard title="Avg Signals / Company" value={stats.totals.avg_signals_per_company.toFixed(1)} />
        <StatCard title="Top Signal Type" value={stats.totals.top_signal_type.replace(/_/g, " ")} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Signal Type Distribution */}
        <Card>
          <CardHeader><CardTitle>Signal Type Distribution</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={typeData} margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" tick={{ fill: "#888", fontSize: 10 }} angle={-35} textAnchor="end" height={80} />
                <YAxis tick={{ fill: "#888", fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: "#18181b", border: "1px solid #333", borderRadius: 8 }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {typeData.map((entry) => (
                    <Cell key={entry.key} fill={SIGNAL_TYPE_COLORS[entry.key] || "#6b7280"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Signal Source Breakdown */}
        <Card>
          <CardHeader><CardTitle>Signal Source Breakdown</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={sourceData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3}>
                  {sourceData.map((entry) => (
                    <Cell key={entry.key} fill={SOURCE_COLORS[entry.key] || "#6b7280"} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#18181b", border: "1px solid #333", borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-3 mt-2 justify-center">
              {sourceData.map((s) => (
                <div key={s.key} className="flex items-center gap-1.5 text-xs">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: SOURCE_COLORS[s.key] || "#6b7280" }} />
                  <span className="text-zinc-400">{s.name}</span>
                  <span className="font-mono">{s.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Signal-Rich Companies */}
      <Card>
        <CardHeader><CardTitle>Signal-Rich Companies</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800 text-left text-zinc-400 text-xs">
                  <th className="pb-2 pr-4">Company</th>
                  <th className="pb-2 pr-4">Domain</th>
                  <th className="pb-2 pr-4 text-center">Signals</th>
                  <th className="pb-2 pr-4">Top Types</th>
                  <th className="pb-2 text-center">ICP</th>
                </tr>
              </thead>
              <tbody>
                {stats.signal_rich_companies.map((c) => (
                  <tr key={c.id} className="border-b border-zinc-800/50 hover:bg-zinc-900/50">
                    <td className="py-2 pr-4 font-medium">{c.name}</td>
                    <td className="py-2 pr-4 font-mono text-xs text-zinc-400">{c.domain || "-"}</td>
                    <td className="py-2 pr-4 text-center">
                      <span className={`font-mono font-bold ${c.signal_count >= 10 ? "text-green-400" : c.signal_count >= 5 ? "text-yellow-400" : "text-zinc-400"}`}>
                        {c.signal_count}
                      </span>
                    </td>
                    <td className="py-2 pr-4">
                      <div className="flex gap-1 flex-wrap">
                        {c.top_types.map((t) => (
                          <Badge key={t} className={`text-[10px] py-0 ${BADGE_COLORS[t] || "bg-zinc-600"}`}>
                            {t.replace(/_/g, " ")}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="py-2 text-center">
                      {c.icp_score != null ? (
                        <span className={`font-mono font-bold ${c.icp_score >= 70 ? "text-green-400" : c.icp_score >= 40 ? "text-yellow-400" : "text-zinc-500"}`}>
                          {c.icp_score}
                        </span>
                      ) : <span className="text-zinc-600">-</span>}
                    </td>
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
