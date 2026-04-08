"use client";

import type { Alert } from "@/lib/types";
import { usePoll } from "@/hooks/use-poll";

function severityStyle(s: Alert["severity"]) {
  switch (s) {
    case "critical":
      return "bg-red-950 border-red-700 text-red-200";
    case "warning":
      return "bg-yellow-950 border-yellow-700 text-yellow-200";
    default:
      return "bg-blue-950 border-blue-700 text-blue-200";
  }
}

export function AlertsBanner() {
  const { data: alerts, refetch } = usePoll<Alert[]>("/api/alerts", 15000);

  if (!alerts?.length) return null;

  const dismiss = async (id: number) => {
    await fetch("/api/alerts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    refetch();
  };

  return (
    <div className="space-y-2">
      {alerts.slice(0, 5).map((alert) => (
        <div
          key={alert.id}
          className={`flex items-center justify-between rounded-lg border px-4 py-3 ${severityStyle(alert.severity)}`}
        >
          <div>
            <span className="font-medium text-sm">{alert.title}</span>
            <span className="text-sm ml-2 opacity-80">{alert.message}</span>
          </div>
          <button
            onClick={() => dismiss(alert.id)}
            className="text-xs opacity-60 hover:opacity-100 ml-4 shrink-0"
          >
            Dismiss
          </button>
        </div>
      ))}
    </div>
  );
}
