import Image from "next/image";
import type { bookmarks } from "#content";

export function BookmarkCard({
  bookmark,
}: {
  bookmark: (typeof bookmarks)[number];
}) {
  return (
    <a
      href={bookmark.url}
      target="_blank"
      rel="noreferrer"
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card"
    >
      <div className="overflow-hidden border-b border-border bg-subtle">
        {bookmark.image ? (
          <Image
            src={bookmark.image}
            alt={bookmark.title}
            width={600}
            height={340}
            className="aspect-[16/9] w-full object-cover"
          />
        ) : (
          // OG image pulled straight from the source URL, no stored file.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/api/og?url=${encodeURIComponent(bookmark.url)}`}
            alt=""
            loading="lazy"
            className="aspect-[16/9] w-full object-cover"
          />
        )}
      </div>
      <div className="flex flex-col gap-2 p-4">
        <span className="font-display text-[15px] font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-accent">
          {bookmark.title}
        </span>
        <div className="flex flex-wrap gap-1.5">
          {bookmark.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-border bg-subtle px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wider text-muted"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </a>
  );
}
