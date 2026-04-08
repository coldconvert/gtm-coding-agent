"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Account {
  id: number;
  name: string;
  domain: string;
  industry: string | null;
  employee_count: number | null;
  icp_score: number | null;
  icp_segment: string | null;
  stage: string;
  outreach_status: string;
  source: string | null;
  tags: string[];
  created_at: string;
  contact_count: number;
  ranked_count: number;
  contact_sources: string[];
  signal_count: number;
  company_contacts: Array<{
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    title: string;
    unified_score: number;
    contact_rank: number | null;
    source: string;
  }>;
  company_signals: Array<{
    id: number;
    signal_source: string;
    signal_type: string;
    signal_snippet: string | null;
    outreach_hook: string | null;
    author_name: string | null;
    score: number | null;
  }>;
}

const SIGNAL_COLORS: Record<string, string> = {
  pain_point: "bg-red-600", tool_rec: "bg-blue-600", comparison: "bg-purple-600",
  budget: "bg-yellow-600", broken_process: "bg-orange-600", scaling: "bg-cyan-600",
  migration: "bg-pink-600", hiring: "bg-green-600", how_to: "bg-indigo-600",
  launching: "bg-teal-600", engagement: "bg-zinc-600",
};

interface PageResponse {
  data: Account[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<PageResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("");
  const [expanded, setExpanded] = useState<number | null>(null);

  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), per_page: "30" });
    if (search) params.set("q", search);
    if (stageFilter) params.set("stage", stageFilter);
    const res = await fetch(`/api/database/accounts?${params}`);
    setAccounts(await res.json());
    setLoading(false);
  }, [page, search, stageFilter]);

  useEffect(() => { fetchAccounts(); }, [fetchAccounts]);

  const stages = ["prospect", "qualified", "opportunity", "customer", "churned", "archived"];

  return (
    <div className="max-w-[1400px] mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Accounts</h2>
        <div className="flex items-center gap-4">
          <a href="/database" className="text-sm text-blue-400 hover:underline">&larr; Database overview</a>
          <a href="/" className="text-sm text-blue-400 hover:underline">&larr; Dashboard</a>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 items-center">
        <input
          type="text"
          placeholder="Search company or domain..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:border-blue-500"
        />
        <div className="flex gap-1">
          <button
            onClick={() => { setStageFilter(""); setPage(1); }}
            className={`px-3 py-1.5 rounded text-xs ${!stageFilter ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"}`}
          >All</button>
          {stages.map((s) => (
            <button
              key={s}
              onClick={() => { setStageFilter(s); setPage(1); }}
              className={`px-3 py-1.5 rounded text-xs capitalize ${stageFilter === s ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"}`}
            >{s}</button>
          ))}
        </div>
        {accounts && (
          <span className="text-xs text-zinc-500 ml-auto">
            {accounts.total.toLocaleString()} accounts
          </span>
        )}
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 text-left text-zinc-400 text-xs">
                <th className="p-3">Company</th>
                <th className="p-3">Domain</th>
                <th className="p-3">Industry</th>
                <th className="p-3 text-center">ICP</th>
                <th className="p-3">Stage</th>
                <th className="p-3 text-center">Contacts</th>
                <th className="p-3 text-center">Signals</th>
                <th className="p-3">Sources</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <tr key={i}><td colSpan={8} className="p-3"><div className="h-6 bg-zinc-800 rounded animate-pulse" /></td></tr>
                ))
              ) : (
                (accounts?.data || []).map((a) => (
                  <>
                    <tr
                      key={a.id}
                      className="border-b border-zinc-800/50 hover:bg-zinc-900/50 cursor-pointer"
                      onClick={() => setExpanded(expanded === a.id ? null : a.id)}
                    >
                      <td className="p-3 font-medium">{a.name}</td>
                      <td className="p-3 font-mono text-xs text-zinc-400">{a.domain || "-"}</td>
                      <td className="p-3 text-zinc-400 text-xs">{a.industry || "-"}</td>
                      <td className="p-3 text-center">
                        {a.icp_score != null ? (
                          <span className={`font-mono font-bold ${a.icp_score >= 70 ? "text-green-400" : a.icp_score >= 40 ? "text-yellow-400" : "text-zinc-500"}`}>
                            {a.icp_score}
                          </span>
                        ) : <span className="text-zinc-600">-</span>}
                      </td>
                      <td className="p-3"><Badge variant="outline" className="text-xs">{a.stage}</Badge></td>
                      <td className="p-3 text-center">
                        <span className="font-mono">{a.ranked_count}</span>
                        <span className="text-zinc-600">/{a.contact_count}</span>
                      </td>
                      <td className="p-3 text-center">
                        <span className={`font-mono ${a.signal_count >= 3 ? "text-green-400" : a.signal_count >= 2 ? "text-yellow-400" : "text-zinc-500"}`}>
                          {a.signal_count}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-1 flex-wrap">
                          {a.contact_sources.map((s) => (
                            <Badge key={s} variant="secondary" className="text-[10px] py-0">{s}</Badge>
                          ))}
                        </div>
                      </td>
                    </tr>
                    {expanded === a.id && (
                      <tr key={`${a.id}-detail`} className="bg-zinc-900/30">
                        <td colSpan={8} className="p-4 space-y-4">
                          {/* Contacts */}
                          <div>
                            <div className="text-xs font-medium text-zinc-400 mb-2">
                              Contacts ({a.company_contacts.length})
                            </div>
                            <table className="w-full text-xs">
                              <thead>
                                <tr className="text-zinc-500">
                                  <th className="text-left pb-1">Rank</th>
                                  <th className="text-left pb-1">Name</th>
                                  <th className="text-left pb-1">Email</th>
                                  <th className="text-left pb-1">Title</th>
                                  <th className="text-right pb-1">Score</th>
                                  <th className="text-left pb-1">Source</th>
                                </tr>
                              </thead>
                              <tbody>
                                {a.company_contacts
                                  .sort((x, y) => (x.contact_rank || 99) - (y.contact_rank || 99))
                                  .map((c) => (
                                    <tr key={c.id} className="border-t border-zinc-800/30">
                                      <td className="py-1.5 pr-3">
                                        {c.contact_rank ? (
                                          <Badge className="text-[10px] bg-blue-600 py-0">#{c.contact_rank}</Badge>
                                        ) : (
                                          <span className="text-zinc-600">-</span>
                                        )}
                                      </td>
                                      <td className="py-1.5 pr-3">{c.first_name} {c.last_name}</td>
                                      <td className="py-1.5 pr-3 font-mono text-zinc-400">{c.email || "-"}</td>
                                      <td className="py-1.5 pr-3 text-zinc-400">{c.title || "-"}</td>
                                      <td className="py-1.5 text-right font-mono">{c.unified_score}</td>
                                      <td className="py-1.5 text-zinc-400">{c.source || "-"}</td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                          </div>

                          {/* Signals */}
                          {a.company_signals.length > 0 && (
                            <div>
                              <div className="text-xs font-medium text-zinc-400 mb-2">
                                Signals ({a.company_signals.length})
                              </div>
                              <table className="w-full text-xs">
                                <thead>
                                  <tr className="text-zinc-500">
                                    <th className="text-left pb-1">Type</th>
                                    <th className="text-left pb-1">Snippet</th>
                                    <th className="text-left pb-1">Author</th>
                                    <th className="text-left pb-1">Source</th>
                                    <th className="text-right pb-1">Score</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {a.company_signals.map((s) => (
                                    <tr key={s.id} className="border-t border-zinc-800/30">
                                      <td className="py-1.5 pr-3">
                                        <Badge className={`text-[10px] py-0 ${SIGNAL_COLORS[s.signal_type] || "bg-zinc-600"}`}>
                                          {s.signal_type.replace(/_/g, " ")}
                                        </Badge>
                                      </td>
                                      <td className="py-1.5 pr-3 text-zinc-400 max-w-[300px] truncate" title={s.signal_snippet || ""}>
                                        {(s.signal_snippet || "").slice(0, 80)}{(s.signal_snippet || "").length > 80 ? "..." : ""}
                                      </td>
                                      <td className="py-1.5 pr-3">{s.author_name || "-"}</td>
                                      <td className="py-1.5 pr-3">
                                        <Badge variant="outline" className="text-[10px] py-0">{s.signal_source.replace(/_/g, " ")}</Badge>
                                      </td>
                                      <td className="py-1.5 text-right font-mono">
                                        <span className={s.score && s.score >= 60 ? "text-green-400" : s.score && s.score >= 30 ? "text-yellow-400" : "text-zinc-500"}>
                                          {s.score?.toFixed(0) || "-"}
                                        </span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </>
                ))
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {accounts && accounts.total_pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1.5 rounded bg-zinc-800 text-sm disabled:opacity-30 hover:bg-zinc-700"
          >Prev</button>
          <span className="text-sm text-zinc-400">
            Page {page} of {accounts.total_pages}
          </span>
          <button
            disabled={page >= accounts.total_pages}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1.5 rounded bg-zinc-800 text-sm disabled:opacity-30 hover:bg-zinc-700"
          >Next</button>
        </div>
      )}
    </div>
  );
}
