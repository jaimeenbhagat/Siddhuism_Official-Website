"use client";

import { motion } from "framer-motion";

export default function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.45, delay: 0.65 }}
      className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-slate-950"
      aria-hidden="true"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-700 border-t-blue-400" />
        <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Loading</p>
      </div>
    </motion.div>
  );
}
