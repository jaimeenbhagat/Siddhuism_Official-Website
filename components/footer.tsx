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

export default function Footer() {
  return (
    <footer className="border-t border-slate-700/70 px-6 py-8">
      <div className="mx-auto flex max-w-6xl flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-400">
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
                className="text-slate-400 transition hover:text-slate-100 hover:scale-110"
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
