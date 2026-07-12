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
      className="group flex flex-col overflow-hidden rounded-xl bg-card"
    >
      <div className="overflow-hidden bg-subtle">
        {bookmark.image ? (
          <Image
            src={bookmark.image}
            alt={bookmark.title}
            width={600}
            height={340}
            className="aspect-[16/9] w-full object-cover transition duration-500 group-hover:scale-[1.04]"
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
        <span className="font-display text-[15px] font-medium leading-snug tracking-tight text-foreground transition-colors group-hover:text-accent">
          {bookmark.title}
        </span>
        <div className="flex flex-wrap gap-1.5">
          {bookmark.tags.map((tag) => (
            <span
              key={tag}
              className="label-mono rounded-lg bg-subtle px-2.5 py-1 text-muted"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </a>
  );
}
