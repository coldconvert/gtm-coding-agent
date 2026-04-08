import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  // Run all queries in parallel
  const [
    companiesTotal,
    contactsTotal,
    rankedContacts,
    overflowContacts,
    companiesWithIcp,
    companiesWithResearch,
    companiesWithTechStack,
    contactsWithEmail,
    contactsValidEmail,
    contactsWithTitle,
    contactsWithLinkedin,
    stageBreakdown,
    sourceBreakdown,
    scoreDistribution,
    topCompanies,
    recentCompanies,
    signalsTotal,
    signalCompanyIds,
  ] = await Promise.all([
    // Totals
    supabase.from("companies").select("id", { count: "exact", head: true }),
    supabase.from("company_contacts").select("id", { count: "exact", head: true }),
    supabase.from("company_contacts").select("id", { count: "exact", head: true }).not("contact_rank", "is", null),
    supabase.from("contact_overflow").select("id", { count: "exact", head: true }),

    // Enrichment coverage
    supabase.from("companies").select("id", { count: "exact", head: true }).not("icp_score", "is", null),
    supabase.from("companies").select("id", { count: "exact", head: true }).not("exa_research", "is", null),
    supabase.from("companies").select("id", { count: "exact", head: true }).not("tech_stack", "is", null),
    supabase.from("company_contacts").select("id", { count: "exact", head: true }).not("email", "is", null),
    supabase.from("company_contacts").select("id", { count: "exact", head: true }).eq("email_status", "valid"),
    supabase.from("company_contacts").select("id", { count: "exact", head: true }).not("title", "is", null),
    supabase.from("company_contacts").select("id", { count: "exact", head: true }).not("linkedin_url", "is", null),

    // Stage breakdown
    supabase.from("companies").select("stage"),
    // Source breakdown
    supabase.from("company_contacts").select("source"),

    // Score distribution (contacts)
    supabase.from("company_contacts").select("unified_score").not("unified_score", "is", null),

    // Top companies by ICP score
    supabase.from("companies")
      .select("id, name, domain, icp_score, stage, industry, employee_count, source")
      .not("icp_score", "is", null)
      .order("icp_score", { ascending: false })
      .limit(20),

    // Recently added companies
    supabase.from("companies")
      .select("id, name, domain, icp_score, stage, source, created_at")
      .order("created_at", { ascending: false })
      .limit(10),

    // Signal stats
    supabase.from("company_signals").select("id", { count: "exact", head: true }),
    supabase.from("company_signals").select("company_id"),
  ]);

  // Compute stage counts
  const stages: Record<string, number> = {};
  for (const row of stageBreakdown.data || []) {
    stages[row.stage] = (stages[row.stage] || 0) + 1;
  }

  // Compute source counts
  const sources: Record<string, number> = {};
  for (const row of sourceBreakdown.data || []) {
    const src = row.source || "unknown";
    sources[src] = (sources[src] || 0) + 1;
  }

  // Score distribution buckets
  const scoreBuckets = { "0-20": 0, "21-40": 0, "41-60": 0, "61-80": 0, "81-100": 0 };
  for (const row of scoreDistribution.data || []) {
    const s = row.unified_score;
    if (s <= 20) scoreBuckets["0-20"]++;
    else if (s <= 40) scoreBuckets["21-40"]++;
    else if (s <= 60) scoreBuckets["41-60"]++;
    else if (s <= 80) scoreBuckets["61-80"]++;
    else scoreBuckets["81-100"]++;
  }

  const totalCompanies = companiesTotal.count || 0;
  const totalContacts = contactsTotal.count || 0;
  const companiesWithSignals = new Set((signalCompanyIds.data || []).map((r: { company_id: number }) => r.company_id)).size;

  return NextResponse.json({
    totals: {
      companies: totalCompanies,
      contacts: totalContacts,
      ranked_contacts: rankedContacts.count || 0,
      overflow_contacts: overflowContacts.count || 0,
    },
    enrichment: {
      companies_with_icp: companiesWithIcp.count || 0,
      companies_with_research: companiesWithResearch.count || 0,
      companies_with_tech_stack: companiesWithTechStack.count || 0,
      contacts_with_email: contactsWithEmail.count || 0,
      contacts_valid_email: contactsValidEmail.count || 0,
      contacts_with_title: contactsWithTitle.count || 0,
      contacts_with_linkedin: contactsWithLinkedin.count || 0,
      icp_coverage_pct: totalCompanies > 0 ? ((companiesWithIcp.count || 0) / totalCompanies * 100) : 0,
      research_coverage_pct: totalCompanies > 0 ? ((companiesWithResearch.count || 0) / totalCompanies * 100) : 0,
      email_coverage_pct: totalContacts > 0 ? ((contactsWithEmail.count || 0) / totalContacts * 100) : 0,
    },
    stages,
    sources,
    score_distribution: scoreBuckets,
    top_companies: topCompanies.data || [],
    recent_companies: recentCompanies.data || [],
    signals: {
      total_signals: signalsTotal.count || 0,
      companies_with_signals: companiesWithSignals,
      signal_coverage_pct: totalCompanies > 0 ? (companiesWithSignals / totalCompanies * 100) : 0,
    },
  });
}
