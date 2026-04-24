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
      className={`fixed inset-x-0 top-0 z-40 px-6 py-4 md:px-2 transition-colors duration-300 ${
        isScrolled ? "bg-black/25 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <nav
          aria-label="Primary"
          className="flex flex-wrap items-center gap-2 rounded-full border border-white/10 bg-slate-950/70 px-3 py-2 shadow-[0_12px_30px_rgba(0,0,0,0.18)] backdrop-blur-md"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={resolveHref(link.href)}
              className="rounded-full px-4 py-2 text-sm font-medium text-slate-100 transition hover:bg-white/10 hover:text-blue-300"
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
            className="h-20 w-auto object-contain md:h-20"
            priority
          />
        </Link>
      </div>
    </header>
  );
}
