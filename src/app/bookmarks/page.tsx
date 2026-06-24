import type { Metadata } from "next";
import { bookmarks } from "#content";
import { published } from "@/lib/collections";
import { BookmarkCard } from "@/components/bookmark-card";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Bookmarks",
  description: "Discover and stay updated through small content bites.",
  alternates: { canonical: "/bookmarks" },
  openGraph: { url: "/bookmarks" },
};

export default function BookmarksPage() {
  const items = published([...bookmarks]);
  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-3">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Bookmarks
        </h1>
        <p className="max-w-2xl text-[15px] leading-relaxed text-muted">
          Discover, and stay updated through small content bites.
        </p>
      </header>
      <div className="grid gap-5 sm:grid-cols-2">
        {items.map((bookmark) => (
          <BookmarkCard key={bookmark.url} bookmark={bookmark} />
        ))}
      </div>
      <Footer />
    </div>
  );
}
