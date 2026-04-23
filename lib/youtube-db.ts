export type YouTubeVideoRow = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  published_at: string;
  duration: string;
  is_short: boolean;
  fetched_at: string;
  views: number;
  likes: number;
  comments: number;
  video_url: string;
  created_at?: string;
};

export type YouTubeCollection = {
  trendingVideos: YouTubeVideoRow[];
  trendingShorts: YouTubeVideoRow[];
  latestUploads: YouTubeVideoRow[];
  // Compatibility aliases for existing UI consumers.
  trending: YouTubeVideoRow[];
  latest: YouTubeVideoRow[];
  fetchedAt: string;
};
