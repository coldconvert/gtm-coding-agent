import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const SEGMENT_DEFS = [
  { key: "x_followers", name: "X Followers", description: "Companies sourced from Twitter/X followers", color: "cyan" },
  { key: "linkedin_network", name: "LinkedIn Network", description: "Companies from LinkedIn connections", color: "blue" },
  { key: "engagement_warm", name: "Engagement Warm", description: "Companies with people who engaged with your content", color: "orange" },
  { key: "high_icp_signals", name: "High ICP + Signals", description: "ICP score >= 70 with at least one signal mapped", color: "green" },
  { key: "multi_source", name: "Multi-Source", description: "Companies appearing in multiple data sources", color: "purple" },
  { key: "ready_for_outreach", name: "Ready for Outreach", description: "Has contacts + signals + ICP score >= 40", color: "emerald" },
] as const;

const X_SOURCE_FILTER = "source.eq.x,source.like.x\\,%,source.like.%\\,x,source.like.%\\,x\\,%";
const LI_SOURCE_FILTER = "source.eq.linkedin,source.like.linkedin\\,%,source.like.%\\,linkedin,source.like.%\\,linkedin\\,%";

export async function GET() {
  // Phase 1: Fetch base datasets (signal + engagement company ID sets)
  const [signalRows, engagementRows] = await Promise.all([
    supabase.from("company_signals").select("company_id"),
    supabase.from("company_signals").select("company_id").eq("signal_source", "engagement"),
  ]);

  const signalIds = [...new Set((signalRows.data || []).map((r) => r.company_id))];
  const engagementIds = [...new Set((engagementRows.data || []).map((r) => r.company_id))];

  // Phase 2: All segment counts + previews in parallel (no circular deps)
  const [
    xCount, liCount, multiCount,
    engCount, highIcpCount, readyCount,
    xPreview, liPreview, engPreview, highIcpPreview, multiPreview, readyPreview,
  ] = await Promise.all([
    // Counts
    supabase.from("companies").select("id", { count: "exact", head: true }).or(X_SOURCE_FILTER),
    supabase.from("companies").select("id", { count: "exact", head: true }).or(LI_SOURCE_FILTER),
    supabase.from("companies").select("id", { count: "exact", head: true }).like("source", "%,%"),
    engagementIds.length > 0
      ? supabase.from("companies").select("id", { count: "exact", head: true }).in("id", engagementIds)
      : Promise.resolve({ count: 0 }),
    signalIds.length > 0
      ? supabase.from("companies").select("id", { count: "exact", head: true }).gte("icp_score", 70).in("id", signalIds)
      : Promise.resolve({ count: 0 }),
    signalIds.length > 0
      ? supabase.from("companies").select("id", { count: "exact", head: true }).gte("icp_score", 40).in("id", signalIds)
      : Promise.resolve({ count: 0 }),

    // Previews (top 20 each)
    supabase.from("companies").select("id, name, domain, icp_score").or(X_SOURCE_FILTER)
      .order("icp_score", { ascending: false, nullsFirst: false }).limit(20),
    supabase.from("companies").select("id, name, domain, icp_score").or(LI_SOURCE_FILTER)
      .order("icp_score", { ascending: false, nullsFirst: false }).limit(20),
    engagementIds.length > 0
      ? supabase.from("companies").select("id, name, domain, icp_score").in("id", engagementIds)
          .order("icp_score", { ascending: false, nullsFirst: false }).limit(20)
      : Promise.resolve({ data: [] }),
    signalIds.length > 0
      ? supabase.from("companies").select("id, name, domain, icp_score").gte("icp_score", 70).in("id", signalIds)
          .order("icp_score", { ascending: false, nullsFirst: false }).limit(20)
      : Promise.resolve({ data: [] }),
    supabase.from("companies").select("id, name, domain, icp_score").like("source", "%,%")
      .order("icp_score", { ascending: false, nullsFirst: false }).limit(20),
    signalIds.length > 0
      ? supabase.from("companies").select("id, name, domain, icp_score").gte("icp_score", 40).in("id", signalIds)
          .order("icp_score", { ascending: false, nullsFirst: false }).limit(20)
      : Promise.resolve({ data: [] }),
  ]);

  const segments = [
    { ...SEGMENT_DEFS[0], company_count: xCount.count || 0, preview_companies: xPreview.data || [] },
    { ...SEGMENT_DEFS[1], company_count: liCount.count || 0, preview_companies: liPreview.data || [] },
    { ...SEGMENT_DEFS[2], company_count: engCount.count || 0, preview_companies: engPreview.data || [] },
    { ...SEGMENT_DEFS[3], company_count: highIcpCount.count || 0, preview_companies: highIcpPreview.data || [] },
    { ...SEGMENT_DEFS[4], company_count: multiCount.count || 0, preview_companies: multiPreview.data || [] },
    { ...SEGMENT_DEFS[5], company_count: readyCount.count || 0, preview_companies: readyPreview.data || [] },
  ];

  return NextResponse.json({ segments });
}
