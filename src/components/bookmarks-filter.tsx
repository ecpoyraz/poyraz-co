"use client";

import { useState } from "react";
import type { bookmarks } from "#content";
import { BookmarkCard } from "@/components/bookmark-card";

type Bookmark = (typeof bookmarks)[number];

const CATEGORIES = ["All", "AI", "Tools", "Growth", "Product"] as const;

export function BookmarksFilter({ items }: { items: Bookmark[] }) {
  const [active, setActive] = useState<(typeof CATEGORIES)[number]>("All");
  const filtered =
    active === "All" ? items : items.filter((b) => b.category === active);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((category) => {
          const isActive = category === active;
          return (
            <button
              key={category}
              type="button"
              onClick={() => setActive(category)}
              aria-pressed={isActive}
              className={
                isActive
                  ? "rounded-full bg-foreground px-3.5 py-1.5 text-sm font-medium text-background transition"
                  : "rounded-full bg-subtle px-3.5 py-1.5 text-sm text-muted transition hover:text-foreground"
              }
            >
              {category}
            </button>
          );
        })}
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        {filtered.map((bookmark) => (
          <BookmarkCard key={bookmark.url} bookmark={bookmark} />
        ))}
      </div>
    </div>
  );
}
