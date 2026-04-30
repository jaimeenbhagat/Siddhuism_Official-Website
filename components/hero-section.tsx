"use client";

import { TAGLINES } from "@/lib/content";
import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { FiYoutube, FiInstagram, FiVideo, FiEye, FiPlay, FiPause, FiVolume2, FiVolumeX, FiMaximize, FiChevronDown } from "react-icons/fi";

import { AnimatedCounter } from "@/components/ui/animated-counter";

type HeroSectionProps = {
  onWatchClick: () => void;
  onContactClick: () => void;
};

type LiveStats = {
  youtube: { subscribers: number | null; views: number | null; videos: number | null };
  instagram: { followers: number | null; media: number | null };
} | null;

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

function StatCard({ label, value, icon, isText = false, isLive = false, numericValue = null }: { label: string; value?: React.ReactNode; icon?: React.ReactNode; isText?: boolean; isLive?: boolean; numericValue?: number | null }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="flex min-w-35 flex-1 items-center gap-3 rounded-xl border border-slate-700/50 bg-slate-900/50 p-3 shadow-md backdrop-blur-md"
    >
      <div className="shrink-0">{icon}</div>
      <div>
        <p className={`font-semibold text-slate-100 flex items-center ${isText ? 'text-xs leading-tight' : 'text-lg md:text-xl tracking-tight'}`}>
          {isLive ? (
            <>
              <AnimatedCounter value={numericValue ?? null} />
              {numericValue !== null && <span className="text-blue-400 ml-0.5">+</span>}
            </>
          ) : (
            value
          )}
        </p>
        <p className="mt-0.5 text-[9px] uppercase tracking-wider font-medium text-slate-400">{label}</p>
      </div>
    </motion.div>
  );
}

function HeroStats({ stats }: { stats: LiveStats }) {
  const primaryStats = useMemo(
    () => [
      {
        numericValue: stats?.youtube?.views ?? null,
        label: "Total Views",
        icon: <FiEye className="text-blue-400" size={20} />,
        isLive: true,
      },
      {
        numericValue: stats?.instagram?.followers ?? null,
        label: "Instagram",
        icon: <FiInstagram className="text-pink-500" size={20} />,
        isLive: true,
      },
      {
        numericValue: stats?.youtube?.subscribers ?? null,
        label: "YouTube",
        icon: <FiYoutube className="text-red-500" size={20} />,
        isLive: true,
      },
      {
        value: "Travel & Lifestyle",
        label: "Creator",
        icon: <FiVideo className="text-purple-400" size={20} />,
        isText: true,
      },
    ],
    [stats],
  );

  const totalContent = ((stats?.youtube?.videos ?? 0) + (stats?.instagram?.media ?? 0)) || 150;

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
          <span><AnimatedCounter value={totalContent} />+ Pieces of Content</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-pink-500"></span>
          <span>YouTube | Instagram</span>
        </div>
      </div>
    </div>
  );
}

