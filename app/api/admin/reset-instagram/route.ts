import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabaseClient";

export const runtime = "nodejs";

export async function GET() {
  const supabase = getSupabaseClient();
  await supabase.from("app_config").delete().eq("key", "instagram_token");
  return NextResponse.json({ success: true, message: "Deleted old token from app_config" });
}
