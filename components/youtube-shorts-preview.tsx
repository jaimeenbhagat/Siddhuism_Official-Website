"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/section-heading";

const videos = [
  "https://www.youtube.com/shorts/Q4v0kKO-xbw",
  "https://www.youtube.com/shorts/8vPKC2fqlw0",
  "https://www.youtube.com/shorts/bw_LxeHSZSk",
  "https://www.youtube.com/shorts/iQIvy4MT9iU",
  "https://www.youtube.com/shorts/jhcjDGu0vQA"
];

function extractVideoId(url: string): string {
  const match = url.match(/\/shorts\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : "";
}

function ShortsCard({ videoUrl }: { videoUrl: string }) {
  const videoId = extractVideoId(videoUrl);

  return (
    <motion.a
      href={videoUrl}
      target="_blank"
      rel="noreferrer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.28 }}
      className="group shrink-0 w-[200px] md:w-[220px] overflow-hidden rounded-2xl border border-slate-800/40 bg-slate-950/90 shadow-[0_18px_45px_rgba(2,6,23,0.45)] hover:scale-105 transition-transform duration-300"
    >
      <div className="relative aspect-[9/16] overflow-hidden">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube Short"
          className="h-full w-full"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </motion.a>
  );
}

export default function YouTubeShortsPreview() {
  return (
    <section id="portfolio-preview" className="px-6 py-20 md:py-26">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Portfolio"
          title="Featured Content"
          description="Latest YouTube Shorts"
        />

        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
          {videos.map((videoUrl, index) => (
            <div key={index} className="snap-start">
              <ShortsCard videoUrl={videoUrl} />
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
            className="rounded-full border border-blue-300/60 bg-gradient-to-r from-blue-500/35 to-violet-500/35 px-6 py-3 text-sm font-semibold text-white hover:scale-[1.02] transition-transform"
          >
            Show More
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
