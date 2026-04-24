import { NextResponse } from "next/server";
import { getYouTubeSnapshot, refreshYouTubeSnapshot } from "@/services/youtube";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const forceRefresh = new URL(request.url).searchParams.get("refresh") === "1";
    const data = forceRefresh ? await refreshYouTubeSnapshot() : await getYouTubeSnapshot();

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to load YouTube data.",
      },
      { status: 500 },
    );
  }
}
