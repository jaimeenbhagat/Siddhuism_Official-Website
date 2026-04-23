"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import type { PortfolioVideo } from "@/lib/portfolio-db";

type VideoCardProps = {
  item: PortfolioVideo;
};

function getYouTubeId(url: string) {
  const match = url.match(/v=([^&]+)/);
  if (match) {
    return match[1];
  }

  const short = url.match(/youtu\.be\/([^?&]+)/);
  return short ? short[1] : null;
}

export default function VideoCard({ item }: VideoCardProps) {
  const youtubeId = useMemo(() => getYouTubeId(item.video_url), [item.video_url]);
  const isYouTube = item.video_url.includes("youtube.com") || item.video_url.includes("youtu.be");

  const embedSrc = useMemo(() => {
    if (!youtubeId) {
      return "";
    }

    return `https://www.youtube-nocookie.com/embed/${youtubeId}?mute=1&controls=1&rel=0&playsinline=1`;
  }, [youtubeId]);

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.28 }}
      className="group overflow-hidden rounded-2xl border border-slate-700/70 bg-slate-950/80 shadow-[0_12px_45px_rgba(2,6,23,0.45)]"
    >
      <div className="relative aspect-video overflow-hidden">
        {isYouTube && youtubeId ? (
          <iframe
            src={embedSrc}
            title={item.title}
            loading="lazy"
            allow="autoplay; encrypted-media"
            allowFullScreen
            className="h-full w-full rounded-xl"
          />
        ) : (
          <video
            src={item.video_url}
            poster={item.thumbnail}
            className="h-full w-full object-cover"
            controls
            playsInline
            preload="metadata"
          />
        )}
      </div>

      <div className="p-4">
        <h3 className="line-clamp-2 text-base font-semibold text-slate-100">{item.title}</h3>
        <p className="mt-2 text-xs uppercase tracking-[0.18em] text-blue-300">{item.category}</p>
      </div>
    </motion.article>
  );
}
