import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from("instagram_media")
      .select("media_url, media_type")
      .eq("id", id)
      .single();

    if (error || !data?.media_url) {
      return NextResponse.json({ error: "Instagram media not found." }, { status: 404 });
    }

    const upstream = await fetch(data.media_url, {
      headers: {
        range: _.headers.get("range") || "",
      },
    });

    if (!upstream.ok && upstream.status !== 206) {
      return NextResponse.json({ error: "Failed to fetch Instagram media." }, { status: 502 });
    }

    const headers = new Headers();
    const contentType = upstream.headers.get("content-type") || "video/mp4";
    const contentLength = upstream.headers.get("content-length");
    const contentRange = upstream.headers.get("content-range");
    const acceptRanges = upstream.headers.get("accept-ranges") || "bytes";

    headers.set("Content-Type", contentType);
    headers.set("Accept-Ranges", acceptRanges);
    headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");

    if (contentLength) {
      headers.set("Content-Length", contentLength);
    }

    if (contentRange) {
      headers.set("Content-Range", contentRange);
    }

    return new NextResponse(upstream.body, {
      status: upstream.status,
      headers,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to proxy Instagram media.",
      },
      { status: 500 },
    );
  }
}