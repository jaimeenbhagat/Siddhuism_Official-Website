import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabaseClient";
import type { PortfolioVideo } from "@/lib/portfolio-db";

export const runtime = "nodejs";
export const revalidate = 300;
const DEFAULT_THUMBNAIL = "/profile-orb.svg";

function getYouTubeId(url: string) {
  const match = url.match(/v=([^&]+)/);
  if (match) {
    return match[1];
  }

  const short = url.match(/youtu\.be\/([^?&]+)/);
  return short ? short[1] : null;
}

function resolveThumbnail(videoUrl: string, thumbnail?: string | null) {
  if (thumbnail) {
    return thumbnail;
  }

  const youtubeId = getYouTubeId(videoUrl);
  if (youtubeId) {
    return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
  }

  return DEFAULT_THUMBNAIL;
}

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const fallbackVideos: PortfolioVideo[] = [
  {
    id: "travel-fallback-1",
    title: "Santorini Travel Campaign",
    project_slug: "the-hosteller",
    project_title: "The Hosteller",
    video_url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    thumbnail: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=1200&q=80",
    category: "travel",
    is_featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "product-fallback-1",
    title: "Skincare Product Reel",
    project_slug: "orange-cookware",
    project_title: "Orange Cookware",
    video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnail: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80",
    category: "products",
    is_featured: false,
    created_at: new Date().toISOString(),
  },
  {
    id: "event-fallback-1",
    title: "Luxury Event Aftermovie",
    project_slug: "synergy-banquet",
    project_title: "Synergy Banquet",
    video_url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    thumbnail: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
    category: "events",
    is_featured: false,
    created_at: new Date().toISOString(),
  },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = String(searchParams.get("slug") || "").trim();

    const supabase = getSupabaseClient();
    let query = supabase
      .from("portfolio_videos")
      .select("id,title,project_slug,project_title,video_url,thumbnail,category,is_featured,created_at")
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: false });

    if (slug) {
      query = query.eq("project_slug", slug).limit(60);
    } else {
      query = query.limit(60);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    const rows = ((data || []) as Array<PortfolioVideo & { project_slug?: string | null; project_title?: string | null }>).map(
      (row) => ({
        ...row,
        project_title: row.project_title || row.title,
        project_slug: row.project_slug || toSlug(row.project_title || row.title),
        thumbnail: resolveThumbnail(row.video_url, row.thumbnail),
      }),
    );
    const payload = rows.length
      ? rows
      : slug
        ? fallbackVideos.filter((item) => item.project_slug === slug)
        : fallbackVideos;

    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch {
    return NextResponse.json(
      fallbackVideos,
      { status: 500 },
    );
  }
}
