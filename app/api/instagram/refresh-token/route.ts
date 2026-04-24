import { NextResponse } from "next/server";
import { refreshInstagramToken } from "@/lib/refresh-instagram-token";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const cronHeader = request.headers.get("x-vercel-cron");
  const secret = new URL(request.url).searchParams.get("secret");
  const expectedSecret = process.env.CRON_SECRET;

  if (!expectedSecret) {
    return NextResponse.json({ error: "CRON_SECRET is not configured." }, { status: 500 });
  }

  if (secret !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (cronHeader !== "1") {
    console.warn("Instagram token refresh invoked without x-vercel-cron header.");
  }

  try {
    const supabase = getSupabaseAdminClient();

    const { data, error } = await supabase
      .from("instagram_tokens")
      .select("access_token")
      .eq("id", 1)
      .single();

    if (error || !data?.access_token) {
      throw new Error("No existing Instagram token found in instagram_tokens table.");
    }

    const newToken = await refreshInstagramToken(data.access_token);

    const { error: upsertError } = await supabase.from("instagram_tokens").upsert({
      id: 1,
      access_token: newToken,
      updated_at: new Date().toISOString(),
    });

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
