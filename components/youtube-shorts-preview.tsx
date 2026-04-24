"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FiPlayCircle } from "react-icons/fi";
import SectionHeading from "@/components/ui/section-heading";
import type { YouTubeVideo } from "@/lib/social-types";

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
};

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

function ShortsCard({
  video,
  isActive,
  isMobile,
  onActivate,
  onDeactivate,
  onToggle,
}: {
  video: YouTubeVideo;
  isActive: boolean;
  isMobile: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
  onToggle: () => void;
}) {
  const embedUrl = `https://www.youtube.com/embed/${video.id}?autoplay=1&mute=${isMobile ? 0 : 1}&controls=${isMobile ? 1 : 0}&modestbranding=1&rel=0&playsinline=1`;

  return (
    <motion.article
      onMouseEnter={isMobile ? undefined : onActivate}
      onMouseLeave={isMobile ? undefined : onDeactivate}
      onClick={isMobile ? onToggle : undefined}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.28 }}
      className="group relative shrink-0 w-50 md:w-55 overflow-hidden rounded-2xl border border-slate-800/40 bg-slate-950/90 shadow-[0_18px_45px_rgba(2,6,23,0.45)] transition-transform duration-300 hover:scale-[1.02]"
      role={isMobile ? "button" : undefined}
      aria-label={isMobile ? `Play ${video.title}` : undefined}
    >
      <div className="relative aspect-9/16 overflow-hidden">
        <Image
          src={video.thumbnailUrl}
          alt={video.title}
          fill
          className={`object-cover transition duration-700 ${isActive ? "opacity-0" : "opacity-100 group-hover:scale-105"}`}
        />
        <div className={`absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent transition-opacity duration-300 ${isActive ? "opacity-0 pointer-events-none" : "opacity-100"}`} />

        {isActive ? (
          <iframe
            className={`absolute inset-0 h-full w-full ${isMobile ? "pointer-events-auto" : "pointer-events-none"}`}
            src={embedUrl}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : null}

        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/40 p-3 backdrop-blur-md transition-opacity duration-300 ${isActive ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
          <FiPlayCircle className="text-white/90" size={32} />
        </div>

        {isActive ? (
          <a
            href={video.videoUrl}
            target="_blank"
            rel="noreferrer"
            onClick={(event) => event.stopPropagation()}
            className="absolute right-3 bottom-3 z-20 rounded-full border border-slate-200/40 bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md transition hover:border-red-300/70 hover:text-red-100"
          >
            Open on YouTube
          </a>
        ) : null}
      </div>
    </motion.article>
  );
}

export default function YouTubeShortsPreview() {
  const isMobile = useIsMobile();
  const [shortsRaw, setShortsRaw] = useState<ApiYouTubeRow[]>([]);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/youtube/videos")
      .then((response) => response.json())
      .then((response: ApiYouTubeResponse) => {
        setShortsRaw(response?.shorts || []);
      })
      .catch(() => {
        setShortsRaw([]);
      });
  }, []);

  useEffect(() => {
    if (!isMobile) {
      setActiveVideoId(null);
    }
  }, [isMobile]);

  const shorts = useMemo(() => {
    return shortsRaw.slice(0, 5).map((row): YouTubeVideo => ({
      id: row.id,
      title: row.title,
      description: row.description,
      thumbnailUrl: row.thumbnail,
      videoUrl: row.video_url,
      publishedAt: row.published_at,
      views: row.views,
      likes: row.likes,
      comments: row.comments,
    }));
  }, [shortsRaw]);

  if (shorts.length === 0) {
    return null;
  }

  return (
    <section id="portfolio-preview" className="px-6 py-12 md:py-16">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Portfolio"
          title="Featured Content"
          description="Latest YouTube Shorts"
        />

        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
          {shorts.map((video) => (
            <div key={video.id} className="snap-start">
              <ShortsCard
                video={video}
                isMobile={isMobile}
                isActive={activeVideoId === video.id}
                onActivate={() => setActiveVideoId(video.id)}
                onDeactivate={() => setActiveVideoId(null)}
                onToggle={() => setActiveVideoId((prev) => (prev === video.id ? null : video.id))}
              />
            </div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.25 }}
          className="mt-8 flex justify-center"
        >
          <Link
            href="/portfolio"
            className="rounded-full bg-linear-to-r from-blue-500 via-violet-500 to-fuchsia-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_30px_rgba(99,102,241,0.35)] transition hover:scale-[1.02]"
          >
            Explore Portfolio
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
