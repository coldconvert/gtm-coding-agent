"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { DomainHealth } from "@/lib/types";
import { usePoll } from "@/hooks/use-poll";

function healthColor(domain: DomainHealth): string {
  if (!domain.is_active) return "bg-red-900/40 border-red-700";
  if (domain.warmup_status === "burnt") return "bg-red-900/40 border-red-700";
  if (domain.bounce_rate > 2) return "bg-orange-900/40 border-orange-700";
  if (domain.warmup_status === "warming") return "bg-yellow-900/40 border-yellow-700";
  if (domain.warmup_status === "warm") return "bg-green-900/40 border-green-700";
  return "bg-zinc-900/40 border-zinc-700";
}

function statusBadge(domain: DomainHealth) {
  if (!domain.is_active) return <Badge variant="destructive">Paused</Badge>;
  if (domain.warmup_status === "burnt") return <Badge variant="destructive">Burnt</Badge>;
  if (domain.warmup_status === "warming") return <Badge className="bg-yellow-600">Warming</Badge>;
  if (domain.warmup_status === "warm") return <Badge className="bg-green-600">Warm</Badge>;
  return <Badge variant="secondary">Inactive</Badge>;
}

export function DomainGrid() {
  const { data: domains, loading } = usePoll<DomainHealth[]>("/api/domains", 30000);

  if (loading) {
    return (
      <Card>
        <CardHeader><CardTitle>Domain Health</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-28 rounded-lg bg-zinc-800 animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const sorted = [...(domains || [])].sort((a, b) => {
    if (a.is_active !== b.is_active) return a.is_active ? -1 : 1;
    return b.reputation - a.reputation;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Domain Health
          <span className="text-sm font-normal text-muted-foreground">
            {sorted.filter((d) => d.is_active).length}/{sorted.length} active
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sorted.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No domains configured. Add domains via the API to get started.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {sorted.map((domain) => (
              <div
                key={domain.id}
                className={`rounded-lg border p-3 ${healthColor(domain)}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono truncate max-w-[120px]">
                    {domain.domain_name}
                  </span>
                  {statusBadge(domain)}
                </div>
                <div className="grid grid-cols-2 gap-1 text-xs">
                  <div>
                    <span className="text-muted-foreground">Sent</span>
                    <div className="font-medium">
                      {domain.daily_sent}/{domain.daily_limit}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Rep</span>
                    <div className="font-medium">{domain.reputation.toFixed(0)}%</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Bounce</span>
                    <div
                      className={`font-medium ${domain.bounce_rate > 2 ? "text-red-400" : ""}`}
                    >
                      {domain.bounce_rate.toFixed(1)}%
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Reply</span>
                    <div className="font-medium">{domain.reply_rate.toFixed(1)}%</div>
                  </div>
                </div>
                {domain.paused_reason && (
                  <p className="text-xs text-red-400 mt-2 truncate">
                    {domain.paused_reason}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
