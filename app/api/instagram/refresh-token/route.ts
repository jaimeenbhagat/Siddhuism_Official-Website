import { NextResponse } from "next/server";
import { refreshInstagramToken } from "@/lib/refresh-instagram-token";
import { getSupabaseClient } from "@/lib/supabaseClient";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const cronHeader = request.headers.get("x-vercel-cron");
  const secret = new URL(request.url).searchParams.get("secret");
  const expectedSecret = process.env.CRON_SECRET;

  if (cronHeader !== "1" && (!expectedSecret || secret !== expectedSecret)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = getSupabaseClient();
    
    // 1. Get the current token from Supabase first
    let currentToken: string | null = null;
    const { data, error } = await supabase
      .from("app_config")
      .select("value")
      .eq("key", "instagram_token")
      .single();

    if (!error && data?.value) {
      currentToken = data.value;
    }

    // 2. Fallback to process.env if not found in DB
    if (!currentToken) {
      currentToken = process.env.INSTAGRAM_ACCESS_TOKEN || null;
    }

    if (!currentToken) {
      throw new Error("No existing Instagram token found in database or environment variables.");
    }

    // 3. Refresh the token
    const newToken = await refreshInstagramToken(currentToken);

    // 4. Store the new token in Supabase
    const { error: upsertError } = await supabase
      .from("app_config")
      .upsert(
        { key: "instagram_token", value: newToken, updated_at: new Date().toISOString() },
        { onConflict: "key" }
      );

    if (upsertError) {
      throw new Error(`Failed to save new token to Supabase: ${upsertError.message}`);
    }

    return NextResponse.json({ success: true, message: "Token refreshed and saved successfully." });
  } catch (error) {
    console.error("Token refresh cron failed:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
