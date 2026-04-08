import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const perPage = parseInt(searchParams.get("per_page") || "50");
  const stage = searchParams.get("stage");
  const source = searchParams.get("source");
  const search = searchParams.get("q");
  const sort = searchParams.get("sort") || "icp_score";
  const order = searchParams.get("order") || "desc";

  let query = supabase
    .from("companies")
    .select(
      `id, name, domain, industry, employee_count, icp_score, icp_segment,
       stage, outreach_status, source, tags, created_at,
       company_contacts(id, first_name, last_name, email, title, unified_score, contact_rank, source)`,
      { count: "exact" }
    );

  if (stage) query = query.eq("stage", stage);
  if (source) query = query.eq("source", source);
  if (search) query = query.or(`name.ilike.%${search}%,domain.ilike.%${search}%`);

  query = query
    .order(sort, { ascending: order === "asc", nullsFirst: false })
    .range((page - 1) * perPage, page * perPage - 1);

  const { data, count, error } = await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Batch-fetch real signals for this page of companies
  const companyIds = (data || []).map((c: { id: number }) => c.id);
  const { data: signals } = companyIds.length > 0
    ? await supabase
        .from("company_signals")
        .select("id, company_id, signal_source, signal_type, signal_snippet, outreach_hook, author_name, score")
        .in("company_id", companyIds)
        .order("score", { ascending: false })
    : { data: [] };

  const signalsByCompany: Record<number, typeof signals> = {};
  for (const s of signals || []) {
    (signalsByCompany[s.company_id] ||= []).push(s);
  }

  // Enrich with real signal counts + details
  const enriched = (data || []).map((company: { id: number; company_contacts: Array<{ source: string; contact_rank: number | null }>; icp_score: number | null; industry: string | null }) => {
    const contacts = company.company_contacts || [];
    const contactSources = [...new Set(contacts.map((c) => c.source).filter(Boolean))];
    return {
      ...company,
      contact_count: contacts.length,
      ranked_count: contacts.filter((c) => c.contact_rank !== null).length,
      contact_sources: contactSources,
      signal_count: signalsByCompany[company.id]?.length || 0,
      company_signals: signalsByCompany[company.id] || [],
    };
  });

  return NextResponse.json({
    data: enriched,
    total: count || 0,
    page,
    per_page: perPage,
    total_pages: Math.ceil((count || 0) / perPage),
  });
}
