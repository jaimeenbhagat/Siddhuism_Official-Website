"use client";

import { TAGLINES } from "@/lib/content";
import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import type { YouTubeSnapshot, InstagramSnapshot } from "@/lib/social-types";
import { FiYoutube, FiInstagram, FiVideo, FiEye, FiTrendingUp } from "react-icons/fi";

type HeroSectionProps = {
  onWatchClick: () => void;
  onContactClick: () => void;
};

function useTyping(words: string[], speed = 70, pause = 1600) {
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const currentWord = useMemo(() => words[wordIndex] ?? "", [wordIndex, words]);

  useEffect(() => {
    const timeout = setTimeout(
      () => {
        if (!isDeleting && charIndex < currentWord.length) {
          setCharIndex((value) => value + 1);
          return;
        }

        if (!isDeleting && charIndex === currentWord.length) {
          setIsDeleting(true);
          return;
        }

        if (isDeleting && charIndex > 0) {
          setCharIndex((value) => value - 1);
          return;
        }

        setIsDeleting(false);
        setWordIndex((value) => (value + 1) % words.length);
      },
      !isDeleting && charIndex === currentWord.length ? pause : isDeleting ? speed / 2 : speed,
    );

    return () => clearTimeout(timeout);
  }, [charIndex, currentWord.length, isDeleting, pause, speed, words.length]);

  return currentWord.slice(0, charIndex);
}

function StatCard({ label, value, icon, isText = false }: { label: string; value: string; icon?: React.ReactNode; isText?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="flex flex-1 items-center gap-3 rounded-xl border border-slate-700/50 bg-slate-900/50 p-3 shadow-md backdrop-blur-md min-w-[140px]"
    >
      <div className="flex-shrink-0">{icon}</div>
      <div>
        <p className={`font-semibold text-slate-100 ${isText ? 'text-xs leading-tight' : 'text-lg md:text-xl tracking-tight'}`}>
          {value}
        </p>
        <p className="mt-0.5 text-[9px] uppercase tracking-wider font-medium text-slate-400">{label}</p>
      </div>
    </motion.div>
  );
}

