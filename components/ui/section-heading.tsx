type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

export default function SectionHeading({
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="mx-auto mb-10 max-w-3xl text-center md:mb-14">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-blue-300">
        {eyebrow}
      </p>
      <h2 className="text-balance text-3xl font-semibold tracking-tight text-slate-100 md:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-pretty text-slate-300/85 md:text-lg">{description}</p>
      ) : null}
    </div>
  );
}
