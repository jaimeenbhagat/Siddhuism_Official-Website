"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FiInstagram, FiYoutube, FiEye, FiHeart, FiMessageCircle, FiPlayCircle } from "react-icons/fi";
import SectionHeading from "@/components/ui/section-heading";
import type { InstagramSnapshot, YouTubeSnapshot, InstagramMedia, YouTubeVideo } from "@/lib/social-types";
import { preconnect } from "react-dom";

function compact(num: number) {
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(num);
}

function InstagramReelCard({ media, isActive, onActivate, onDeactivate }: { media: InstagramMedia, isActive: boolean, onActivate: () => void, onDeactivate: () => void }) {
  const isVideo = media.mediaType === 'VIDEO';

  return (
    <motion.a
      href={media.permalink}
      target="_blank"
      rel="noreferrer"
      onMouseEnter={onActivate}
      onMouseLeave={onDeactivate}
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative aspect-[9/16] overflow-hidden rounded-xl border border-slate-700/60 bg-slate-900/80 shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:scale-[1.02] transition-all duration-300 block"
    >
      <div className="absolute inset-0 bg-slate-900">
        <Image
          src={media.thumbnailUrl || media.mediaUrl}
          alt={media.caption?.slice(0, 50) || "Instagram Reel"}
          fill
          className={`object-cover transition duration-700 ${isActive ? "opacity-0" : "opacity-100 group-hover:scale-105"}`}
        />
        <div className={`absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent transition-opacity duration-300 ${isActive ? "opacity-0 pointer-events-none" : "opacity-100"}`} />
        
        {isActive && isVideo && (
          <video 
            src={media.mediaUrl} 
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted={false}
            loop
            playsInline
          />
        )}

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
      </div>
    </motion.a>
  );
}

function YouTubeCard({ video, isShort, isActive, onActivate, onDeactivate }: { video: YouTubeVideo; isShort?: boolean; isActive: boolean, onActivate: () => void, onDeactivate: () => void }) {
  return (
    <motion.a
      href={video.videoUrl}
      target="_blank"
      rel="noreferrer"
      onMouseEnter={onActivate}
      onMouseLeave={onDeactivate}
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`group relative overflow-hidden rounded-xl border border-slate-700/60 bg-slate-900/80 shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:scale-[1.02] transition-all duration-300 block ${isShort ? 'aspect-[9/16]' : 'aspect-video'}`}
    >
      <div className="absolute inset-0 bg-slate-900">
        <Image
          src={video.thumbnailUrl}
          alt={video.title}
          fill
          className={`object-cover transition duration-700 ${isActive ? "opacity-0" : "opacity-100 group-hover:scale-105"}`}
        />
        <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent transition-opacity duration-300 ${isActive ? "opacity-0 pointer-events-none" : "opacity-100"}`} />
        
        {isActive && (
          <iframe
            className="absolute inset-0 h-full w-full pointer-events-none"
            src={`https://www.youtube.com/embed/${video.id}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&playsinline=1`}
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
      </div>
    </motion.a>
  );
}

export default function YouTubeVideoGrid() {
  preconnect("https://www.youtube.com");
  
  const [igStats, setIgStats] = useState<InstagramSnapshot | null>(null);
  const [ytShortsRaw, setYtShortsRaw] = useState<any[]>([]);
  const [ytLongsRaw, setYtLongsRaw] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/instagram").then(res => res.json()).catch(() => null),
      fetch("/api/youtube").then(res => res.json()).catch(() => ({ shorts: [], longs: [] }))
    ]).then(([ig, yt]) => {
      setIgStats(ig);
      setYtShortsRaw(yt?.shorts || []);
      setYtLongsRaw(yt?.longs || []);
      setLoading(false);
    });
  }, []);

  const { reels, ytShorts, ytLongs } = useMemo(() => {
    const r = (igStats?.media?.filter(m => m.mediaType === "VIDEO") || [])
      .sort((a, b) => (b.likeCount + b.commentsCount) - (a.likeCount + a.commentsCount))
      .slice(0, 10);
      
    const mapYt = (row: any): YouTubeVideo => ({
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
    <section id="youtube-hub" className="px-6 py-20 md:py-24">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Trending Content" title="Content That Performs" />
        <div className="h-64 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-slate-500"></div>
        </div>
      </div>
    </section>
  );

  const hasNoData = reels.length === 0 && ytShorts.length === 0 && ytLongs.length === 0;

  return (
    <section id="youtube-hub" className="px-6 py-20 md:py-24">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Trending Content"
          title="Content That Performs"
        />

        <div className="space-y-16">
          {reels.length > 0 && (
            <div>
              <div className="mb-6 flex items-center gap-2">
                <FiInstagram className="text-pink-500" size={24} />
                <h3 className="text-2xl font-semibold text-slate-100">Trending Reels</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {reels.map((media) => (
                  <InstagramReelCard 
                    key={media.id} 
                    media={media} 
                    isActive={activeVideoId === media.id}
                    onActivate={() => setActiveVideoId(media.id)}
                    onDeactivate={() => setActiveVideoId(null)}
                  />
                ))}
              </div>
            </div>
          )}

          {ytShorts.length > 0 && (
            <div>
              <div className="mb-6 flex items-center gap-2">
                <FiYoutube className="text-red-500" size={24} />
                <h3 className="text-2xl font-semibold text-slate-100">Trending Shorts</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {ytShorts.map((video) => (
                  <YouTubeCard 
                    key={video.id} 
                    video={video} 
                    isShort={true} 
                    isActive={activeVideoId === video.id}
                    onActivate={() => setActiveVideoId(video.id)}
                    onDeactivate={() => setActiveVideoId(null)}
                  />
                ))}
              </div>
            </div>
          )}

          {ytLongs.length > 0 && (
            <div>
              <div className="mb-6 flex items-center gap-2">
                <FiYoutube className="text-red-500" size={24} />
                <h3 className="text-2xl font-semibold text-slate-100">Top Videos</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {ytLongs.map((video) => (
                  <YouTubeCard 
                    key={video.id} 
                    video={video} 
                    isShort={false} 
                    isActive={activeVideoId === video.id}
                    onActivate={() => setActiveVideoId(video.id)}
                    onDeactivate={() => setActiveVideoId(null)}
                  />
                ))}
              </div>
            </div>
          )}
          
          {hasNoData && (
             <p className="rounded-2xl border border-slate-700/70 bg-slate-900/60 px-6 py-10 text-center text-lg text-slate-300">
               New content dropping soon
             </p>
          )}
        </div>
      </div>
    </section>
  );
}
