"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/lib/content";
import Image from "next/image";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

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

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 px-4 py-3 sm:px-6 md:px-8 transition-colors duration-300 ${
        isScrolled ? "bg-black/25 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between gap-3 2xl:max-w-[1600px]">
        <nav
          aria-label="Primary"
          className="flex min-w-0 flex-wrap items-center justify-center gap-1 rounded-full border border-white/10 bg-slate-950/70 px-2 py-2 shadow-[0_12px_30px_rgba(0,0,0,0.18)] backdrop-blur-md sm:gap-2 sm:px-3"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={resolveHref(link.href)}
              className="rounded-full px-3 py-2 text-xs font-medium text-slate-100 transition hover:bg-white/10 hover:text-blue-300 sm:px-4 sm:text-sm"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link href={pathname === "/" ? "#top" : "/"} className="flex items-center">
          <Image
            src="/IMG_7397-removebg-preview.png"
            alt="siddhuism_official logo"
            width={300}
            height={300}
            className="h-14 w-auto object-contain sm:h-16 md:h-20"
            priority
          />
        </Link>
      </div>
    </header>
  );
}
