"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { PortfolioVideo } from "@/lib/portfolio-db";
import { FiPlayCircle } from "react-icons/fi";

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

export default function VideoCard({ item }: VideoCardProps) {
  const [isActive, setIsActive] = useState(false);
  const isMobile = useIsMobile();
  const youtubeId = useMemo(() => getYouTubeId(item.video_url), [item.video_url]);
  const isYouTube = item.video_url.includes("youtube.com") || item.video_url.includes("youtu.be");

  const embedSrc = useMemo(() => {
    if (!youtubeId) {
      return "";
    }

    return `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&mute=0&controls=1&rel=0&playsinline=1&loop=1&playlist=${youtubeId}`;
  }, [isMobile, youtubeId]);

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
      onMouseEnter={isMobile ? undefined : () => setIsActive(true)}
      onMouseLeave={isMobile ? undefined : () => setIsActive(false)}
      onClick={isMobile ? () => setIsActive(!isActive) : () => window.open(item.video_url, "_blank")}
      role={isMobile ? "button" : "link"}
      aria-label={isMobile ? `Play ${item.title}` : `Watch ${item.title} on YouTube`}
    >
      <div className="relative aspect-video overflow-hidden">
        {isYouTube && youtubeId ? (
          <>
            <Image
              src={thumbnail}
              alt={item.title}
              fill
              sizes="(max-width: 1024px) 100vw, 33vw"
              className={`object-cover transition duration-700 ${isActive ? "opacity-0" : "opacity-100 group-hover:scale-105"}`}
            />
            {isActive ? (
              <iframe
                src={embedSrc}
                title={item.title}
                loading="lazy"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                className={`absolute inset-0 h-full w-full ${!isMobile ? "pointer-events-none" : ""}`}
              />
            ) : null}
          </>
        ) : (
          <>
            <Image
              src={thumbnail}
              alt={item.title}
              fill
              sizes="(max-width: 1024px) 100vw, 33vw"
              className={`object-cover transition duration-700 ${isActive ? "opacity-0" : "opacity-100 group-hover:scale-105"}`}
            />
            {isActive ? (
              <video
                src={item.video_url}
                poster={item.thumbnail}
                className={`absolute inset-0 h-full w-full object-cover ${!isMobile ? "pointer-events-none" : ""}`}
                autoPlay
                muted={false}
                loop
                playsInline
                controls={isMobile}
                preload="metadata"
              />
            ) : null}
          </>
        )}

        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/65 via-black/10 to-transparent" />
        {!isActive ? (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="rounded-full bg-black/45 p-3 backdrop-blur-md">
              <FiPlayCircle className="text-white/90" size={32} />
            </div>
          </div>
        ) : null}

        {isMobile && isActive && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsActive(false);
            }}
            className="absolute top-3 right-3 z-10 rounded-full bg-black/60 p-2 text-white hover:bg-black/80"
            aria-label="Close video"
          >
            ✕
          </button>
        )}

        <a
          href={item.video_url}
          target="_blank"
          rel="noreferrer"
          onClick={(event) => event.stopPropagation()}
          className="absolute right-3 bottom-3 rounded-full border border-slate-300/30 bg-black/55 px-3 py-1.5 text-xs text-white backdrop-blur-md transition hover:border-blue-300/60 hover:text-blue-100"
        >
          {isYouTube ? "Open on YouTube" : "Open on Platform"}
        </a>
      </div>

      <div className="p-4">
        <h3 className="line-clamp-2 text-base font-semibold text-slate-100">{item.title}</h3>
        <p className="mt-2 text-xs uppercase tracking-[0.18em] text-blue-300">{item.category}</p>
      </div>
    </motion.article>
  );
}
