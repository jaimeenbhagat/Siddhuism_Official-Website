"use client";

import type { VideoItem } from "@/lib/content";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type VideoCardProps = {
  video: VideoItem;
  onOpen: () => void;
};

export default function VideoCard({ video, onOpen }: VideoCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const node = cardRef.current;

    if (!node) {
      return;
    }

    const lazyObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            obs.disconnect();
          }
        });
      },
      { threshold: 0.15, rootMargin: "240px 0px" },
    );

    lazyObserver.observe(node);

    return () => lazyObserver.disconnect();
  }, []);

  useEffect(() => {
    const node = cardRef.current;
    const player = videoRef.current;

    if (!node || !player || !shouldLoad) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            player.play().catch(() => undefined);
          } else {
            player.pause();
          }
        });
      },
      { threshold: 0.6 },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      player.pause();
    };
  }, [shouldLoad]);

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.35 }}
      className="group relative overflow-hidden rounded-2xl border border-slate-700/70 bg-slate-950/80"
    >
      {!loaded ? (
        <div className="absolute inset-0 z-10 animate-pulse bg-gradient-to-br from-slate-800 to-slate-900" />
      ) : null}

      <video
        ref={videoRef}
        className="aspect-[9/16] w-full object-cover"
        poster={video.poster}
        src={shouldLoad ? video.src : undefined}
        muted
        loop
        playsInline
        preload="metadata"
        onLoadedData={() => setLoaded(true)}
      />

      <button
        onClick={onOpen}
        className="absolute inset-0 z-20 bg-gradient-to-t from-black/65 via-transparent to-transparent opacity-0 transition group-hover:opacity-100"
        aria-label={`Open ${video.title}`}
      >
        <div className="absolute right-3 bottom-3 rounded-full border border-slate-300/30 bg-black/45 px-3 py-1 text-xs text-white backdrop-blur-lg">
          Open
        </div>
      </button>

      <div className="absolute right-3 top-3 rounded-full border border-slate-300/20 bg-black/50 px-2 py-1 text-xs text-white backdrop-blur-lg">
        {video.duration}
      </div>

      <div className="p-4">
        <p className="text-sm text-blue-300">{video.category}</p>
        <h3 className="mt-1 font-medium text-slate-100">{video.title}</h3>
      </div>
    </motion.article>
  );
}
