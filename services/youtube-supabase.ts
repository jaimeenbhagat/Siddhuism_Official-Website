import { fetchJsonWithRetry } from "@/services/api-utils";
import { getSupabaseClient } from "@/lib/supabaseClient";
import type { YouTubeCollection, YouTubeVideoRow } from "@/lib/youtube-db";

type SearchResponse = {
  nextPageToken?: string;
  items: Array<{
    id: {
      kind: string;
      videoId?: string;
    };
    snippet: {
      title: string;
      description: string;
      publishedAt: string;
      thumbnails: {
        medium?: { url: string };
        high?: { url: string };
      };
    };
  }>;
};

type VideosResponse = {
  items: Array<{
    id: string;
    statistics?: {
      viewCount?: string;
      likeCount?: string;
      commentCount?: string;
    };
    contentDetails?: {
      duration?: string;
    };
  }>;
};

type SearchVideoSnippet = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  published_at: string;
};

function requireConfig() {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID;

  if (!apiKey || !channelId) {
    throw new Error("YOUTUBE_API_KEY and YOUTUBE_CHANNEL_ID must be configured.");
  }

  return { apiKey, channelId };
}

function asInt(input?: string) {
  return Number(input || 0);
}

function getThumbnail(snippet: SearchResponse["items"][number]["snippet"]) {
  return snippet.thumbnails.high?.url || snippet.thumbnails.medium?.url || "";
}

function chunk<T>(items: T[], size: number) {
  const batches: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    batches.push(items.slice(index, index + size));
  }
  return batches;
}

function parseISODurationSeconds(duration?: string) {
  if (!duration) {
    return 0;
  }

  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) {
    return 0;
  }

  const hours = Number(match[1] || 0);
  const minutes = Number(match[2] || 0);
  const seconds = Number(match[3] || 0);

  return hours * 3600 + minutes * 60 + seconds;
}

function isShortDuration(duration?: string) {
  return parseISODurationSeconds(duration) <= 60;
}

export function trendingScore(video: Pick<YouTubeVideoRow, "views" | "likes" | "comments">) {
  return video.views + video.likes * 5 + video.comments * 10;
}

async function fetchSearchPage(apiKey: string, channelId: string, maxResults: number, pageToken?: string) {
  const params = new URLSearchParams({
    key: apiKey,
    channelId,
    part: "snippet",
    order: "date",
    type: "video",
    maxResults: String(Math.min(maxResults, 50)),
  });

  if (pageToken) {
    params.set("pageToken", pageToken);
  }

  const url = `https://www.googleapis.com/youtube/v3/search?${params.toString()}`;
  return fetchJsonWithRetry<SearchResponse>(url, {}, { retries: 2 });
}

export async function fetchAllYouTubeVideoSnippets(maxVideos = 400) {
  const { apiKey, channelId } = requireConfig();

  const seen = new Set<string>();
  const snippets: SearchVideoSnippet[] = [];

  let nextPageToken: string | undefined;
  do {
    const page = await fetchSearchPage(apiKey, channelId, 50, nextPageToken);
    nextPageToken = page.nextPageToken;

    for (const item of page.items) {
      if (item.id.kind !== "youtube#video" || !item.id.videoId || seen.has(item.id.videoId)) {
        continue;
      }

      seen.add(item.id.videoId);
      snippets.push({
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: getThumbnail(item.snippet),
        published_at: item.snippet.publishedAt,
      });

      if (snippets.length >= maxVideos) {
        break;
      }
    }
  } while (nextPageToken && snippets.length < maxVideos);

  return snippets;
}

async function fetchVideoDetailsByIds(ids: string[]) {
  const { apiKey } = requireConfig();
  if (!ids.length) {
    return new Map<string, VideosResponse["items"][number]>();
  }

  const details = new Map<string, VideosResponse["items"][number]>();

  for (const batch of chunk(ids, 50)) {
    const params = new URLSearchParams({
      key: apiKey,
      part: "statistics,contentDetails",
      id: batch.join(","),
    });

    const url = `https://www.googleapis.com/youtube/v3/videos?${params.toString()}`;
    const response = await fetchJsonWithRetry<VideosResponse>(url, {}, { retries: 2 });

    for (const item of response.items) {
      details.set(item.id, item);
    }
  }

  return details;
}