export default function HeroSection({ onWatchClick, onContactClick }: HeroSectionProps) {
  const typingText = useTyping(TAGLINES);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [stats, setStats] = useState<LiveStats>(null);

  const heroVideoUrl =
    "https://res.cloudinary.com/dkjyjzl8u/video/upload/v1776956034/Mantra_Surfing_club_Collab_Cinematic_-_Compressed_ffaody.mov";

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await fetch("/api/stats", { cache: "no-store" });
        if (res.ok) {
          const payload = await res.json();
          setStats(payload);
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

  const toggleMute = () => {
    const node = videoRef.current;
    if (!node) return;
    node.muted = !node.muted;
    setIsMuted(node.muted);
  };

  const toggleFullScreen = () => {
    const node = videoRef.current;
    if (!node) return;
    if (node.requestFullscreen) {
      void node.requestFullscreen();
    } else {
      const webkitNode = node as HTMLVideoElement & { webkitRequestFullscreen?: () => void };
      if (webkitNode.webkitRequestFullscreen) {
        void webkitNode.webkitRequestFullscreen();
      }
    }
  };



  return (
    <section id="top" className="relative overflow-hidden px-4 pt-3 sm:px-6 md:px-8 md:pt-2 lg:px-10">
      <div className="hero-gradient absolute inset-0 -z-20" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.2),transparent_30%),radial-gradient(circle_at_80%_70%,rgba(168,85,247,0.18),transparent_30%)]" />

      <div className="mx-auto flex min-h-svh w-full max-w-350 items-center py-5 sm:py-6 md:py-7 lg:max-w-400">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className="grid w-full items-start gap-4 md:gap-5 lg:grid-cols-[2fr_0.6fr] lg:gap-5"
        >
          <div className="w-full pl-1 pt-12 sm:pl-2 lg:order-2 lg:pl-4 xl:pl-6">
            <p className="mb-3 inline-flex rounded-full border border-gray-700/60 bg-gray-900/50 px-4 py-1 text-sm font-medium uppercase tracking-[0.2em] text-gray-500 backdrop-blur-xl">
              Creator Portfolio
            </p>
            <h1 className="text-balance text-2xl font-bold tracking-tight text-slate-100 sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
              siddhuism_official
            </h1>
            <p className="mt-3 max-w-2xl text-pretty text-sm font-medium leading-6 text-gray-400 sm:text-base md:text-lg md:leading-7 lg:text-lg lg:leading-8">
              {typingText}
              <span className="ml-1 animate-pulse text-blue-300">|</span>
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-slate-400 sm:text-sm">
              <span className="rounded-full border border-slate-700/80 bg-slate-900/70 px-4 py-2 backdrop-blur-lg">Travel first</span>
              <span className="rounded-full border border-slate-700/80 bg-slate-900/70 px-4 py-2 backdrop-blur-lg">Premium reels</span>
              <span className="rounded-full border border-slate-700/80 bg-slate-900/70 px-4 py-2 backdrop-blur-lg">Lifestyle edits</span>
            </div>

            <div className="mt-6 flex flex-wrap gap-4">
              <button
                onClick={onWatchClick}
                className="rounded-full bg-linear-to-r from-blue-500 via-violet-500 to-fuchsia-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_0_30px_rgba(99,102,241,0.35)] transition hover:scale-[1.02] sm:px-6"
              >
                Watch Content
              </button>
              <button
                onClick={onContactClick}
                className="rounded-full border border-slate-700/80 bg-slate-950/55 px-5 py-3 text-sm font-semibold text-slate-100 backdrop-blur-xl transition hover:border-blue-300/55 hover:bg-slate-900/90 sm:px-6"
              >
                Contact
              </button>
            </div>

            <HeroStats stats={stats} />
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.12 }}
            className="relative mx-auto flex w-full max-w-60 flex-col items-center sm:max-w-64 md:max-w-72 lg:order-1"
          >
            <div className="absolute inset-1 rounded-2xl bg-linear-to-br from-blue-500/30 via-transparent to-violet-500/25 blur-3xl" />

            <div className="relative z-10 mb-2 flex items-center pt-15 justify-center gap-3">
              <div className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.8)]" />
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-100  text-glow md:text-base">Highlight Reel</h3>
            </div>

            <div className="relative aspect-9/16 w-full overflow-hidden rounded-2xl border border-slate-700/50 bg-black shadow-[0_0_40px_rgba(99,102,241,0.2)] group">
              <video
                ref={videoRef}
                src={heroVideoUrl}
                className="w-full h-full object-cover"
                autoPlay
                muted={isMuted}
                loop
                playsInline
                preload="metadata"
              />

              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  type="button"
                  onClick={togglePlayback}
                  className="rounded-full bg-black/60 p-2.5 text-white backdrop-blur-md transition hover:bg-black/80 hover:text-blue-300 hover:scale-110"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <FiPause size={18} /> : <FiPlay size={18} className="ml-0.5" />}
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={toggleMute}
                    className="rounded-full bg-black/60 p-2.5 text-white backdrop-blur-md transition hover:bg-black/80 hover:text-blue-300 hover:scale-110"
                    aria-label={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? <FiVolumeX size={18} /> : <FiVolume2 size={18} />}
                  </button>
                  <button
                    type="button"
                    onClick={toggleFullScreen}
                    className="rounded-full bg-black/60 p-2.5 text-white backdrop-blur-md transition hover:bg-black/80 hover:text-blue-300 hover:scale-110"
                    aria-label="Full Screen"
                  >
                    <FiMaximize size={18} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <a
        href="#about"
        className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-slate-700/70 bg-slate-950/55 p-2 text-slate-200 backdrop-blur-md transition hover:border-blue-300/60 hover:text-blue-200"
        aria-label="Scroll down"
      >
        <FiChevronDown className="animate-bounce" size={20} />
      </a>
    </section>
  );
}
