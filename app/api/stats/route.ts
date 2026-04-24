import { NextResponse } from "next/server";
import { getYouTubeSnapshot } from "@/services/youtube";
import { getInstagramSnapshot } from "@/services/instagram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [youtube, instagram] = await Promise.allSettled([
      getYouTubeSnapshot(),
      getInstagramSnapshot(),
    ]);

    const ytData = youtube.status === "fulfilled" ? youtube.value : null;
    const igData = instagram.status === "fulfilled" ? instagram.value : null;

    return NextResponse.json({
      youtube: {
        subscribers: ytData?.subscriberCount ?? null,
        views: ytData?.viewCount ?? null,
        videos: ytData?.videoCount ?? null,
      },
      instagram: {
        followers: igData?.followersCount ?? null,
        media: igData?.mediaCount ?? null,
      }
    }, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
