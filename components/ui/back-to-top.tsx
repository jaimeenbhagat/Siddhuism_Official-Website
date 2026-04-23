"use client";

import { AnimatePresence, motion } from "framer-motion";
import { FiArrowUp } from "react-icons/fi";
import { useEffect, useState } from "react";

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsVisible(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible ? (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.25 }}
          className="fixed right-5 bottom-6 z-40 rounded-full border border-slate-700/70 bg-slate-950/85 p-3 text-slate-100 shadow-[0_0_30px_rgba(99,102,241,0.3)] backdrop-blur-xl transition hover:-translate-y-1 hover:border-blue-300/70"
          aria-label="Back to top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <FiArrowUp size={18} />
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}
