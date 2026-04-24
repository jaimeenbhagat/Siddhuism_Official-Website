"use client";

import { useEffect, useMemo, useState } from "react";
import SectionHeading from "@/components/ui/section-heading";
import CategoryTabs from "@/components/category-tabs";
import VideoCard from "@/components/video-card";
import type { PortfolioTabKey, PortfolioVideo } from "@/lib/portfolio-db";

function SkeletonCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="overflow-hidden rounded-2xl border border-slate-700/70 bg-slate-900/65">
          <div className="aspect-video animate-pulse bg-slate-800" />
          <div className="space-y-3 p-4">
            <div className="h-4 w-4/5 animate-pulse rounded bg-slate-700" />
            <div className="h-3 w-2/5 animate-pulse rounded bg-slate-700" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function PortfolioSection() {
  const [activeTab, setActiveTab] = useState<PortfolioTabKey>("travel");
  const [items, setItems] = useState<PortfolioVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch("/api/portfolio/videos", { cache: "default" });
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload.error || "Unable to load portfolio videos.");
        }

        const rows = (Array.isArray(payload) ? payload : payload.items || []) as PortfolioVideo[];
        setItems(rows);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load portfolio videos.");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const filtered = useMemo(
    () => items.filter((item) => item.category === activeTab).slice(0, 12),
    [activeTab, items],
  );

  return (
    <section id="portfolio" className="px-6 py-12 md:py-16">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Portfolio"
          title="Brand work, projects, and external content"
          description="Custom portfolio videos powered by Supabase with source-aware playback and smooth interactions."
        />

        <CategoryTabs active={activeTab} onChange={setActiveTab} />

        {error ? <p className="mb-4 text-sm text-rose-300">{error}</p> : null}

        {loading ? (
          <SkeletonCards />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => (
              <VideoCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
