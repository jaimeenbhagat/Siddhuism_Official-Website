import { NextResponse } from "next/server";
import { getInstagramSnapshot, refreshInstagramSnapshot } from "@/services/instagram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const forceRefresh = new URL(request.url).searchParams.get("refresh") === "1";
    const data = forceRefresh ? await refreshInstagramSnapshot() : await getInstagramSnapshot();

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to load Instagram data.",
      },
      { status: 500 },
    );
  }
}
