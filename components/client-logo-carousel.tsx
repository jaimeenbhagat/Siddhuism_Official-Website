"use client";

import { useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";

const logos = [
  "/clientlogos/Galwan Tour Adventure.jpg",
  "/clientlogos/the-hosteller-.webp",
  "/clientlogos/Mantra surfing club.png",
  "/clientlogos/rvoice.png",
  "/clientlogos/orange.png",
  "/clientlogos/pickelhaus.png",
  "/clientlogos/Synergy Banquets.jpg",
  "/clientlogos/flipkart play.jpg",
  "/clientlogos/forest club.jpg",
  "/clientlogos/mirinproductions.jpg",
];

const marqueeLogos = [...logos, ...logos];

export default function ClientLogoCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const touchTimerRef = useRef<number | null>(null);

  const pauseAnimation = () => {
    if (trackRef.current) {
      trackRef.current.style.animationPlayState = "paused";
    }
  };

  const resumeAnimation = () => {
    if (trackRef.current) {
      trackRef.current.style.animationPlayState = "running";
    }
  };

  const handleTouchStart = () => {
    pauseAnimation();

    if (touchTimerRef.current) {
      window.clearTimeout(touchTimerRef.current);
    }

    touchTimerRef.current = window.setTimeout(() => {
      resumeAnimation();
    }, 2000);
  };

  useEffect(() => {
    return () => {
      if (touchTimerRef.current) {
        window.clearTimeout(touchTimerRef.current);
      }
    };
  }, []);

  const logoCards = useMemo(
    () =>
      marqueeLogos.map((logo, index) => (
        <div key={`${logo}-${index}`} className="flex h-21 w-31 items-center justify-center rounded-lg border border-white/10 bg-slate-950/50 p-4 sm:h-24 sm:w-36 md:h-30 md:w-45 lg:h-35 lg:w-55">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={encodeURI(logo)}
            alt="Client collaboration logo"
            loading="lazy"
            className="max-h-full max-w-full object-contain opacity-70 transition duration-300 hover:opacity-100"
          />
        </div>
      )),
    [],
  );

  return (
    <section className="px-4 py-12 sm:px-6 md:px-8 md:py-16 lg:px-10">
      <div className="mx-auto w-full max-w-350 2xl:max-w-400">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <p className="text-xs uppercase tracking-[0.24em] text-blue-300">Featured Collaborations</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-100 md:text-4xl">Featured Collaborations</h2>
          <p className="mt-3 text-sm text-slate-400 md:text-base">Collaborations across travel, lifestyle &amp; content</p>
        </motion.div>

        <div
          className="logo-marquee relative mt-10 overflow-hidden bg-transparent py-6 md:py-8"
          onMouseEnter={pauseAnimation}
          onMouseLeave={resumeAnimation}
          onTouchStart={handleTouchStart}
        >
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-linear-to-r from-black to-transparent sm:w-28 md:w-32" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-linear-to-l from-black to-transparent sm:w-28 md:w-32" />

          <div ref={trackRef} className="logo-track animate-scroll flex w-max items-center gap-4 px-2 sm:gap-6 sm:px-4 md:gap-8 md:px-6">
            {logoCards}
          </div>
        </div>
      </div>
    </section>
  );
}
