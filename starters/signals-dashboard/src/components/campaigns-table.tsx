"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Campaign } from "@/lib/types";
import { usePoll } from "@/hooks/use-poll";

function statusVariant(status: Campaign["status"]) {
  switch (status) {
    case "active":
      return "default" as const;
    case "paused":
      return "secondary" as const;
    case "completed":
      return "outline" as const;
    case "draft":
      return "secondary" as const;
    case "cancelled":
      return "destructive" as const;
    default:
      return "secondary" as const;
  }
}

export function CampaignsTable() {
  const { data: campaigns, loading } = usePoll<Campaign[]>("/api/campaigns", 30000);

  if (loading) {
    return (
      <Card>
        <CardHeader><CardTitle>Campaigns</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-10 bg-zinc-800 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Campaigns
          <span className="text-sm font-normal text-muted-foreground">
            {(campaigns || []).filter((c) => c.status === "active").length} active
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!campaigns?.length ? (
          <p className="text-muted-foreground text-sm">No campaigns yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Sent</TableHead>
                <TableHead className="text-right">Reply %</TableHead>
                <TableHead className="text-right">Bounce %</TableHead>
                <TableHead className="text-right">Volume/day</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {c.campaign_type}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(c.status)}>{c.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {c.total_sent.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {c.reply_rate.toFixed(1)}%
                  </TableCell>
                  <TableCell
                    className={`text-right tabular-nums ${c.bounce_rate > 2 ? "text-red-400" : ""}`}
                  >
                    {c.bounce_rate.toFixed(1)}%
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {c.daily_volume.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
