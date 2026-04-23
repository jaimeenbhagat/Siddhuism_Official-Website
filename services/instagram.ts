import { fetchJsonWithRetry } from "@/services/api-utils";
import { readCachedSnapshot, writeCachedSnapshot } from "@/services/social-cache";
import type { InstagramMedia, InstagramSnapshot } from "@/lib/social-types";
import { getSupabaseClient } from "@/lib/supabaseClient";

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
  let accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("app_config")
        .select("value")
        .eq("key", "instagram_token")
        .single();
        
      if (!error && data?.value) {
        accessToken = data.value;
      }
    } catch (err) {
      console.warn("Failed to fetch instagram_token from Supabase, falling back to env:", err);
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

async function fetchInsights(mediaId: string, accessToken: string): Promise<number | null> {
  try {
    const url = `https://graph.facebook.com/v18.0/${mediaId}/insights?metric=views&access_token=${accessToken}`;
    const res = await fetchJsonWithRetry<{ data?: Array<{ name: string; values: Array<{ value: number }> }> }>(url);
    const viewsData = res.data?.find(d => d.name === "views");
    return viewsData?.values?.[0]?.value ?? null;
  } catch (error) {
    console.warn(`Failed to fetch views for media ${mediaId}`, error);
    return null;
  }
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
        const views = await fetchInsights(media.id, accessToken);
        if (views !== null) {
          media.viewCount = views;
        }
      }
      return media;
    })
  );

  const snapshot: InstagramSnapshot = {
    username: profileResponse.username || "siddhuism_official",
    mediaCount: profileResponse.media_count || mediaResponse.data.length,
    followersCount: profileResponse.followers_count || 0,
    profilePictureUrl: profileResponse.profile_picture_url || "",
    media: mediaWithInsights,
    fetchedAt: new Date().toISOString(),
    source: "live",
  };

  await writeCachedSnapshot("instagram", snapshot);
  return snapshot;
}

export async function getInstagramSnapshot() {
  const cached = await readCachedSnapshot<InstagramSnapshot>("instagram");
  if (cached) {
    return { ...cached.data, fetchedAt: cached.fetchedAt, source: "cache" as const };
  }

  return refreshInstagramSnapshot();
}
