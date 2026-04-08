"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { VolumeSnapshot } from "@/lib/types";
import { usePoll } from "@/hooks/use-poll";

/** Daily send target — adjust to match your infrastructure capacity */
const DAILY_TARGET = 24000;

export function VolumeChart() {
  const { data: volume, loading } = usePoll<VolumeSnapshot[]>("/api/volume", 30000);

  const totalSent = volume?.reduce((sum, v) => sum + v.sent, 0) || 0;
  const pct = DAILY_TARGET > 0 ? ((totalSent / DAILY_TARGET) * 100).toFixed(0) : "0";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Send Volume (Today)
          <span className="text-sm font-normal text-muted-foreground">
            {totalSent.toLocaleString()} / {DAILY_TARGET.toLocaleString()} ({pct}%)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[250px] bg-zinc-800 rounded animate-pulse" />
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={volume || []} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis
                dataKey="hour"
                tick={{ fill: "#888", fontSize: 11 }}
                interval={2}
              />
              <YAxis tick={{ fill: "#888", fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#18181b",
                  border: "1px solid #333",
                  borderRadius: 8,
                }}
              />
              <Legend />
              <Bar dataKey="sent" fill="#3b82f6" name="Sent" radius={[2, 2, 0, 0]} />
              <Bar dataKey="delivered" fill="#22c55e" name="Delivered" radius={[2, 2, 0, 0]} />
              <Bar dataKey="bounced" fill="#ef4444" name="Bounced" radius={[2, 2, 0, 0]} />
              <Bar dataKey="replied" fill="#a855f7" name="Replied" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
