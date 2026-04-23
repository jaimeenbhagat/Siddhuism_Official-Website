"use client";

import { useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";

const logos = [
  "/clientlogo/Galwan Tour Adventure.jpg",
  "/clientlogo/Hosteller.jpg",
  "/clientlogo/Mantra surfing club.png",
  "/clientlogo/Neeta Gala.jpg",
  "/clientlogo/Orange cookware.jpg",
  "/clientlogo/Pickelhaus.jpg",
  "/clientlogo/Synergy Banquets.jpg",
  "/clientlogo/flipkart play.jpg",
  "/clientlogo/forest club.jpg",
  "/clientlogo/mirinproductions.jpg",
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
        <div key={`${logo}-${index}`} className="flex h-[100px] w-[150px] items-center justify-center md:h-[140px] md:w-[220px]">
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
    <section className="px-6 py-18 md:py-24">
      <div className="mx-auto max-w-7xl">
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
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-black to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-black to-transparent" />

          <div ref={trackRef} className="logo-track animate-scroll flex w-max items-center gap-6 px-4 md:gap-8 md:px-6">
            {logoCards}
          </div>
        </div>
      </div>
    </section>
  );
}
