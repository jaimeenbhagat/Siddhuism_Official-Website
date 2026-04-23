export default function Footer() {
  return (
    <footer className="border-t border-slate-700/70 px-6 py-8">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 text-sm text-slate-400">
        <p>© {new Date().getFullYear()} siddhuism_official</p>
        <p>Built with Next.js, Tailwind CSS, and Framer Motion</p>
      </div>
    </footer>
  );
}
