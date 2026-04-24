"use client";

import { useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { PortfolioVideo } from "@/lib/portfolio-db";
import { useState } from "react";

type VideoCardProps = {
  item: Pick<PortfolioVideo, "id" | "title" | "video_url" | "thumbnail"> & { category: string };
};

function getYouTubeId(url: string) {
  const match = url.match(/[?&]v=([^&]+)/);
  if (match) {
    return match[1];
  }

  const short = url.match(/youtu\.be\/([^?&]+)/);
  if (short) {
    return short[1];
  }

  const shorts = url.match(/\/shorts\/([^?&]+)/);
  return shorts ? shorts[1] : null;
}

export default function VideoCard({ item }: VideoCardProps) {
  const [hovered, setHovered] = useState(false);
  const youtubeId = useMemo(() => getYouTubeId(item.video_url), [item.video_url]);
  const isYouTube = item.video_url.includes("youtube.com") || item.video_url.includes("youtu.be");

  const embedSrc = useMemo(() => {
    if (!youtubeId) {
      return "";
    }

    return `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&mute=1&controls=0&rel=0&playsinline=1&loop=1&playlist=${youtubeId}`;
  }, [youtubeId]);

  const thumbnail = useMemo(() => {
    if (youtubeId) {
      return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
    }

    return item.thumbnail;
  }, [item.thumbnail, youtubeId]);

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.28 }}
      className="group overflow-hidden rounded-2xl border border-slate-700/70 bg-slate-950/80 shadow-[0_12px_45px_rgba(2,6,23,0.45)]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative aspect-video overflow-hidden">
        {isYouTube && youtubeId ? (
          <>
            <Image
              src={thumbnail}
              alt={item.title}
              fill
              sizes="(max-width: 1024px) 100vw, 33vw"
              className={`object-cover transition duration-700 ${hovered ? "opacity-0" : "opacity-100 group-hover:scale-105"}`}
            />
            {hovered ? (
              <iframe
                src={embedSrc}
                title={item.title}
                loading="lazy"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full pointer-events-none"
              />
            ) : null}
          </>
        ) : (
          <video
            src={item.video_url}
            poster={item.thumbnail}
            className="h-full w-full object-cover"
            muted
            loop
            playsInline
            preload="metadata"
          />
        )}

        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/65 via-black/10 to-transparent" />
        <a
          href={item.video_url}
          target="_blank"
          rel="noreferrer"
          className="absolute right-3 bottom-3 rounded-full border border-slate-300/30 bg-black/55 px-3 py-1.5 text-xs text-white backdrop-blur-md transition hover:border-blue-300/60 hover:text-blue-100"
        >
          Watch
        </a>
      </div>

      <div className="p-4">
        <h3 className="line-clamp-2 text-base font-semibold text-slate-100">{item.title}</h3>
        <p className="mt-2 text-xs uppercase tracking-[0.18em] text-blue-300">{item.category}</p>
      </div>
    </motion.article>
  );
}
