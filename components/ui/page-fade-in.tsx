"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type PageFadeInProps = {
  children: ReactNode;
};

export default function PageFadeIn({ children }: PageFadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
