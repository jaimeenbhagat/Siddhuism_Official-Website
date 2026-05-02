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

export default function AboutSection() {
  return (
    <section id="about" className="px-4 py-12 sm:px-6 md:px-8 md:py-16 lg:px-10">
      <div className="mx-auto w-full max-w-350 2xl:max-w-400">
        <SectionHeading
          eyebrow="Creator Bio"
          title="The face behind Siddhuism Official"
          description="Social Media Influencer | Travel & Hospitality | Lifestyle"
        />

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="grid gap-6 overflow-hidden rounded-[2rem] border border-slate-700/60 bg-gradient-to-br from-slate-950/80 via-blue-950/25 to-violet-950/25 p-5 shadow-[0_20px_60px_rgba(2,6,23,0.5)] backdrop-blur-2xl sm:p-6 md:gap-8 md:grid-cols-[minmax(240px,280px)_minmax(0,1fr)] md:p-8 lg:p-10"
        >
          <div className="relative mx-auto aspect-square w-full max-w-[14rem] rounded-full p-2 shadow-[0_0_60px_rgba(34,211,238,0.35)] sm:max-w-[15rem] md:max-w-[16rem]">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-teal-300/45 via-amber-400/25 to-amber-500/30 blur-2xl" />
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
            <p className="max-w-3xl text-pretty text-slate-300/92 md:text-lg md:leading-8">
              I create short-form and long-form content that blends cinematic polish with platform-native storytelling. From travel experiences to lifestyle edits and hospitality-focused narratives, every frame is designed to drive watch time and memorable brand impact.
            </p>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {[
                { label: "Content pillars", value: "Travel / Lifestyle / Reels" },
                { label: "Editing style", value: "Sharp, luminous, premium" },
                { label: "Delivery", value: "Fast, mobile-first, polished" },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-slate-700/60 bg-slate-900/65 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{item.label}</p>
                  <p className="mt-2 text-sm font-medium text-slate-100">{item.value}</p>
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
                  className="inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-900/75 px-4 py-2 text-sm text-slate-200 transition hover:border-blue-300/60 hover:text-blue-200"
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
