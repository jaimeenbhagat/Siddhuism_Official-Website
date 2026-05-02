"use client";

// (TAGLINES removed — not used in this file)
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

// useTyping helper removed — not used after BIO update

function StatCard({ label, value, icon, isText = false, isLive = false, numericValue = null }: { label: string; value?: React.ReactNode; icon?: React.ReactNode; isText?: boolean; isLive?: boolean; numericValue?: number | null }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="flex min-w-35 flex-1 items-center gap-3 rounded-xl border border-slate-700/50 bg-slate-900/50 p-3 shadow-md backdrop-blur-md lg:min-w-24 lg:gap-2 lg:p-2"
    >
      <div className="shrink-0">{icon}</div>
      <div>
        <p className={`font-semibold text-slate-100 flex items-center ${isText ? 'text-xs leading-tight' : 'text-lg md:text-xl lg:text-sm tracking-tight'}`}>
          {isLive ? (
            <>
              <AnimatedCounter value={numericValue ?? null} />
              {numericValue !== null && <span className="text-blue-400 ml-0.5">+</span>}
            </>
          ) : (
            value
          )}
        </p>
        <p className="mt-0.5 text-[8px] lg:text-[7px] uppercase tracking-wider font-medium text-slate-400">{label}</p>
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
    <div className="mt-10 lg:mt-4">
      <div className="flex flex-wrap items-stretch gap-3 lg:gap-2">
        {primaryStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
      <div className="mt-6 lg:mt-3 flex flex-wrap items-center gap-6 lg:gap-3 border-t border-slate-800/60 pt-4 lg:pt-2 text-xs text-slate-300">
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
  // typing effect removed — static bio used instead
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [stats, setStats] = useState<LiveStats>(null);

  const heroVideoUrl =
    "https://res.cloudinary.com/dkjyjzl8u/video/upload/v1777717538/SIDDHUISM_Official_2026_Showreel_Final_-_Compressed_sathux.mp4";

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
    // Attempt to autoplay the video muted (browsers allow muted autoplay).
    const node = videoRef.current;
    if (node) {
      node.muted = true;
      void node.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
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
    <section id="top" className="relative overflow-hidden px-4 pt-6 sm:px-6 md:px-8 md:pt-6 lg:px-10">
      <div className="hero-gradient absolute inset-0 -z-20" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.2),transparent_30%),radial-gradient(circle_at_80%_70%,rgba(168,85,247,0.18),transparent_30%)]" />

      <div className="mx-auto flex w-full items-start py-3 sm:py-4 md:py-5 lg:min-h-svh lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className="flex w-full flex-col items-start gap-4 md:gap-5 lg:grid lg:grid-cols-[1.2fr_1.8fr] xl:grid-cols-[1.2fr_1.6fr] lg:gap-4 lg:items-center"
        >
          <div className="order-2 w-full pl-1 pt-6 sm:pl-2 lg:order-2 lg:pl-4 lg:pr-2 xl:pl-6 lg:mt-0">
            <div className="rounded-2xl border border-slate-600/40 bg-slate-900/55 p-8 md:p-10 lg:p-6 shadow-[0_10px_60px_rgba(2,6,23,0.6)] backdrop-blur-2xl">
              <div className="mt-0 max-w-full text-pretty text-sm text-slate-300 sm:text-sm md:text-sm lg:text-sm">
                <div className="mx-auto text-center max-w-2xl">
                  <h2 className="text-xl mt-0 sm:text-2xl md:text-3xl font-extrabold text-slate-100 leading-tight md:whitespace-nowrap inline-block relative">
                    <span className="block text-xs font-medium uppercase tracking-[0.18em] text-slate-300 mb-1 lg:mb-0.5 lg:text-xs">CREATOR BIO</span>
                    <span className="absolute inset-0 -z-10 mx-auto block w-full max-w-3xl rounded-sm" />
                    <span className="relative px-3">The face behind Siddhuism Official</span>
                  </h2>
                  <p className="mt-1 text-sm md:text-base lg:text-sm text-slate-300 md:whitespace-nowrap">Social Media Influencer | Travel &amp; Hospitality | Lifestyle</p>
                </div>

                <div className="mt-4 space-y-2  text-justify text-white text-xs lg:text-sm leading-5 lg:leading-5">
                  <p>Hi, I’m Siddharth Sonetta.</p>
                  <p>Most of my life right now is a mix of long rides, last-minute plans, and reaching places slightly later than I said I would. Somewhere along the way, I started documenting it, and that turned into SIDDHUISM Official.</p>
                  <p>What I make sits between travel, moto, and lifestyle. Not in a curated way, more in a “this is how it actually felt to be there” way: the good parts, the slow parts, the random in-between moments that usually get cut out.</p>
                  <p>Over time, I’ve worked with brands across stays, products, and experiences. I don’t treat them like placements, I figure out how they fit into the story, so it still feels like something you’d want to watch even if you weren’t looking for the brand.</p>
                  <p>I care a lot about how something lands, why people keep watching, what makes them pause, what makes something stick after it’s over. That part matters just as much as the shot itself.</p>
                  <p>That’s the space I operate in, where stories feel real, and the impact outlasts the scroll.</p>
                  <p className="font-semibold">Sharing stories that stay with you.</p>
                </div>
              </div>

              <HeroStats stats={stats} />

              <div className="mt-3 lg:mt-4 flex flex-wrap gap-3">
                <button
                  onClick={onWatchClick}
                  className="rounded-full bg-linear-to-r from-blue-500 via-violet-500 to-fuchsia-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_0_30px_rgba(99,102,241,0.35)] transition hover:scale-[1.02] sm:px-6 lg:px-4 lg:py-2 lg:text-xs"
                >
                  Watch Content
                </button>
                <button
                  onClick={onContactClick}
                  className="rounded-full border border-slate-700/80 bg-slate-950/55 px-5 py-3 text-sm font-semibold text-slate-100 backdrop-blur-xl transition hover:border-blue-300/55 hover:bg-slate-900/90 sm:px-6 lg:px-4 lg:py-2 lg:text-xs"
                >
                  Contact
                </button>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.12 }}
            className="relative order-1 w-full lg:order-1 flex flex-col items-center pt-6 lg:pt-0 lg:justify-self-start"
          >
            <div className="absolute inset-1 rounded-2xl bg-linear-to-br from-blue-500/30 via-transparent to-violet-500/25 blur-3xl" />

              <div className="relative z-10 mb-2 lg:mb-1 flex items-center justify-center gap-2 lg:gap-2">
              <div className="h-2 w-2 lg:h-3 lg:w-3 rounded-full mb-2 bg-red-500 animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.8)]" />
              <h3 className="text-base font-bold uppercase tracking-[0.18em] mb-2 text-slate-100 text-glow md:text-lg lg:text-md">Signature Cut</h3>
            </div>

            <div className="relative aspect-9/16 w-full max-w-md overflow-hidden rounded-2xl  bg-black shadow-[0_0_40px_rgba(99,102,241,0.2)] sm:max-w-116 md:max-w-120 lg:max-w-87 group">
              <video
                ref={videoRef}
                src={heroVideoUrl}
                className="w-full h-full object-contain"
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
