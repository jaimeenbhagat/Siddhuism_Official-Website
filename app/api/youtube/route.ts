import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabaseClient";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = getSupabaseClient();
    
    // Fetch Shorts
    const { data: shortsData, error: shortsError } = await supabase
      .from("youtube_videos")
      .select("*")
      .eq("is_short", true)
      .order("views", { ascending: false })
      .limit(10);

    // Fetch Long Videos
    const { data: longsData, error: longsError } = await supabase
      .from("youtube_videos")
      .select("*")
      .eq("is_short", false)
      .order("views", { ascending: false })
      .limit(6);

    if (shortsError || longsError) {
      console.error(shortsError, longsError);
      throw new Error("Supabase fetch failed.");
    }

    return NextResponse.json({
      shorts: shortsData || [],
      longs: longsData || []
    }, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to load YouTube data.",
        shorts: [],
        longs: []
      },
      { status: 500 },
    );
  }
}
