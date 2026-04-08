import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  // Get today's sends grouped by hour
  const today = new Date().toISOString().slice(0, 10);
  const { data, error } = await supabase
    .from("send_queue")
    .select("status, sent_at")
    .gte("created_at", today)
    .not("sent_at", "is", null);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Group by hour
  const hourly: Record<
    string,
    { sent: number; delivered: number; bounced: number; replied: number }
  > = {};
  for (let h = 0; h < 24; h++) {
    const key = `${h.toString().padStart(2, "0")}:00`;
    hourly[key] = { sent: 0, delivered: 0, bounced: 0, replied: 0 };
  }

  for (const row of data || []) {
    if (!row.sent_at) continue;
    const hour = new Date(row.sent_at).getHours();
    const key = `${hour.toString().padStart(2, "0")}:00`;
    if (!hourly[key]) continue;

    hourly[key].sent++;
    if (row.status === "delivered" || row.status === "opened" || row.status === "replied") {
      hourly[key].delivered++;
    }
    if (row.status === "bounced") hourly[key].bounced++;
    if (row.status === "replied") hourly[key].replied++;
  }

  const result = Object.entries(hourly).map(([hour, counts]) => ({
    hour,
    ...counts,
  }));

  return NextResponse.json(result);
}
