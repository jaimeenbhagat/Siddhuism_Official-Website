import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabaseClient";
import type { PortfolioProjectSummary, PortfolioVideo } from "@/lib/portfolio-db";

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
    title: "Hosteller Poolside Reel",
    project_slug: "the-hosteller",
    project_title: "The Hosteller",
    video_url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    thumbnail: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=1200&q=80",
    category: "travel",
    is_featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "travel-fallback-2",
    title: "Hosteller Room Tour",
    project_slug: "the-hosteller",
    project_title: "The Hosteller",
    video_url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    thumbnail: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80",
    category: "travel",
    is_featured: false,
    created_at: new Date().toISOString(),
  },
  {
    id: "product-fallback-1",
    title: "Orange Cookware Launch",
    project_slug: "orange-cookware",
    project_title: "Orange Cookware",
    video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnail: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80",
    category: "products",
    is_featured: false,
    created_at: new Date().toISOString(),
  },
  {
    id: "event-fallback-1",
    title: "Synergy Banquet Highlight",
    project_slug: "synergy-banquet",
    project_title: "Synergy Banquet",
    video_url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    thumbnail: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
    category: "events",
    is_featured: false,
    created_at: new Date().toISOString(),
  },
];

function summarizeProjects(rows: PortfolioVideo[]): PortfolioProjectSummary[] {
  const map = new Map<string, PortfolioProjectSummary>();

  for (const row of rows) {
    const key = row.project_slug;
    const existing = map.get(key);

    if (!existing) {
      map.set(key, {
        project_slug: row.project_slug,
        project_title: row.project_title,
        category: row.category,
        thumbnail: row.thumbnail,
        video_count: 1,
        is_featured: row.is_featured,
        created_at: row.created_at,
      });
      continue;
    }

    const wasFeatured = existing.is_featured;
    existing.video_count += 1;
    existing.is_featured = existing.is_featured || row.is_featured;

    if (row.is_featured && !wasFeatured) {
      existing.thumbnail = row.thumbnail;
      existing.created_at = row.created_at;
    }
  }

  return [...map.values()].sort((a, b) => {
    if (a.is_featured !== b.is_featured) {
      return Number(b.is_featured) - Number(a.is_featured);
    }

    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
}

export async function GET() {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("portfolio_videos")
      .select("id,title,project_slug,project_title,video_url,thumbnail,category,is_featured,created_at")
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(240);

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
    const source = rows.length ? rows : fallbackVideos;

    return NextResponse.json(summarizeProjects(source), {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch {
    return NextResponse.json(summarizeProjects(fallbackVideos), { status: 500 });
  }
}
