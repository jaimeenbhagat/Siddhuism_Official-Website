"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { preconnect } from "react-dom";
import Navbar from "@/components/navbar";
import ScrollProgress from "@/components/ui/scroll-progress";
import BackToTop from "@/components/ui/back-to-top";
import Footer from "@/components/footer";
import { PORTFOLIO_DATA, type VideoLink, type BrandCategory, type PortfolioCategory } from "@/lib/portfolio-structure";
import { FiPlayCircle, FiVideo, FiX, FiChevronDown, FiMaximize2 } from "react-icons/fi";

function usePlayableState() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  return {
    containerRef,
    shouldPlay: hovered,
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
  };
}

function StaticVideoCard({ video, onClick }: { video: VideoLink; onClick: () => void }) {
  const { containerRef, shouldPlay, onMouseEnter, onMouseLeave } = usePlayableState();
  const isShort = video.type === "short";

  return (
    <motion.div
      ref={containerRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`group overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900/80 relative cursor-pointer shadow-lg ${isShort ? 'aspect-[9/16]' : 'aspect-video'}`}
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-slate-900">
        <Image
          src={`https://i.ytimg.com/vi/${video.id}/${isShort ? 'hqdefault' : 'maxresdefault'}.jpg`}
          alt="Video thumbnail"
          fill
          sizes="(max-width: 1280px) 50vw, 30vw"
          className={`object-cover transition duration-700 ${shouldPlay ? "opacity-0" : "opacity-100 group-hover:scale-105"}`}
        />
        <div className={`absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent transition-opacity duration-300 ${shouldPlay ? "opacity-0" : "opacity-100"}`} />

        {shouldPlay && (
          <iframe
            className="absolute inset-0 h-full w-full pointer-events-none"
            src={`https://www.youtube.com/embed/${video.id}?autoplay=1&mute=1&controls=0&playsinline=1&loop=1&playlist=${video.id}`}
            title="YouTube video player"
            loading="lazy"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        )}

        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${shouldPlay ? "opacity-0 scale-90" : "opacity-100 scale-100"}`}>
          <div className="rounded-full bg-black/40 p-3 backdrop-blur-md transition-transform duration-300 group-hover:scale-110">
            <FiPlayCircle className="text-white/90" size={32} />
          </div>
        </div>
        
        {/* Maximize Icon */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="rounded-full bg-black/50 p-2 backdrop-blur-sm">
            <FiMaximize2 className="text-white/80" size={14} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ProjectVideosGrid({ brand, onClose, onVideoClick }: { brand: BrandCategory; onClose: () => void; onVideoClick: (video: VideoLink) => void }) {
  if (brand.videos.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8 text-center text-slate-400">
        <p>Production in progress. Coming soon!</p>
        <button onClick={onClose} className="mt-4 text-sm text-blue-400 hover:text-blue-300">Close</button>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-700/60 bg-slate-900/60 p-6 md:p-10 shadow-2xl backdrop-blur-sm relative">
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors z-10"
      >
        <FiX size={20} />
      </button>

      <div className="mb-8 max-w-2xl pr-12">
        <h4 className="text-2xl font-bold text-slate-100">{brand.name}</h4>
        {brand.description && (
          <p className="mt-2 text-slate-400 text-sm leading-relaxed">{brand.description}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {brand.videos.map((video, vIdx) => (
          <StaticVideoCard key={vIdx} video={video} onClick={() => onVideoClick(video)} />
        ))}
      </div>
    </div>
  );
}

function ProjectCard({ brand, categoryName, isActive, onClick }: { brand: BrandCategory; categoryName: string; isActive: boolean; onClick: () => void }) {
  const firstVideo = brand.videos[0];
  const thumbnailUrl = firstVideo 
    ? `https://i.ytimg.com/vi/${firstVideo.id}/${firstVideo.type === 'short' ? 'hqdefault' : 'maxresdefault'}.jpg`
    : '/fallback.jpg'; // We can just use empty background if no videos

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className={`group w-full block overflow-hidden rounded-2xl border text-left shadow-[0_12px_45px_rgba(2,6,23,0.45)] transition-colors duration-300 ${isActive ? 'border-blue-500/50 bg-slate-900 ring-2 ring-blue-500/20' : 'border-slate-700/70 bg-slate-950/80 hover:border-slate-600'}`}
    >
      <div className="relative aspect-video overflow-hidden bg-slate-900">
        {firstVideo && (
          <Image
            src={thumbnailUrl}
            alt={brand.name}
            fill
            sizes="(max-width: 1024px) 100vw, 33vw"
            className={`h-full w-full object-cover transition duration-700 ${isActive ? 'scale-105 opacity-80' : 'group-hover:scale-105 opacity-60'}`}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        
        <div className="absolute inset-0 flex flex-col justify-between p-5">
          <div className="flex justify-between items-start">
            <span className="rounded-full border border-slate-600/70 bg-black/50 px-3 py-1 text-xs text-slate-200 backdrop-blur-md">
              {categoryName}
            </span>
            <span className="rounded-full border border-blue-400/30 bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-100 backdrop-blur-md">
              {brand.videos.length} Videos
            </span>
          </div>

          <div className="mt-auto flex items-end justify-between">
            <h3 className="text-lg font-bold text-slate-100 leading-tight max-w-[80%] drop-shadow-md">
              {brand.name.split('|')[0].trim()}
            </h3>
            <div className={`p-2 rounded-full transition-colors ${isActive ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-300 group-hover:bg-slate-700'}`}>
              <FiChevronDown className={`transition-transform duration-300 ${isActive ? 'rotate-180' : ''}`} />
            </div>
          </div>
        </div>
      </div>
    </motion.button>
  );
}

function CategorySection({ category, onVideoClick }: { category: PortfolioCategory; onVideoClick: (v: VideoLink) => void }) {
  const [activeBrandName, setActiveBrandName] = useState<string | null>(null);

  const handleProjectClick = (brandName: string) => {
    setActiveBrandName(activeBrandName === brandName ? null : brandName);
    
    // Smooth scroll into view when expanding
    if (activeBrandName !== brandName) {
      setTimeout(() => {
        const element = document.getElementById(`project-${brandName.replace(/\s+/g, '-')}`);
        if (element) {
          const yOffset = -100; // Account for navbar
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const activeBrand = category.brands.find(b => b.name === activeBrandName);

  return (
    <div className="mb-20">
      <div className="flex items-center gap-3 mb-8 border-b border-slate-800 pb-4">
        <FiVideo className="text-blue-400" size={24} />
        <h3 className="text-3xl font-bold text-slate-100">{category.title}</h3>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        {category.brands.map((brand, bIdx) => (
          <div id={`project-${brand.name.replace(/\s+/g, '-')}`} key={bIdx}>
            <ProjectCard 
              brand={brand} 
              categoryName={category.title} 
              isActive={activeBrandName === brand.name}
              onClick={() => handleProjectClick(brand.name)}
            />
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeBrand && (
          <motion.div
            key={activeBrand.name}
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-8">
              <ProjectVideosGrid brand={activeBrand} onClose={() => setActiveBrandName(null)} onVideoClick={onVideoClick} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function VideoModal({ video, onClose }: { video: VideoLink; onClose: () => void }) {
  const isShort = video.type === "short";
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-sm p-4 md:p-10" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full overflow-hidden rounded-2xl bg-black border border-slate-800 shadow-2xl ${isShort ? 'max-w-md aspect-[9/16]' : 'max-w-5xl aspect-video'}`}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-white hover:text-black transition-colors"
        >
          <FiX size={24} />
        </button>
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
          title="YouTube video player"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      </motion.div>
    </div>
  );
}

export default function PortfolioFullPage() {
  preconnect("https://www.youtube.com");
  
  const [activeVideo, setActiveVideo] = useState<VideoLink | null>(null);

  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main className="relative min-h-screen bg-slate-950 overflow-hidden">
        {/* Ambient Background */}
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(30,58,138,0.12),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(139,92,246,0.1),transparent_50%)]" />

        <section className="px-6 pt-32 pb-16 md:pt-40 md:pb-24">
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 md:mb-24">
              <p className="text-xs uppercase tracking-[0.26em] text-blue-400 font-semibold mb-3">Portfolio</p>
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
                Selected Works
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-slate-400 md:text-xl">
                A curated selection of commercial projects, technical cinematography, and visual storytelling. Click a project to explore the full campaign.
              </p>
            </div>

            <div className="space-y-12">
              {PORTFOLIO_DATA.map((section, sIdx) => (
                <div key={sIdx} className="mb-16">
                  {section.categories.map((category, cIdx) => (
                    <CategorySection key={`${sIdx}-${cIdx}`} category={category} onVideoClick={setActiveVideo} />
                  ))}
                </div>
              ))}
            </div>

            <motion.section
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4 }}
              className="mt-32 rounded-3xl border border-slate-800/80 bg-slate-900/50 p-10 text-center shadow-2xl backdrop-blur-sm md:p-16 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-violet-500/10 opacity-50" />
              <div className="relative z-10">
                <h2 className="text-3xl font-bold text-white md:text-5xl">Ready to tell your brand&apos;s story?</h2>
                <p className="mt-4 text-slate-400 text-lg">Let&apos;s create something that stands out.</p>
                <Link
                  href="/#contact"
                  className="mt-8 inline-flex items-center justify-center rounded-full bg-slate-100 px-8 py-4 text-sm font-semibold text-slate-900 transition-all hover:bg-white hover:scale-105 active:scale-95 shadow-xl shadow-slate-100/10"
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
      
      <AnimatePresence>
        {activeVideo && (
          <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
