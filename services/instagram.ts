import { fetchJsonWithRetry } from "@/services/api-utils";
import { readCachedSnapshot, writeCachedSnapshot } from "@/services/social-cache";
import type { InstagramMedia, InstagramSnapshot } from "@/lib/social-types";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";
import { getInstagramMediaRows, mapInstagramRowToMedia, upsertInstagramMediaRows, type InstagramMediaRow } from "@/lib/instagram-db";

type InstagramResponse = {
  media_count?: number;
  username?: string;
  data: Array<{
    id: string;
    caption?: string;
    media_type: string;
    media_url?: string;
    thumbnail_url?: string;
    permalink: string;
    like_count?: number;
    comments_count?: number;
    timestamp: string;
  }>;
};

async function requireConfig() {
  const userId = process.env.INSTAGRAM_USER_ID;
  let accessToken: string | null = null;

  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from("instagram_tokens")
      .select("access_token")
      .eq("id", 1)
      .single();

    if (!error && data?.access_token) {
      accessToken = data.access_token;
    }
  }

  if (!accessToken || !userId) {
    throw new Error("Instagram credentials are not configured.");
  }

  return { accessToken, userId };
}

function mapMedia(item: InstagramResponse["data"][number]): InstagramMedia {
  return {
    id: item.id,
    caption: item.caption || "",
    mediaType: item.media_type,
    mediaUrl: item.media_url || item.thumbnail_url || "",
    thumbnailUrl: item.thumbnail_url || item.media_url || "",
    permalink: item.permalink,
    likeCount: item.like_count || 0,
    commentsCount: item.comments_count || 0,
    timestamp: item.timestamp,
  };
}

function buildSnapshotFromMedia(media: InstagramMedia[], base?: Partial<InstagramSnapshot>): InstagramSnapshot {
  return {
    username: base?.username || "siddhuism_official",
    mediaCount: base?.mediaCount || media.length,
    followersCount: base?.followersCount || 0,
    profilePictureUrl: base?.profilePictureUrl || "",
    media,
    fetchedAt: base?.fetchedAt || new Date().toISOString(),
    source: base?.source || "cache",
  };
}

async function fetchInsightMetric(mediaId: string, accessToken: string, metric: string): Promise<number | null> {
  try {
    const url = `https://graph.facebook.com/v18.0/${mediaId}/insights?metric=${metric}&access_token=${accessToken}`;
    const res = await fetchJsonWithRetry<{ data?: Array<{ name: string; values: Array<{ value: number }> }> }>(url);
    const metricData = res.data?.find((entry) => entry.name === metric);
    return metricData?.values?.[0]?.value ?? null;
  } catch (error) {
    return null;
  }
}

async function fetchMediaViews(mediaId: string, accessToken: string): Promise<number | null> {
  for (const metric of ["plays", "video_views", "views"]) {
    const value = await fetchInsightMetric(mediaId, accessToken, metric);
    if (value !== null) {
      return value;
    }
  }

  return null;
}

export async function refreshInstagramSnapshot(): Promise<InstagramSnapshot> {
  const { accessToken, userId } = await requireConfig();
  const fields = "id,caption,media_type,media_url,thumbnail_url,permalink,like_count,comments_count,timestamp";
  const profileUrl = `https://graph.facebook.com/v18.0/${userId}?fields=username,media_count,followers_count,profile_picture_url&access_token=${accessToken}`;
  const mediaUrl = `https://graph.facebook.com/v18.0/${userId}/media?fields=${fields}&access_token=${accessToken}&limit=15`;

  const [profileResponse, mediaResponse] = await Promise.all([
    fetchJsonWithRetry<{ username?: string; media_count?: number; followers_count?: number; profile_picture_url?: string }>(profileUrl),
    fetchJsonWithRetry<InstagramResponse>(mediaUrl),
  ]);

  const mediaWithInsights = await Promise.all(
    mediaResponse.data.map(async (item) => {
      const media = mapMedia(item);
      if (media.mediaType === "VIDEO") {
        const views = await fetchMediaViews(media.id, accessToken);
        if (views !== null) {
          media.viewCount = views;
        }
      }
      return media;
    })
  );

  const mediaRows: InstagramMediaRow[] = mediaWithInsights.map((media) => ({
    id: media.id,
    caption: media.caption || null,
    media_type: media.mediaType,
    media_url: media.mediaUrl,
    thumbnail_url: media.thumbnailUrl || null,
    permalink: media.permalink,
    like_count: media.likeCount,
    comments_count: media.commentsCount,
    view_count: media.viewCount || 0,
    timestamp: media.timestamp,
    fetched_at: new Date().toISOString(),
  }));

  await upsertInstagramMediaRows(mediaRows);

  const snapshot: InstagramSnapshot = {
    username: profileResponse.username || "siddhuism_official",
    mediaCount: profileResponse.media_count || mediaResponse.data.length,
    followersCount: profileResponse.followers_count || 0,
    profilePictureUrl: profileResponse.profile_picture_url || "",
    media: mediaWithInsights,
    fetchedAt: new Date().toISOString(),
    source: "live",
  };

  await writeCachedSnapshot("instagram", snapshot, 10);
  return snapshot;
}

export async function getInstagramSnapshot() {
  try {
    const cached = await readCachedSnapshot<InstagramSnapshot>("instagram");
    const rows = await getInstagramMediaRows(15);

    if (rows.length) {
      const media = rows.map(mapInstagramRowToMedia);
      return buildSnapshotFromMedia(media, cached?.data ? {
        username: cached.data.username,
        mediaCount: cached.data.mediaCount,
        followersCount: cached.data.followersCount,
        profilePictureUrl: cached.data.profilePictureUrl,
        fetchedAt: rows[0]?.fetched_at || cached.data.fetchedAt,
        source: cached.data.source,
      } : undefined);
    }

    if (cached) {
      return { ...cached.data, fetchedAt: cached.fetchedAt, source: "cache" as const };
    }
  } catch {
    // Fall through to live refresh below.
  }

  try {
    return await refreshInstagramSnapshot();
  } catch (error) {
    const staleCached = await readCachedSnapshot<InstagramSnapshot>("instagram", true);
    if (staleCached) {
      return { ...staleCached.data, fetchedAt: staleCached.fetchedAt, source: "cache" as const };
    }

    throw error;
  }
}
