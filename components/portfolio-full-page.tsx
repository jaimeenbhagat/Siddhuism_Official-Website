"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { preconnect } from "react-dom";
import Navbar from "@/components/navbar";
import ScrollProgress from "@/components/ui/scroll-progress";
import BackToTop from "@/components/ui/back-to-top";
import Footer from "@/components/footer";
import {
  PORTFOLIO_DATA,
  getBrandDisplayName,
  getBrandSlug,
  type BrandCategory,
  type PortfolioCategory,
} from "@/lib/portfolio-structure";
import { FiArrowRight, FiVideo } from "react-icons/fi";

function ProjectCard({ brand, categoryName }: { brand: BrandCategory; categoryName: string }) {
  const firstVideo = brand.videos[0];
  const thumbnailUrl = firstVideo 
    ? `https://i.ytimg.com/vi/${firstVideo.id}/${firstVideo.type === 'short' ? 'hqdefault' : 'maxresdefault'}.jpg`
    : '/fallback.jpg'; // We can just use empty background if no videos
  const projectSlug = getBrandSlug(brand.name);
  const displayName = getBrandDisplayName(brand.name);

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className="group"
    >
      <Link
        href={`/portfolio/${projectSlug}`}
        className="block w-full overflow-hidden rounded-2xl border border-slate-700/70 text-left shadow-[0_12px_45px_rgba(2,6,23,0.45)] transition-colors duration-300 hover:border-slate-600"
      >
        <div className="relative aspect-video overflow-hidden">
          {firstVideo && (
            <Image
              src={thumbnailUrl}
              alt={displayName}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1440px) 50vw, 25vw"
              className="h-full w-full object-cover opacity-60 transition duration-700 group-hover:scale-105"
            />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/40 to-transparent" />

          <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-5">
            <div className="flex justify-between items-start">
              <span className="rounded-full border border-slate-600/70 bg-black/50 px-3 py-1 text-xs text-slate-200 backdrop-blur-md">
                {categoryName}
              </span>
              <span className="rounded-full border border-blue-400/30 bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-100 backdrop-blur-md">
                {brand.videos.length} Videos
              </span>
            </div>

            <div className="mt-auto flex items-end justify-between gap-4">
              <h3 className="max-w-[80%] text-base font-bold leading-tight text-slate-100 drop-shadow-md sm:text-lg">
                {displayName}
              </h3>
              <div className="rounded-full bg-slate-800 p-2 text-slate-300 transition-colors group-hover:bg-blue-500 group-hover:text-white">
                <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-0.5" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function CategorySection({ category }: { category: PortfolioCategory }) {

  return (
    <div className="mb-16 md:mb-20">
      <div className="mb-6 flex items-center gap-3 border-b border-slate-800 pb-4">
        <FiVideo className="text-gray-400" size={24} />
        <h3 className="text-lg font-medium text-gray-400 md:text-xl">{category.title}</h3>
      </div>

      <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {category.brands.map((brand, bIdx) => (
          <div key={bIdx}>
            <ProjectCard 
              brand={brand} 
              categoryName={category.title} 
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PortfolioFullPage() {
  preconnect("https://www.youtube.com");

  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main className="relative min-h-screen overflow-hidden">
        {/* Ambient Background */}
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(30,58,138,0.12),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(139,92,246,0.1),transparent_50%)]" />

        <section className="px-4 pt-28 pb-16 sm:px-6 md:px-8 md:pt-36 md:pb-24 lg:px-10">
          <div className="mx-auto w-full max-w-350 2xl:max-w-400">
            <div className="mb-12 md:mb-16">
              <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-gray-500 sm:text-sm">Portfolio</p>
              <h1 className="text-balance text-2xl font-bold tracking-tight text-slate-100 sm:text-3xl md:text-4xl lg:text-5xl">
                Selected Works
              </h1>
              <p className="mt-3 text-pretty text-sm font-medium text-gray-400 md:text-base lg:text-lg">
                A curated selection of commercial projects, technical cinematography, and visual storytelling. Click a project to explore the full campaign.
              </p>
            </div>

            <div className="space-y-6 md:space-y-8">
              {PORTFOLIO_DATA.map((section, sIdx) => (
                <div key={sIdx} className="mb-16">
                  {section.categories.map((category, cIdx) => (
                    <CategorySection key={`${sIdx}-${cIdx}`} category={category} />
                  ))}
                </div>
              ))}
            </div>

            <motion.section
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4 }}
              className="relative mt-24 overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-900/50 p-8 text-center shadow-2xl backdrop-blur-sm md:mt-32 md:p-16"
            >
              <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 to-violet-500/10 opacity-50" />
              <div className="relative z-10">
                <h2 className="text-2xl font-bold text-white sm:text-3xl md:text-4xl lg:text-5xl">Ready to tell your brand&apos;s story?</h2>
                <p className="mt-4 text-sm text-slate-400 md:text-base lg:text-lg">Let&apos;s create something that stands out.</p>
                <Link
                  href="/#contact"
                  className="mt-8 inline-flex items-center justify-center rounded-full bg-slate-100 px-6 py-3 text-sm font-semibold text-slate-900 shadow-xl shadow-slate-100/10 transition-all hover:scale-105 hover:bg-white active:scale-95 sm:px-8 sm:py-4"
                >
                  Work With Me
                </Link>
              </div>
            </motion.section>
          </div>
        </section>
      </main>

      <Footer />
      <BackToTop />
    </>
  );
}
