"use client";

import { SOCIAL_LINKS } from "@/lib/content";
import { motion } from "framer-motion";
import Image from "next/image";
import { FaInstagram, FaYoutube, FaLinkedin, FaFacebook, FaThreads, FaEnvelope } from "react-icons/fa6";
import SectionHeading from "@/components/ui/section-heading";

const socialIconByLabel = {
  YouTube: FaYoutube,
  Instagram: FaInstagram,
  Threads: FaThreads,
  LinkedIn: FaLinkedin,
  Facebook: FaFacebook,
  Mail: FaEnvelope,
} as const;

const socialHoverClassByLabel = {
  YouTube: "hover:border-[#FF0000]/50 hover:text-[#FF0000]",
  Instagram: "hover:border-[#E1306C]/50 hover:text-[#E1306C]",
  Threads: "hover:border-slate-200/50 hover:text-slate-100",
  LinkedIn: "hover:border-[#0A66C2]/50 hover:text-[#0A66C2]",
  Facebook: "hover:border-[#1877F2]/50 hover:text-[#1877F2]",
  Mail: "hover:border-amber-300/50 hover:text-amber-300",
} as const;

export default function AboutSection() {
  return (
    <section id="about" className="px-4 py-12 sm:px-6 md:px-8 md:py-16 lg:px-10">
      <div className="mx-auto w-full max-w-350 2xl:max-w-400">
        <SectionHeading
          eyebrow="System & Workflow"
          title="Execution"
          description="From concept to distribution, built for social impact"
        />

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="grid gap-6 overflow-hidden rounded-4xl border border-slate-700/60 bg-linear-to-br from-slate-950/80 via-blue-950/25 to-violet-950/25 p-5 shadow-[0_20px_60px_rgba(2,6,23,0.5)] backdrop-blur-2xl sm:p-6 md:gap-8 md:grid-cols-[minmax(240px,280px)_minmax(0,1fr)] md:p-8 lg:p-10 md:items-center"
        >
          <div className="relative mx-auto aspect-square w-full max-w-56 rounded-full p-2 shadow-[0_0_60px_rgba(34,211,238,0.35)] sm:max-w-60 md:max-w-64">
            <div className="absolute inset-0 rounded-full bg-linear-to-br from-teal-300/45 via-amber-400/25 to-amber-500/30 blur-2xl" />
            <div className="relative h-full w-full overflow-hidden rounded-full border border-blue-300/30">
              <Image
                src="/profile.jpg"
                alt="siddhuism_official profile"
                fill
                sizes="224px"
                className="object-cover"
                priority={true}
              />
            </div>
          </div>

          <div className="grid gap-6">
            <p className="max-w-7xl text-pretty text-white md:text-lg md:leading-8">
              Everything I create sits across a simple system, idea to execution to distribution.
              Clear workflow, minimal back-and-forth, and content is ready to use across platforms.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { 
                  label: "CONTENT", 
                  lines: ["Travel experiences / Brand collaborations / Multi-format content / Creator partnerships"] 
                },
                { 
                  label: "CREATION", 
                  lines: ["On-ground travel content creation with planned storytelling", "Cinematic, fast-paced video editing for social media"] 
                },
                { 
                  label: "DISTRIBUTION", 
                  lines: ["Mobile-first content for Instagram Reels, YouTube, and digital platforms", "Instagram Reels / YouTube videos / Brand campaign content"] 
                },
                { 
                  label: "STACK", 
                  lines: ["Sony FX30 / Sony A7 IV / iPhone / DJI Air 3S drone / Insta360 Ace Pro 2 & X4", "Adobe Premiere Pro / After Effects / CapCut"] 
                },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-slate-700/60 bg-slate-900/65 p-4 transition duration-300 hover:border-slate-500/60 hover:bg-slate-800/80">
                  <p className="text-xs uppercase tracking-[0.2em] text-white font-bold mb-2">{item.label}</p>
                  <div className="space-y-1.5 mt-2">
                    {item.lines.map((line, i) => (
                      <p key={i} className="text-[13px] md:text-sm font-medium text-white leading-relaxed">{line}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className={`inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-900/75 px-4 py-2 text-sm text-white transition ${socialHoverClassByLabel[social.label as keyof typeof socialHoverClassByLabel]}`}
                >
                  {(() => {
                    const Icon = socialIconByLabel[social.label as keyof typeof socialIconByLabel];
                    return Icon ? <Icon size={15} /> : null;
                  })()}
                  {social.label}
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
