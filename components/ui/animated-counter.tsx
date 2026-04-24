"use client";

import { useEffect, useState } from "react";
import { animate, useMotionValue, useTransform } from "framer-motion";

export function AnimatedCounter({ value, duration = 1.5 }: { value: number | null; duration?: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [displayValue, setDisplayValue] = useState("--");

  useEffect(() => {
    if (value === null) {
      setDisplayValue("--");
      return;
    }

    const controls = animate(count, value, { duration, ease: "easeOut" });

    const unsubscribe = rounded.on("change", (latest) => {
      setDisplayValue(new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(latest));
    });

    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [value, duration, count, rounded]);

  return <>{displayValue}</>;
}
