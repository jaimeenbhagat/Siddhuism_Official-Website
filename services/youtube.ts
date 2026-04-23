import { fetchJsonWithRetry } from "@/services/api-utils";
import { readCachedSnapshot, writeCachedSnapshot } from "@/services/social-cache";
import type { YouTubeSnapshot, YouTubeVideo } from "@/lib/social-types";

type YouTubeChannelResponse = {
  items: Array<{
    id: string;
    snippet: { title: string };
    statistics: { subscriberCount: string; viewCount: string; videoCount: string };
    contentDetails: { relatedPlaylists: { uploads: string } };
  }>;
};

type YouTubePlaylistItemsResponse = {
  items: Array<{
    snippet: {
      resourceId: { videoId: string };
      title: string;
      description: string;
      publishedAt: string;
      thumbnails: { medium?: { url: string }; high?: { url: string } };
    };
  }>;
};

type YouTubeVideosResponse = {
  items: Array<{
    id: string;
    snippet: { title: string; description: string; publishedAt: string; thumbnails: { medium?: { url: string }; high?: { url: string } } };
    statistics?: { viewCount?: string; likeCount?: string; commentCount?: string };
    contentDetails?: { duration?: string };
  }>;
};

function requireConfig() {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID;

  if (!apiKey || !channelId) {
    throw new Error("YouTube credentials are not configured.");
  }

  return { apiKey, channelId };
}

function toNumber(value?: string) {
  return Number(value || 0);
}

function videoUrl(videoId: string) {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

function thumbnailUrl(item: { thumbnails: { medium?: { url: string }; high?: { url: string } } }) {
  return item.thumbnails.high?.url || item.thumbnails.medium?.url || "";
}

async function getUploadsPlaylistId(apiKey: string, channelId: string) {
  const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,contentDetails&id=${channelId}&key=${apiKey}`;
  const response = await fetchJsonWithRetry<YouTubeChannelResponse>(url);
  const channel = response.items[0];

  if (!channel) {
    throw new Error("Channel not found.");
  }

  return channel;
}

async function fetchVideoStats(apiKey: string, videoIds: string[]) {
  if (!videoIds.length) {
    return [] as YouTubeVideosResponse["items"];
  }

  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoIds.join(",")}&key=${apiKey}`;
  const response = await fetchJsonWithRetry<YouTubeVideosResponse>(url);
  return response.items;
}

function mapVideo(item: YouTubeVideosResponse["items"][number]): YouTubeVideo {
  return {
    id: item.id,
    title: item.snippet.title,
    description: item.snippet.description,
    thumbnailUrl: thumbnailUrl(item.snippet),
    videoUrl: videoUrl(item.id),
    publishedAt: item.snippet.publishedAt,
    views: toNumber(item.statistics?.viewCount),
    likes: toNumber(item.statistics?.likeCount),
    comments: toNumber(item.statistics?.commentCount),
  };
}

export async function refreshYouTubeSnapshot(): Promise<YouTubeSnapshot> {
  const { apiKey, channelId } = requireConfig();
  const channel = await getUploadsPlaylistId(apiKey, channelId);
  const uploadsPlaylistId = channel.contentDetails.relatedPlaylists.uploads;

  const latestUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=12&key=${apiKey}`;
  const latestResponse = await fetchJsonWithRetry<YouTubePlaylistItemsResponse>(latestUrl);
  const latestVideoIds = latestResponse.items.map((item) => item.snippet.resourceId.videoId);
  const latestVideoStats = await fetchVideoStats(apiKey, latestVideoIds);
  const latestMap = new Map(latestVideoStats.map((item) => [item.id, mapVideo(item)]));

  const latest = latestVideoIds
    .map((id) => latestMap.get(id))
    .filter((video): video is YouTubeVideo => Boolean(video));

  const trending = [...latest]
    .sort((first, second) => second.views - first.views || second.likes - first.likes)
    .slice(0, 6);

  const snapshot: YouTubeSnapshot = {
    channelTitle: channel.snippet.title,
    subscriberCount: toNumber(channel.statistics.subscriberCount),
    viewCount: toNumber(channel.statistics.viewCount),
    videoCount: toNumber(channel.statistics.videoCount),
    trending,
    latest,
    fetchedAt: new Date().toISOString(),
    source: "live",
  };

  await writeCachedSnapshot("youtube", snapshot);
  return snapshot;
}

export async function getYouTubeSnapshot() {
  const cached = await readCachedSnapshot<YouTubeSnapshot>("youtube");
  if (cached) {
    return { ...cached.data, fetchedAt: cached.fetchedAt, source: "cache" as const };
  }

  return refreshYouTubeSnapshot();
}
