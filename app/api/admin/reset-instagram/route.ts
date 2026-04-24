import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";

export const runtime = "nodejs";

export async function GET() {
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.from("instagram_tokens").update({ access_token: "" }).eq("id", 1);

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, message: "Cleared token in instagram_tokens." });
}