export async function hydrateRowsFromSnippets(snippets: SearchVideoSnippet[]) {
  if (!snippets.length) {
    return [] as YouTubeVideoRow[];
  }

  const detailById = await fetchVideoDetailsByIds(snippets.map((snippet) => snippet.id));
  const fetchedAt = new Date().toISOString();

  return snippets.map((snippet) => {
    const detail = detailById.get(snippet.id);
    const duration = detail?.contentDetails?.duration || "PT0S";

    return {
      id: snippet.id,
      title: snippet.title,
      description: snippet.description,
      thumbnail: snippet.thumbnail,
      published_at: snippet.published_at,
      duration,
      is_short: isShortDuration(duration),
      fetched_at: fetchedAt,
      views: asInt(detail?.statistics?.viewCount),
      likes: asInt(detail?.statistics?.likeCount),
      comments: asInt(detail?.statistics?.commentCount),
      video_url: `https://www.youtube.com/watch?v=${snippet.id}`,
    } satisfies YouTubeVideoRow;
  });
}

export async function fetchYouTubeRowsFromApi(limit = 20) {
  const snippets = await fetchAllYouTubeVideoSnippets(limit);
  return hydrateRowsFromSnippets(snippets);
}

export async function runYouTubeFullSync(maxVideos = 400) {
  const snippets = await fetchAllYouTubeVideoSnippets(maxVideos);
  const rows = await hydrateRowsFromSnippets(snippets);
  const upserted = await upsertYouTubeRows(rows);

  return {
    fetched: snippets.length,
    upserted,
  };
}

export async function refreshStatsForRecentRows(limit = 120) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("youtube_videos")
    .select("id,title,description,thumbnail,published_at,video_url")
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Supabase select failed: ${error.message}`);
  }

  const baseRows = (data || []) as Array<{
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    published_at: string;
    video_url: string;
  }>;

  if (!baseRows.length) {
    return 0;
  }

  const detailById = await fetchVideoDetailsByIds(baseRows.map((row) => row.id));
  const fetchedAt = new Date().toISOString();

  const refreshedRows: YouTubeVideoRow[] = baseRows.map((row) => {
    const detail = detailById.get(row.id);
    const duration = detail?.contentDetails?.duration || "PT0S";

    return {
      ...row,
      duration,
      is_short: isShortDuration(duration),
      fetched_at: fetchedAt,
      views: asInt(detail?.statistics?.viewCount),
      likes: asInt(detail?.statistics?.likeCount),
      comments: asInt(detail?.statistics?.commentCount),
    };
  });

  return upsertYouTubeRows(refreshedRows);
}

export async function runYouTubeIncrementalSync(limit = 20, refreshExistingLimit = 120) {
  const latestRows = await fetchYouTubeRowsFromApi(limit);
  const latestUpserted = await upsertYouTubeRows(latestRows);
  const refreshedExisting = await refreshStatsForRecentRows(refreshExistingLimit);

  return {
    fetched: latestRows.length,
    upsertedLatest: latestUpserted,
    refreshedExisting,
  };
}

export async function upsertYouTubeRows(rows: YouTubeVideoRow[]) {
  if (!rows.length) {
    return 0;
  }

  const supabase = getSupabaseClient();
  const { error } = await supabase.from("youtube_videos").upsert(rows, { onConflict: "id" });

  if (error) {
    throw new Error(`Supabase upsert failed: ${error.message}`);
  }

  return rows.length;
}

export async function getYouTubeCollectionFromSupabase(): Promise<YouTubeCollection> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("youtube_videos")
    .select("id,title,description,thumbnail,published_at,duration,is_short,fetched_at,views,likes,comments,video_url,created_at")
    .limit(600);

  if (error) {
    throw new Error(`Supabase select failed: ${error.message}`);
  }

  const rows = (data || []) as YouTubeVideoRow[];
  const byTrending = [...rows].sort((a, b) => trendingScore(b) - trendingScore(a) || b.views - a.views);

  const trendingVideos = byTrending.filter((row) => !row.is_short).slice(0, 10);
  const trendingShorts = byTrending.filter((row) => row.is_short).slice(0, 10);
  const latestUploads = [...rows]
    .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
    .slice(0, 12);

  return {
    trendingVideos,
    trendingShorts,
    latestUploads,
    trending: trendingVideos,
    latest: latestUploads,
    fetchedAt: new Date().toISOString(),
  };
}
