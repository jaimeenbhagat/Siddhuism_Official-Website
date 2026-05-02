import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";
import { fetchJsonWithRetry } from "@/services/api-utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function maskToken(token?: string | null) {
  if (!token) return null;
  if (token.length <= 12) return `${token.slice(0, 3)}...${token.slice(-3)}`;
  return `${token.slice(0, 6)}...${token.slice(-6)}`;
}

export async function GET() {
  try {
    let accessToken: string | null = process.env.INSTAGRAM_ACCESS_TOKEN || null;
    const userId = process.env.INSTAGRAM_USER_ID || null;

    // Prefer token from Supabase if present
    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const supabase = getSupabaseAdminClient();
        const { data, error } = await supabase.from("instagram_tokens").select("access_token").eq("id", 1).single();
        if (!error && data?.access_token) accessToken = data.access_token;
      } catch (err) {
        console.error("Failed to read instagram_tokens from Supabase:", err instanceof Error ? err.message : err);
      }
    }

    const appId = process.env.META_APP_ID;
    const appSecret = process.env.META_APP_SECRET;
    let debugResp: any = null;

    if (appId && appSecret && accessToken) {
      try {
        const appToken = `${appId}|${appSecret}`;
        const debugUrl = `https://graph.facebook.com/debug_token?input_token=${accessToken}&access_token=${appToken}`;
        debugResp = await fetchJsonWithRetry<any>(debugUrl);
      } catch (err) {
        debugResp = { error: err instanceof Error ? err.message : String(err) };
      }
    }

    return NextResponse.json(
      {
        instagramUserId: userId,
        accessTokenMasked: maskToken(accessToken),
        debug: debugResp,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("/api/instagram/debug error:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
