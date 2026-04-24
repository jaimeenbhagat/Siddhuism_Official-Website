import { NextResponse } from "next/server";
import { refreshInstagramSnapshot } from "@/services/instagram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isAuthorized(request: Request) {
  const cronHeader = request.headers.get("x-vercel-cron") === "1";
  const secret = new URL(request.url).searchParams.get("secret");
  const expectedSecret = process.env.CRON_SECRET;

  if (cronHeader) {
    return true;
  }

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

    const snapshot = await refreshInstagramSnapshot();

    return NextResponse.json({
      ok: true,
      mode: "cron-instagram-refresh",
      username: snapshot.username,
      mediaCount: snapshot.mediaCount,
      fetchedAt: snapshot.fetchedAt,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Failed to run Instagram cron sync.",
      },
      { status: 500 },
    );
  }
}
