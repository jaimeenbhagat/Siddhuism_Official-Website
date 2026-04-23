"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import SectionHeading from "@/components/ui/section-heading";

const MOMENTS = [
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
];

export default function ProfileGallery() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <section id="moments" className="px-6 py-20 md:py-26">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Profile / Moments"
          title="Personal frames from the creator journey"
          description="A curated gallery of moments that adds personality and story depth to the portfolio."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MOMENTS.map((src, index) => (
            <motion.button
              key={src}
              type="button"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.28, delay: index * 0.04 }}
              onClick={() => setActive(src)}
              className="group overflow-hidden rounded-2xl border border-slate-700/70 bg-slate-950/70"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt="Creator moment"
                loading="lazy"
                className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-105"
              />
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {active ? (
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 grid place-items-center bg-black/85 p-5"
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
