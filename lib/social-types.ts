export type YouTubeVideo = {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  publishedAt: string;
  views: number;
  likes: number;
  comments: number;
};

export type YouTubeSnapshot = {
  channelTitle: string;
  subscriberCount: number;
  viewCount: number;
  videoCount: number;
  trending: YouTubeVideo[];
  latest: YouTubeVideo[];
  fetchedAt: string;
  source: "cache" | "live";
};

export type InstagramMedia = {
  id: string;
  caption: string;
  mediaType: string;
  mediaUrl: string;
  thumbnailUrl: string;
  permalink: string;
  likeCount: number;
  commentsCount: number;
  viewCount?: number;
  timestamp: string;
};

export type InstagramSnapshot = {
  username: string;
  mediaCount: number;
  followersCount: number;
  profilePictureUrl: string;
  media: InstagramMedia[];
  fetchedAt: string;
  source: "cache" | "live";
};
