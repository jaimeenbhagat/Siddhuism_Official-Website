"use client";

import { AnimatePresence, motion } from "framer-motion";

type ToastProps = {
  type: "success" | "error" | null;
  message: string;
};

export default function Toast({ type, message }: ToastProps) {
  const tone =
    type === "success"
      ? "border-emerald-300/40 bg-emerald-950/70 text-emerald-100"
      : "border-rose-300/40 bg-rose-950/70 text-rose-100";

  return (
    <AnimatePresence>
      {type ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.2 }}
          className={`fixed right-5 bottom-24 z-50 max-w-xs rounded-xl border px-4 py-3 text-sm shadow-lg backdrop-blur-xl ${tone}`}
        >
          {message}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