function HeroStats({ youtubeStats, instagramStats }: { youtubeStats: YouTubeSnapshot | null; instagramStats: InstagramSnapshot | null }) {
  const primaryStats = useMemo(
    () => [
      {
        value: youtubeStats
          ? new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(youtubeStats.viewCount)
          : "500K+",
        label: "Total Views",
        icon: <FiEye className="text-blue-400" size={20} />,
      },
      {
        value: instagramStats
          ? new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(instagramStats.followersCount)
          : "1.4K+",
        label: "Instagram",
        icon: <FiInstagram className="text-pink-500" size={20} />,
      },
      {
        value: youtubeStats
          ? new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(youtubeStats.subscriberCount)
          : "700+",
        label: "YouTube",
        icon: <FiYoutube className="text-red-500" size={20} />,
      },
      {
        value: "Travel & Lifestyle",
        label: "Creator",
        icon: <FiVideo className="text-purple-400" size={20} />,
        isText: true,
      },
    ],
    [youtubeStats, instagramStats],
  );

  const totalContent = (youtubeStats?.videoCount ?? 150) + (instagramStats?.mediaCount ?? 150);

  return (
    <div className="mt-10">
      <div className="flex flex-wrap items-stretch gap-3">
        {primaryStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-6 border-t border-slate-800/60 pt-4 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-400"></span>
          <span>{totalContent}+ Pieces of Content</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-pink-500"></span>
          <span>YouTube • Instagram</span>
        </div>
      </div>
    </div>
  );
}

export default function HeroSection({ onWatchClick, onContactClick }: HeroSectionProps) {
  const typingText = useTyping(TAGLINES);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [youtubeStats, setYoutubeStats] = useState<YouTubeSnapshot | null>(null);
  const [instagramStats, setInstagramStats] = useState<InstagramSnapshot | null>(null);

  const heroVideoUrl =
    "https://res.cloudinary.com/dkjyjzl8u/video/upload/v1776956034/Mantra_Surfing_club_Collab_Cinematic_-_Compressed_ffaody.mov";

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [ytRes, igRes] = await Promise.all([
          fetch("/api/youtube", { cache: "no-store" }),
          fetch("/api/instagram", { cache: "no-store" }),
        ]);

        if (ytRes.ok) {
          const ytPayload = (await ytRes.json()) as YouTubeSnapshot;
          setYoutubeStats(ytPayload);
        }
        if (igRes.ok) {
          const igPayload = (await igRes.json()) as InstagramSnapshot;
          setInstagramStats(igPayload);
        }
      } catch {
        // Keep fallback values when fetch fails.
      }
    };

    void loadStats();
  }, []);

  const togglePlayback = () => {
    const node = videoRef.current;
    if (!node) {
      return;
    }

    if (node.paused) {
      void node.play();
      setIsPlaying(true);
      return;
    }

    node.pause();
    setIsPlaying(false);
  };



  return (
    <section id="top" className="relative overflow-hidden px-6 pt-14 md:pt-16">
      <div className="hero-gradient absolute inset-0 -z-20" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.2),transparent_30%),radial-gradient(circle_at_80%_70%,rgba(168,85,247,0.18),transparent_30%)]" />

      <div className="mx-auto flex min-h-screen w-full max-w-7xl items-center py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className="grid w-full gap-12 lg:grid-cols-2 lg:items-center"
        >
          <div className="w-full">
            <p className="mb-4 inline-flex rounded-full border border-blue-300/35 bg-slate-950/55 px-4 py-1 text-xs uppercase tracking-[0.28em] text-blue-200 backdrop-blur-xl">
              Creator Portfolio
            </p>
            <h1 className="text-balance text-5xl font-semibold tracking-tight text-slate-100 text-glow md:text-7xl">
              siddhuism_official
            </h1>
            <p className="mt-6 text-balance text-lg leading-8 text-slate-300 md:text-2xl md:leading-9">
              {typingText}
              <span className="ml-1 animate-pulse text-blue-300">|</span>
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-slate-400">
              <span className="rounded-full border border-slate-700/80 bg-slate-900/70 px-4 py-2 backdrop-blur-lg">Travel first</span>
              <span className="rounded-full border border-slate-700/80 bg-slate-900/70 px-4 py-2 backdrop-blur-lg">Premium reels</span>
              <span className="rounded-full border border-slate-700/80 bg-slate-900/70 px-4 py-2 backdrop-blur-lg">Lifestyle edits</span>
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <button
                onClick={onWatchClick}
                className="rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-fuchsia-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_30px_rgba(99,102,241,0.35)] transition hover:scale-[1.02]"
              >
                Watch Content
              </button>
              <button
                onClick={onContactClick}
                className="rounded-full border border-slate-700/80 bg-slate-950/55 px-6 py-3 text-sm font-semibold text-slate-100 backdrop-blur-xl transition hover:border-blue-300/55 hover:bg-slate-900/90"
              >
                Contact
              </button>
            </div>

            <HeroStats youtubeStats={youtubeStats} instagramStats={instagramStats} />
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.12 }}
            className="relative w-full"
          >
            <div className="absolute inset-2 rounded-2xl bg-gradient-to-br from-blue-500/30 via-transparent to-violet-500/25 blur-3xl" />

            <div className="relative w-full h-[400px] md:h-[500px] lg:h-[550px] overflow-hidden rounded-2xl border border-slate-700/50 shadow-[0_0_40px_rgba(99,102,241,0.2)] bg-black">
              <video
                ref={videoRef}
                src={heroVideoUrl}
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

              <button
                type="button"
                onClick={togglePlayback}
                className="absolute bottom-4 right-4 rounded-full border border-slate-300/40 bg-black/55 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-100 backdrop-blur-md transition hover:border-blue-300/70 hover:text-blue-200"
              >
                {isPlaying ? "Pause" : "Play"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <a
        href="#about"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.25em] text-slate-300"
      >
        Scroll
      </a>
    </section>
  );
}
