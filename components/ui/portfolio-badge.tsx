type PortfolioBadgeProps = {
  children: React.ReactNode;
  className?: string;
};

export default function PortfolioBadge({ children, className = "" }: PortfolioBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-white/10 bg-linear-to-r from-white/10 via-white/6 to-white/5 px-3 py-1 text-[0.7rem] font-medium uppercase tracking-[0.22em] text-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_8px_24px_rgba(2,6,23,0.16)] backdrop-blur-md ${className}`}
    >
      {children}
    </span>
  );
}