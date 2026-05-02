import { SOCIAL_LINKS } from "@/lib/content";
import { FaInstagram, FaYoutube, FaLinkedin, FaFacebook, FaThreads, FaEnvelope } from "react-icons/fa6";

const socialIconByLabel = {
  YouTube: FaYoutube,
  Instagram: FaInstagram,
  Threads: FaThreads,
  LinkedIn: FaLinkedin,
  Facebook: FaFacebook,
  Mail: FaEnvelope,
} as const;

const socialHoverClassByLabel = {
  YouTube: "hover:text-[#FF0000]",
  Instagram: "hover:text-[#E1306C]",
  Threads: "hover:text-slate-100",
  LinkedIn: "hover:text-[#0A66C2]",
  Facebook: "hover:text-[#1877F2]",
  Mail: "hover:text-amber-300",
} as const;

export default function Footer() {
  return (
    <footer className="border-t border-slate-700/70 px-4 py-8 sm:px-6 md:px-8 lg:px-10">
      <div className="mx-auto flex w-full max-w-350 flex-col items-center justify-between gap-4 text-sm text-slate-400 md:flex-row 2xl:max-w-400">
        <p>© {new Date().getFullYear()} siddhuism_official</p>
        
        <div className="flex items-center gap-4">
          {SOCIAL_LINKS.map((social) => {
            const Icon = socialIconByLabel[social.label as keyof typeof socialIconByLabel];
            if (!Icon) return null;
            return (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
                className={`text-slate-400 transition hover:scale-110 ${socialHoverClassByLabel[social.label as keyof typeof socialHoverClassByLabel]}`}
              >
                <Icon size={20} />
              </a>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
