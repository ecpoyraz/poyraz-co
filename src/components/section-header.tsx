export function SectionHeader({
  kicker,
  title,
  className,
}: {
  kicker?: string;
  title: string;
  className?: string;
}) {
  return (
    <div className={className}>
      {kicker && <p className="label-mono mb-3 text-brand">{kicker}</p>}
      <h2 className="font-display text-3xl font-normal tracking-tight text-foreground md:text-4xl">
        {title}
      </h2>
    </div>
  );
}
