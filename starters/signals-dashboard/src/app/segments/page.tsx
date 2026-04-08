"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePoll } from "@/hooks/use-poll";

interface Segment {
  key: string;
  name: string;
  description: string;
  color: string;
  company_count: number;
  preview_companies: Array<{
    id: number;
    name: string;
    domain: string;
    icp_score: number | null;
  }>;
}

interface SegmentsResponse {
  segments: Segment[];
}

const COLOR_MAP: Record<string, string> = {
  cyan: "border-cyan-500/50 bg-cyan-950/20",
  blue: "border-blue-500/50 bg-blue-950/20",
  orange: "border-orange-500/50 bg-orange-950/20",
  green: "border-green-500/50 bg-green-950/20",
  purple: "border-purple-500/50 bg-purple-950/20",
  emerald: "border-emerald-500/50 bg-emerald-950/20",
};

const BADGE_COLOR_MAP: Record<string, string> = {
  cyan: "bg-cyan-600",
  blue: "bg-blue-600",
  orange: "bg-orange-600",
  green: "bg-green-600",
  purple: "bg-purple-600",
  emerald: "bg-emerald-600",
};

export default function SegmentsPage() {
  const { data, loading } = usePoll<SegmentsResponse>("/api/segments", 30000);
  const [expanded, setExpanded] = useState<string | null>(null);

  if (loading || !data) {
    return (
      <div className="max-w-[1400px] mx-auto space-y-6">
        <h2 className="text-xl font-semibold">Campaign Segments</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-40 bg-zinc-800 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Campaign Segments</h2>
          <p className="text-sm text-zinc-400 mt-1">Live-computed segments from your data sources and signals</p>
        </div>
        <a href="/accounts" className="text-sm text-blue-400 hover:underline">Browse accounts &rarr;</a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.segments.map((seg) => (
          <Card key={seg.key} className={`${COLOR_MAP[seg.color] || ""} transition-all`}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{seg.name}</CardTitle>
                <Badge className={`${BADGE_COLOR_MAP[seg.color] || "bg-zinc-600"} text-[10px]`}>
                  {seg.company_count.toLocaleString()} companies
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-zinc-400">{seg.description}</p>

              <div className="flex gap-4">
                <div>
                  <div className="text-lg font-bold">{seg.company_count.toLocaleString()}</div>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Companies</div>
                </div>
              </div>

              <button
                onClick={() => setExpanded(expanded === seg.key ? null : seg.key)}
                className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                {expanded === seg.key ? "Hide preview" : "View top companies"}
              </button>

              {expanded === seg.key && seg.preview_companies.length > 0 && (
                <div className="border-t border-zinc-800 pt-2 mt-2">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-zinc-500">
                        <th className="text-left pb-1">Company</th>
                        <th className="text-left pb-1">Domain</th>
                        <th className="text-right pb-1">ICP</th>
                      </tr>
                    </thead>
                    <tbody>
                      {seg.preview_companies.map((c) => (
                        <tr key={c.id} className="border-t border-zinc-800/30">
                          <td className="py-1 pr-2 font-medium">{c.name}</td>
                          <td className="py-1 pr-2 font-mono text-zinc-400">{c.domain || "-"}</td>
                          <td className="py-1 text-right font-mono">
                            {c.icp_score != null ? (
                              <span className={c.icp_score >= 70 ? "text-green-400" : c.icp_score >= 40 ? "text-yellow-400" : "text-zinc-500"}>
                                {c.icp_score}
                              </span>
                            ) : <span className="text-zinc-600">-</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
