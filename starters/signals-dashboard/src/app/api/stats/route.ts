import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { DashboardStats } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const [
    companiesRes,
    contactsRes,
    rankedRes,
    campaignsRes,
    domainsRes,
    todaySentRes,
    responsesRes,
  ] = await Promise.all([
    supabase.from("companies").select("id", { count: "exact", head: true }),
    supabase
      .from("company_contacts")
      .select("id", { count: "exact", head: true }),
    supabase
      .from("company_contacts")
      .select("id", { count: "exact", head: true })
      .not("contact_rank", "is", null),
    supabase
      .from("campaigns")
      .select("id", { count: "exact", head: true })
      .eq("status", "active"),
    supabase.from("sending_domains").select("id, is_active"),
    supabase
      .from("send_queue")
      .select("status")
      .gte("created_at", new Date().toISOString().slice(0, 10)),
    supabase
      .from("email_responses")
      .select("id", { count: "exact", head: true })
      .eq("is_processed", false),
  ]);

  const domains = domainsRes.data || [];
  const todaySends = todaySentRes.data || [];

  const todaySent = todaySends.length;
  const todayReplied = todaySends.filter((s) => s.status === "replied").length;
  const todayBounced = todaySends.filter((s) => s.status === "bounced").length;

  const stats: DashboardStats = {
    total_companies: companiesRes.count || 0,
    total_contacts: contactsRes.count || 0,
    total_ranked_contacts: rankedRes.count || 0,
    active_campaigns: campaignsRes.count || 0,
    today_sent: todaySent,
    today_replied: todayReplied,
    today_bounced: todayBounced,
    overall_reply_rate: todaySent > 0 ? (todayReplied / todaySent) * 100 : 0,
    overall_bounce_rate: todaySent > 0 ? (todayBounced / todaySent) * 100 : 0,
    domains_active: domains.filter((d) => d.is_active).length,
    domains_total: domains.length,
    unprocessed_responses: responsesRes.count || 0,
  };

  return NextResponse.json(stats);
}
