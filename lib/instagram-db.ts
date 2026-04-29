import { getSupabaseAdminClient } from "@/lib/supabase-admin";
import type { InstagramMedia } from "@/lib/social-types";

export type InstagramMediaRow = {
  id: string;
  caption: string | null;
  media_type: string;
  media_url: string;
  thumbnail_url: string | null;
  permalink: string;
  like_count: number;
  comments_count: number;
  view_count: number;
  timestamp: string;
  fetched_at?: string;
  created_at?: string;
};

function getSupabase() {
  return getSupabaseAdminClient();
}

export function mapInstagramRowToMedia(row: InstagramMediaRow): InstagramMedia {
  return {
    id: row.id,
    caption: row.caption || "",
    mediaType: row.media_type,
    mediaUrl: row.media_url,
    thumbnailUrl: row.thumbnail_url || row.media_url,
    permalink: row.permalink,
    likeCount: row.like_count,
    commentsCount: row.comments_count,
    viewCount: row.view_count || undefined,
    timestamp: row.timestamp,
  };
}

export async function upsertInstagramMediaRows(rows: InstagramMediaRow[]) {
  if (!rows.length) {
    return 0;
  }

  const supabase = getSupabase();
  const { error } = await supabase.from("instagram_media").upsert(rows, { onConflict: "id" });

  if (error) {
    throw new Error(`Supabase instagram_media upsert failed: ${error.message}`);
  }

  return rows.length;
}

export async function getInstagramMediaRows(limit = 15) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("instagram_media")
    .select("id,caption,media_type,media_url,thumbnail_url,permalink,like_count,comments_count,view_count,timestamp,fetched_at,created_at")
    .order("timestamp", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Supabase instagram_media select failed: ${error.message}`);
  }

  return (data || []) as InstagramMediaRow[];
}
