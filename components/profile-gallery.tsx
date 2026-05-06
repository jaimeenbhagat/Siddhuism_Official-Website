"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import SectionHeading from "@/components/ui/section-heading";

const MOMENTS = [
  "/profile/1.webp",
  "/profile/14.webp",
  "/profile/2.webp",
  "/profile/3.webp",
  "/profile/4.webp",
  "/profile/5.webp",
  "/profile/6.webp",
  "/profile/7.webp",
  "/profile/8.webp",
  "/profile/9.webp",
  "/profile/10.webp",
  "/profile/11.webp",
  "/profile/12.webp",
  "/profile/13.webp",
  "/profile/16.webp",
  "/profile/15.webp",

];

export default function ProfileGallery() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Extend array heavily to ensure manual scrolling never hits the end
  const EXTENDED_MOMENTS = [...MOMENTS, ...MOMENTS, ...MOMENTS, ...MOMENTS, ...MOMENTS, ...MOMENTS, ...MOMENTS, ...MOMENTS];

  // Initialize scroll position to allow infinite left scrolling
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const item = el.firstElementChild as HTMLElement;
    if (!item) return;
    const gap = 16;
    const scrollStep = item.offsetWidth + gap;
    const maxScroll = scrollStep * MOMENTS.length;
    
    // Start at the 3rd set so we can safely scroll left
    el.scrollLeft = maxScroll * 2;
    // Initial center detection
    handleScrollUpdate();
  }, []);

  const handleScrollUpdate = () => {
    const el = scrollRef.current;
    if (!el) return;

    const containerRect = el.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;

    let closestChild: HTMLElement | null = null;
    let minDistance = Infinity;

    Array.from(el.children).forEach((child) => {
      const childEle = child as HTMLElement;
      const rect = childEle.getBoundingClientRect();
      const childCenter = rect.left + rect.width / 2;
      const distance = Math.abs(containerCenter - childCenter);
      
      if (distance < minDistance) {
        minDistance = distance;
        closestChild = childEle;
      }
    });

    Array.from(el.children).forEach((child) => {
      const target = child as HTMLElement;
      if (target === closestChild) {
        target.style.transform = "scale(1.05)";
        target.style.zIndex = "10";
        target.style.boxShadow = "0 0 40px rgba(255,255,255,0.1)";
      } else {
        target.style.transform = "scale(0.95)";
        target.style.zIndex = "0";
        target.style.boxShadow = "none";
      }
    });
  };

  // Auto scroll logic (1 second)
  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      const el = scrollRef.current;
      if (!el) return;

      const item = el.firstElementChild as HTMLElement;
      if (!item) return;

      const gap = 16;
      const scrollStep = item.offsetWidth + gap;
      const maxScroll = scrollStep * MOMENTS.length;

      // Wrap around right boundary seamlessly
      if (el.scrollLeft >= maxScroll * 5) {
        el.style.scrollBehavior = 'auto';
        el.scrollLeft -= maxScroll * 2;
      }
      
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.style.scrollBehavior = 'smooth';
          el.scrollLeft += scrollStep;
        });
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [isHovered]);



  const handleManualScroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;

    const item = el.firstElementChild as HTMLElement;
    const gap = 16;
    const scrollStep = item.offsetWidth + gap;
    const maxScroll = scrollStep * MOMENTS.length;

    // Wrap boundaries for manual scroll
    if (direction === "left" && el.scrollLeft <= maxScroll) {
       el.style.scrollBehavior = 'auto';
       el.scrollLeft += maxScroll * 2;
    } else if (direction === "right" && el.scrollLeft >= maxScroll * 5) {
       el.style.scrollBehavior = 'auto';
       el.scrollLeft -= maxScroll * 2;
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.scrollBehavior = 'smooth';
        el.scrollLeft += direction === "right" ? scrollStep : -scrollStep;
      });
    });
  };

  return (
    <section id="profile" className="px-4 py-12 sm:px-6 md:px-8 md:py-16 lg:px-10">
      <div className="mx-auto w-full max-w-[1400px] 2xl:max-w-[1600px]">
        <SectionHeading
          eyebrow="Profile"
          title="Personal frames from the creator journey"
          description="A curated gallery of moments that adds personality and story depth to the portfolio."
        />

        <div 
          className="relative mt-8 w-full overflow-hidden rounded-2xl"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={() => setIsHovered(true)}
          onTouchEnd={() => setIsHovered(false)}
        >
          {/* Left Arrow */}
          <button 
            onClick={() => handleManualScroll("left")}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 rounded-full bg-black/60 text-white backdrop-blur-md border border-white/10 hover:bg-black/90 hover:scale-110 transition flex shadow-lg"
            aria-label="Scroll left"
          >
            <FiChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>

          {/* Right Arrow */}
          <button 
            onClick={() => handleManualScroll("right")}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 rounded-full bg-black/60 text-white backdrop-blur-md border border-white/10 hover:bg-black/90 hover:scale-110 transition flex shadow-lg"
            aria-label="Scroll right"
          >
            <FiChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>

          {/* Left Edge Fade */}
          <div className="pointer-events-none absolute left-0 top-0 z-20 h-full w-12 bg-linear-to-r from-slate-950 to-transparent sm:w-24" />
          
          {/* Right Edge Fade */}
          <div className="pointer-events-none absolute right-0 top-0 z-20 h-full w-12 bg-linear-to-l from-slate-950 to-transparent sm:w-24" />

          {/* Carousel Track */}
          <div
            ref={scrollRef}
            onScroll={handleScrollUpdate}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 pt-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {EXTENDED_MOMENTS.map((src, index) => (
              <button
                key={`${src}-${index}`}
                type="button"
                onClick={() => setActive(src)}
                className="group relative shrink-0 snap-center overflow-hidden rounded-2xl border border-slate-700/70 bg-slate-950/70 w-[75vw] sm:w-[45vw] md:w-[35vw] lg:w-[28vw] 2xl:w-[22vw] transition-all duration-500"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt="Creator moment"
                  loading="lazy"
                  className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {active ? (
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 grid place-items-center bg-black/85 p-4 sm:p-5"
            onClick={() => setActive(null)}
          >
            <motion.img
              src={active}
              alt="Expanded creator moment"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-h-[88vh] w-auto max-w-full rounded-2xl border border-slate-700"
            />
          </motion.button>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
