"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FiInstagram, FiYoutube, FiEye, FiHeart, FiMessageCircle, FiPlayCircle } from "react-icons/fi";
import SectionHeading from "@/components/ui/section-heading";
import type { InstagramSnapshot, InstagramMedia, YouTubeVideo } from "@/lib/social-types";
import { preconnect } from "react-dom";

type ApiYouTubeRow = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  video_url: string;
  published_at: string;
  views: number;
  likes: number;
  comments: number;
};

type ApiYouTubeResponse = {
  shorts?: ApiYouTubeRow[];
  longs?: ApiYouTubeRow[];
};

type ApiInstagramResponse = InstagramSnapshot & {
  message?: string;
};

function compact(num: number) {
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(num);
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return isMobile;
}

function InstagramReelCard({
  media,
  isActive,
  isMobile,
  onActivate,
  onDeactivate,
  onToggle,
}: {
  media: InstagramMedia;
  isActive: boolean;
  isMobile: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
  onToggle: () => void;
}) {
  const cardRef = useRef<HTMLElement | null>(null);
  const [showThumbnailFallback, setShowThumbnailFallback] = useState(false);
  const isVideo = media.mediaType === 'VIDEO';
  const openTarget = media.permalink;
  const videoSrc = `/api/instagram/media/${media.id}`;

  useEffect(() => {
    if (!isActive) {
      return;
    }

    setShowThumbnailFallback(false);
    console.log("Instagram Video URL:", videoSrc);
    console.log("isActive:", isActive);
  }, [isActive, videoSrc]);

  useEffect(() => {
    const node = cardRef.current;

    if (!node || isMobile) {
      return;
    }

    const handleMouseEnter = () => onActivate();
    const handleMouseLeave = () => onDeactivate();

    node.addEventListener("mouseenter", handleMouseEnter);
    node.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      node.removeEventListener("mouseenter", handleMouseEnter);
      node.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isMobile, onActivate, onDeactivate]);

  const handleCardClick = () => {
    if (isMobile) {
      if (isActive) {
        window.location.href = openTarget;
        return;
      }

      onToggle();
      return;
    }

    window.location.href = openTarget;
  };

  return (
    <motion.article
      ref={cardRef}
      onClick={handleCardClick}
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative aspect-9/16 overflow-hidden rounded-xl border border-slate-700/60 bg-slate-900/80 shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(236,72,153,0.3)]"
      role={isMobile ? "button" : undefined}
      aria-label={isMobile ? `Play ${media.caption?.slice(0, 40) || "Instagram reel"}` : undefined}
    >
      <div className="relative h-full w-full overflow-hidden rounded-xl bg-slate-900">
        {isActive && isVideo && !showThumbnailFallback ? (
          <video
            key={media.mediaUrl}
            src={videoSrc}
            className="absolute inset-0 z-10 h-full w-full object-cover transition-opacity duration-300"
            muted
            playsInline
            autoPlay={isActive}
            loop
            preload="metadata"
            onError={() => setShowThumbnailFallback(true)}
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        ) : null}

        {!isActive || showThumbnailFallback ? (
          <Image
            src={media.thumbnailUrl || media.mediaUrl}
            alt={media.caption?.slice(0, 50) || "Instagram Reel"}
            fill
            className="absolute inset-0 z-10 object-cover transition-opacity duration-300 group-hover:scale-105"
          />
        ) : null}

        <div className={`absolute inset-0 z-20 bg-linear-to-t from-black/85 via-black/15 to-transparent transition-opacity duration-300 ${isActive ? "opacity-0 pointer-events-none" : "opacity-100"}`} />

        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/40 p-3 backdrop-blur-md transition-opacity duration-300 ${isActive ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
          <FiPlayCircle className="text-white/90" size={32} />
        </div>

        <div className={`absolute bottom-3 left-3 right-3 flex flex-col gap-2 transition-opacity duration-300 ${isActive ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
          <div className="flex flex-wrap gap-2 text-[10px] text-pink-100 font-medium">
            <span className="flex items-center gap-1 rounded-full bg-pink-500/20 px-2 py-1 backdrop-blur-md border border-pink-500/30">
              <FiEye /> {media.viewCount ? compact(media.viewCount) : compact((media.likeCount + media.commentsCount) * 15)}
            </span>
            <span className="flex items-center gap-1 rounded-full bg-slate-800/60 px-2 py-1 backdrop-blur-md border border-slate-600/30">
              <FiHeart /> {compact(media.likeCount)}
            </span>
            <span className="flex items-center gap-1 rounded-full bg-slate-800/60 px-2 py-1 backdrop-blur-md border border-slate-600/30">
              <FiMessageCircle /> {compact(media.commentsCount)}
            </span>
          </div>
        </div>

        {isActive && (
          <a
            href={media.permalink}
            target="_blank"
            rel="noreferrer"
            onClick={(event) => event.stopPropagation()}
            className="absolute right-3 bottom-3 z-20 rounded-full border border-slate-200/40 bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md transition hover:border-pink-300/70 hover:text-pink-100"
          >
            Open on Instagram
          </a>
        )}
      </div>
    </motion.article>
  );
}

function YouTubeCard({
  video,
  isShort,
  isActive,
  isMobile,
  onActivate,
  onDeactivate,
  onToggle,
}: {
  video: YouTubeVideo;
  isShort?: boolean;
  isActive: boolean;
  isMobile: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
  onToggle: () => void;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [origin, setOrigin] = useState("");
  const openTarget = video.videoUrl;

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const embedUrl = useMemo(() => {
    const params = new URLSearchParams({
      autoplay: "1",
      mute: "0",
      controls: "1",
      modestbranding: "1",
      rel: "0",
      playsinline: "1",
      enablejsapi: "1",
    });

    if (origin) {
      params.set("origin", origin);
    }

    return `https://www.youtube.com/embed/${video.id}?${params.toString()}`;
  }, [origin, video.id]);

  useEffect(() => {
    const frame = iframeRef.current;

    if (!frame) {
      return;
    }

    const command = isActive ? "playVideo" : "pauseVideo";
    const timer = window.setTimeout(() => {
      frame.contentWindow?.postMessage(JSON.stringify({ event: "command", func: command, args: "" }), "*");
    }, 0);

    return () => window.clearTimeout(timer);
  }, [isActive]);

  const handleCardClick = () => {
    if (isMobile) {
      if (isActive) {
        window.location.href = openTarget;
        return;
      }

      onToggle();
      return;
    }

    window.location.href = openTarget;
  };

  return (
    <motion.article
      onPointerEnter={isMobile ? undefined : onActivate}
      onPointerLeave={isMobile ? undefined : onDeactivate}
      onClick={handleCardClick}
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`group relative overflow-hidden rounded-xl border border-slate-700/60 bg-slate-900/80 shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] ${isShort ? 'aspect-9/16' : 'aspect-video'}`}
      role={isMobile ? "button" : undefined}
      aria-label={isMobile ? `Play ${video.title}` : undefined}
    >
      <div className="absolute inset-0 bg-slate-900">
        <Image
          src={video.thumbnailUrl}
          alt={video.title}
          fill
          className={`object-cover transition duration-700 ${isActive ? "opacity-0" : "opacity-100 group-hover:scale-105"}`}
        />
        <div className={`absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent transition-opacity duration-300 ${isActive ? "opacity-0 pointer-events-none" : "opacity-100"}`} />
        
        {isActive && (
          <iframe
            ref={iframeRef}
            className="absolute inset-0 h-full w-full pointer-events-none"
            src={embedUrl}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        )}

        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/40 p-3 backdrop-blur-md transition-opacity duration-300 ${isActive ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
          <FiPlayCircle className="text-white/90" size={32} />
        </div>

        <div className={`absolute bottom-0 left-0 w-full p-3 md:p-4 transition-opacity duration-300 ${isActive ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
          {!isShort && <h4 className="line-clamp-2 text-xs md:text-sm font-semibold text-slate-100 mb-2">{video.title}</h4>}
          <div className="flex gap-3 text-[10px] md:text-xs text-slate-300">
            <span className="flex items-center gap-1 rounded-full bg-red-500/20 px-2 py-1 backdrop-blur-md border border-red-500/30 text-red-100">
              <FiEye /> {compact(video.views)}
            </span>
          </div>
        </div>

        {isActive && (
          <a
            href={video.videoUrl}
            target="_blank"
            rel="noreferrer"
            onClick={(event) => event.stopPropagation()}
            className="absolute right-3 bottom-3 z-20 rounded-full border border-slate-200/40 bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md transition hover:border-red-300/70 hover:text-red-100"
          >
            Open on YouTube
          </a>
        )}
      </div>
    </motion.article>
  );
}

export default function YouTubeVideoGrid() {
  preconnect("https://www.youtube.com");
  const isMobile = useIsMobile();
  
  const [igStats, setIgStats] = useState<InstagramSnapshot | null>(null);
  const [igMessage, setIgMessage] = useState<string | null>(null);
  const [ytShortsRaw, setYtShortsRaw] = useState<ApiYouTubeRow[]>([]);
  const [ytLongsRaw, setYtLongsRaw] = useState<ApiYouTubeRow[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/instagram").then(res => res.json() as Promise<ApiInstagramResponse>).catch(() => null),
      fetch("/api/youtube/videos").then(res => res.json()).catch((): ApiYouTubeResponse => ({ shorts: [], longs: [] }))
    ]).then(([ig, yt]) => {
      setIgStats(ig);
      setIgMessage(ig?.message || null);
      const response = yt as ApiYouTubeResponse;
      setYtShortsRaw(response?.shorts || []);
      setYtLongsRaw(response?.longs || []);
      setLoading(false);
    });
  }, []);

  const { reels, ytShorts, ytLongs } = useMemo(() => {
    const r = (igStats?.media?.filter(m => m.mediaType === "VIDEO") || [])
      .sort((a, b) => (b.likeCount + b.commentsCount) - (a.likeCount + a.commentsCount))
      .slice(0, 10);
      
    const mapYt = (row: ApiYouTubeRow): YouTubeVideo => ({
      id: row.id,
      title: row.title,
      description: row.description,
      thumbnailUrl: row.thumbnail,
      videoUrl: row.video_url,
      publishedAt: row.published_at,
      views: row.views,
      likes: row.likes,
      comments: row.comments
    });

    const ys = ytShortsRaw.map(mapYt);
    const yl = ytLongsRaw.map(mapYt);

    return { reels: r, ytShorts: ys, ytLongs: yl };
  }, [igStats, ytShortsRaw, ytLongsRaw]);

  if (loading) return (
    <section id="youtube-hub" className="px-4 py-12 sm:px-6 md:px-8 md:py-16 lg:px-10">
      <div className="mx-auto w-full max-w-350 2xl:max-w-400">
        <SectionHeading eyebrow="Trending Content" title="Content That Performs" />
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-slate-500"></div>
        </div>
      </div>
    </section>
  );

  const hasNoData = reels.length === 0 && ytShorts.length === 0 && ytLongs.length === 0;

  return (
    <section id="youtube-hub" className="px-4 py-12 sm:px-6 md:px-8 md:py-16 lg:px-10">
      <div className="mx-auto w-full max-w-350 2xl:max-w-400">
        <SectionHeading
          eyebrow="Trending Content"
          title="Content That Performs"
        />

        <div className="space-y-6 md:space-y-8">
          {reels.length > 0 && (
            <div>
              <div className="mb-6 flex items-center gap-2 border-b border-slate-800 pb-2">
                <FiInstagram className="text-gray-400" size={24} />
                <h3 className="text-lg md:text-xl font-medium text-gray-400">Trending Reels</h3>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                {reels.map((media) => (
                  <InstagramReelCard 
                    key={media.id} 
                    media={media} 
                    isMobile={isMobile}
                    isActive={activeVideoId === media.id}
                    onActivate={() => setActiveVideoId(media.id)}
                    onDeactivate={() => setActiveVideoId(null)}
                    onToggle={() => setActiveVideoId((prev) => (prev === media.id ? null : media.id))}
                  />
                ))}
              </div>
            </div>
          )}

          {ytShorts.length > 0 && (
            <div>
              <div className="mb-6 flex items-center gap-2 border-b border-slate-800 pb-2">
                <FiYoutube className="text-gray-400" size={24} />
                <h3 className="text-lg md:text-xl font-medium text-gray-400">Trending Shorts</h3>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                {ytShorts.map((video) => (
                  <YouTubeCard 
                    key={video.id} 
                    video={video} 
                    isShort={true} 
                    isMobile={isMobile}
                    isActive={activeVideoId === video.id}
                    onActivate={() => setActiveVideoId(video.id)}
                    onDeactivate={() => setActiveVideoId(null)}
                    onToggle={() => setActiveVideoId((prev) => (prev === video.id ? null : video.id))}
                  />
                ))}
              </div>
            </div>
          )}

          {ytLongs.length > 0 && (
            <div>
              <div className="mb-6 flex items-center gap-2 border-b border-slate-800 pb-2">
                <FiYoutube className="text-gray-400" size={24} />
                <h3 className="text-lg md:text-xl font-medium text-gray-400">Top Videos</h3>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {ytLongs.map((video) => (
                  <YouTubeCard 
                    key={video.id} 
                    video={video} 
                    isShort={false} 
                    isMobile={isMobile}
                    isActive={activeVideoId === video.id}
                    onActivate={() => setActiveVideoId(video.id)}
                    onDeactivate={() => setActiveVideoId(null)}
                    onToggle={() => setActiveVideoId((prev) => (prev === video.id ? null : video.id))}
                  />
                ))}
              </div>
            </div>
          )}
          
          {hasNoData && (
             <p className="rounded-2xl border border-slate-700/70 bg-slate-900/60 px-6 py-10 text-center text-lg text-slate-300">
               {igMessage || "Content loading..."}
             </p>
          )}
        </div>
      </div>
    </section>
  );
}
