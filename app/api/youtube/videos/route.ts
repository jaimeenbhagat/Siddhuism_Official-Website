import { NextResponse } from "next/server";
import { getYouTubeCollectionFromSupabase } from "@/services/youtube-supabase";

export const runtime = "nodejs";
export const revalidate = 300;

export async function GET() {
  try {
    const payload = await getYouTubeCollectionFromSupabase();

    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        trendingVideos: [],
        trendingShorts: [],
        latestUploads: [],
        trending: [],
        latest: [],
        fetchedAt: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Failed to load videos from Supabase.",
      },
      { status: 500 },
    );
  }
}
