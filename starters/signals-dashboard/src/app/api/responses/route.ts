import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  const { data, error } = await supabase
    .from("email_responses")
    .select(
      `id, from_email, subject, classification, confidence,
       is_processed, received_at, campaign_id`
    )
    .eq("is_processed", false)
    .order("received_at", { ascending: false })
    .limit(100);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
