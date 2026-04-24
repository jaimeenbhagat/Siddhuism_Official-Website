type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export default function SectionHeading({
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="mx-auto mb-8 max-w-3xl text-center md:mb-10">
      {eyebrow && (
        <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-gray-500">
          {eyebrow}
        </p>
      )}
      <h2 className="text-balance text-3xl font-bold tracking-tight text-slate-100 md:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-pretty text-lg font-medium text-gray-400 md:text-xl">
          {description}
        </p>
      )}
    </div>
  );
}
