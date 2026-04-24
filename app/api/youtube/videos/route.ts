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

    const TARGET_LONG_IDS = [
      "PH8QpfDqCGU", // MG ZS EV After 13,000 KMs
      "TZnOr-NVFh8", // I Attended the WILDEST Holi Party
      "W5GwhYJQ4PI", // Vengurla Diaries
      "7PtiiGJBRhk", // Who's been here before?
      "ax3jif1Ebso", // Is One Tree Hill Trek
      "V1_8Y_FN2X8", // Last Ride Of 2024
    ];

    // Fetch Long Videos (specifically the requested ones)
    const { data: longsDataRaw, error: longsError } = await supabase
      .from("youtube_videos")
      .select("*")
      .in("id", TARGET_LONG_IDS);

    // Sort to match the requested order exactly
    const longsData = longsDataRaw 
      ? TARGET_LONG_IDS.map(id => longsDataRaw.find(v => v.id === id)).filter(Boolean)
      : [];

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
