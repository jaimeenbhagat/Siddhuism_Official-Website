import { NextResponse } from "next/server";
import { runYouTubeFullSync } from "@/services/youtube-supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isAuthorized(request: Request) {
  const secret = new URL(request.url).searchParams.get("secret");
  const expectedSecret = process.env.CRON_SECRET;

  if (expectedSecret && secret === expectedSecret) {
    return true;
  }

  return false;
}

export async function GET(request: Request) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const maxVideosParam = new URL(request.url).searchParams.get("maxVideos");
    const maxVideos = Math.min(500, Math.max(50, Number(maxVideosParam || 400)));

    const result = await runYouTubeFullSync(maxVideos);

    return NextResponse.json({
      ok: true,
      mode: "full-sync",
      maxVideos,
      fetched: result.fetched,
      upserted: result.upserted,
      fetchedAt: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Failed to run full YouTube sync.",
      },
      { status: 500 },
    );
  }
}
