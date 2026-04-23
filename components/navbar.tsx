"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/lib/content";
import { AnimatePresence, motion } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";
import { useState } from "react";
import Image from "next/image";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const resolveHref = (href: string) => {
    if (href.startsWith("#") && pathname !== "/") {
      return `/${href}`;
    }

    return href;
  };

  return (
    <header className="fixed inset-x-0 top-3 z-40 mx-auto w-[min(1100px,94vw)]">
      <nav className="rounded-full border border-slate-700/60 bg-slate-950/70 px-5 py-3 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-4">
          <Link href={pathname === "/" ? "#top" : "/"} className="flex items-center">
            <Image
              src="/logo-transparent.png"
              alt="siddhuism_official logo"
              width={160}
              height={72}
              className="h-8 w-auto object-contain"
              priority
            />
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={resolveHref(link.href)}
                className="text-sm text-slate-300 transition hover:text-blue-300"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <button
            className="inline-flex text-slate-100 md:hidden"
            aria-label="Toggle navigation"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>

        <AnimatePresence>
          {open ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden md:hidden"
            >
              <div className="flex flex-col gap-3 pt-4">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={resolveHref(link.href)}
                    className="text-sm text-slate-300"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </nav>
    </header>
  );
}
