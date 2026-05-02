"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FiPlayCircle } from "react-icons/fi";
import SectionHeading from "@/components/ui/section-heading";
import type { YouTubeVideo } from "@/lib/social-types";

// Hardcoded portfolio shorts video IDs
const PORTFOLIO_VIDEO_IDS = [
  "A2IEH9nPtaw",
  "yG5XWKnLtlQ",
  "HYBgRXHpqzM",
  "BDnw_ukiilo",
  "ygm0R8J4oIY",
];

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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.28 }}
      className="group relative w-full overflow-hidden rounded-2xl border border-slate-800/40 bg-slate-950/90 shadow-[0_18px_45px_rgba(2,6,23,0.45)] transition-transform duration-300 hover:scale-[1.02]"
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
            ref={iframeRef}
            className="absolute inset-0 h-full w-full pointer-events-none"
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
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  const shorts = useMemo(() => {
    return PORTFOLIO_VIDEO_IDS.map((id): YouTubeVideo => ({
      id,
      title: "Portfolio Video",
      description: "",
      thumbnailUrl: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      videoUrl: `https://www.youtube.com/watch?v=${id}`,
      publishedAt: new Date().toISOString(),
      views: 0,
      likes: 0,
      comments: 0,
    }));
  }, []);

  if (shorts.length === 0) {
    return null;
  }

  return (
    <section id="portfolio-preview" className="px-4 py-12 sm:px-6 md:px-8 md:py-16 lg:px-10">
      <div className="mx-auto w-full max-w-350 2xl:max-w-400">
        <SectionHeading
          eyebrow="Portfolio"
          title="Featured Content"
          description="Latest YouTube Shorts"
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {shorts.map((video) => (
            <div key={video.id} className="w-full">
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
