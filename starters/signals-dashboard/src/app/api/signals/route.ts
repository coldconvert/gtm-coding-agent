import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  // Fetch all signals
  const { data: allSignals, count } = await supabase
    .from("company_signals")
    .select("company_id, signal_type, signal_source, score", { count: "exact" });

  const signals = allSignals || [];
  const totalSignals = count || 0;

  // Aggregate in JS
  const typeDistribution: Record<string, number> = {};
  const sourceDistribution: Record<string, number> = {};
  const companySignalCounts: Record<number, { count: number; types: Set<string> }> = {};

  for (const s of signals) {
    typeDistribution[s.signal_type] = (typeDistribution[s.signal_type] || 0) + 1;
    sourceDistribution[s.signal_source] = (sourceDistribution[s.signal_source] || 0) + 1;

    if (!companySignalCounts[s.company_id]) {
      companySignalCounts[s.company_id] = { count: 0, types: new Set() };
    }
    companySignalCounts[s.company_id].count++;
    companySignalCounts[s.company_id].types.add(s.signal_type);
  }

  const companiesWithSignals = Object.keys(companySignalCounts).length;
  const avgSignals = companiesWithSignals > 0 ? totalSignals / companiesWithSignals : 0;

  // Top signal type
  const topType = Object.entries(typeDistribution).sort((a, b) => b[1] - a[1])[0];

  // Top 30 signal-rich companies
  const topCompanyEntries = Object.entries(companySignalCounts)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 30);

  const topCompanyIds = topCompanyEntries.map(([id]) => Number(id));

  const { data: companyDetails } = topCompanyIds.length > 0
    ? await supabase
        .from("companies")
        .select("id, name, domain, icp_score")
        .in("id", topCompanyIds)
    : { data: [] };

  const companyMap: Record<number, { name: string; domain: string; icp_score: number | null }> = {};
  for (const c of companyDetails || []) {
    companyMap[c.id] = c;
  }

  const signalRichCompanies = topCompanyEntries.map(([id, info]) => {
    const company = companyMap[Number(id)];
    return {
      id: Number(id),
      name: company?.name || "Unknown",
      domain: company?.domain || "",
      icp_score: company?.icp_score,
      signal_count: info.count,
      top_types: [...info.types].slice(0, 4),
    };
  });

  return NextResponse.json({
    totals: {
      total_signals: totalSignals,
      companies_with_signals: companiesWithSignals,
      avg_signals_per_company: Math.round(avgSignals * 10) / 10,
      top_signal_type: topType?.[0] || "-",
    },
    type_distribution: typeDistribution,
    source_distribution: sourceDistribution,
    signal_rich_companies: signalRichCompanies,
  });
}
