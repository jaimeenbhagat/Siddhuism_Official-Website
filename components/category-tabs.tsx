"use client";

import { motion } from "framer-motion";
import { PORTFOLIO_TABS, type PortfolioTabKey } from "@/lib/portfolio-db";

type CategoryTabsProps = {
  active: PortfolioTabKey;
  onChange: (tab: PortfolioTabKey) => void;
};

export default function CategoryTabs({ active, onChange }: CategoryTabsProps) {
  return (
    <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
      {PORTFOLIO_TABS.map((tab, index) => {
        const selected = active === tab.key;
        return (
          <motion.button
            key={tab.key}
            type="button"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.25, delay: index * 0.05 }}
            onClick={() => onChange(tab.key)}
            className={`rounded-2xl border px-4 py-3 text-sm font-medium transition ${
              selected
                ? "border-blue-300/60 bg-gradient-to-r from-blue-500/35 to-violet-500/35 text-white"
                : "border-slate-700/70 bg-slate-950/70 text-slate-300 hover:border-blue-300/40"
            }`}
          >
            {tab.label}
          </motion.button>
        );
      })}
    </div>
  );
}
