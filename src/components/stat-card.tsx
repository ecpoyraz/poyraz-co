export function StatCard({
  figure,
  caption,
  detail,
}: {
  figure: string;
  caption: string;
  detail?: string;
}) {
  return (
    <div className="rounded-lg bg-card p-8">
      {detail && (
        <p className="mb-6 text-sm leading-relaxed text-muted">{detail}</p>
      )}
      <div className="flex items-end gap-4">
        <span className="font-display text-6xl font-medium leading-none tracking-tight text-foreground md:text-7xl">
          {figure}
        </span>
        <span className="max-w-[10rem] pb-1 text-sm leading-snug text-muted">
          {caption}
        </span>
      </div>
    </div>
  );
}
