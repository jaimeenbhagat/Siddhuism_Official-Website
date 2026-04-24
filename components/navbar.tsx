"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/lib/content";
import { AnimatePresence, motion } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";
import Image from "next/image";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement | null>(null);

  const resolveHref = (href: string) => {
    if (href.startsWith("#") && pathname !== "/") {
      return `/${href}`;
    }

    return href;
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 16);
    };

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (!open) {
        return;
      }

      const target = event.target;
      if (panelRef.current && target instanceof Node && !panelRef.current.contains(target)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 px-6 py-4 md:px-2 transition-colors duration-300 ${
        isScrolled ? "bg-black/25 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link href={pathname === "/" ? "#top" : "/"} className="flex items-center">
          <Image
            src="/Updated_bestlogo.png"
            alt="siddhuism_official logo"
            width={300}
            height={300}
            className="h-20 w-auto object-contain md:h-20"
            priority
          />
        </Link>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full border border-white/10 bg-black/20 p-3 text-slate-50 shadow-[0_12px_30px_rgba(0,0,0,0.18)] backdrop-blur-md transition hover:border-white/20 hover:bg-black/30"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="site-navigation-menu"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            ref={panelRef}
            id="site-navigation-menu"
            initial={{ opacity: 0, x: 18, y: -6 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 18, y: -6 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed right-6 top-20 z-50 w-[min(320px,calc(100vw-3rem))] rounded-2xl border border-white/10 bg-slate-950/85 p-6 shadow-[0_24px_80px_rgba(2,6,23,0.55)] backdrop-blur-xl md:right-10"
          >
            <div className="space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={resolveHref(link.href)}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-3 py-3 text-lg font-medium text-slate-100 transition hover:bg-white/5 hover:text-blue-300"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
