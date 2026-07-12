import type { Metadata } from "next";
import { bookmarks } from "#content";
import { published } from "@/lib/collections";
import { BookmarksFilter } from "@/components/bookmarks-filter";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Bookmarks",
  description: "Discover and stay updated through small content bites.",
  alternates: { canonical: "/bookmarks" },
  openGraph: { url: "/bookmarks" },
};

export default function BookmarksPage() {
  const items = published([...bookmarks]);
  return (
    <div className="flex flex-col gap-16 md:gap-20">
      <Reveal as="header" className="pt-6 md:pt-14">
        <p className="label-mono mb-4 text-muted">Reading</p>
        <h1 className="max-w-3xl font-display text-4xl font-semibold leading-[1.02] tracking-[-0.03em] sm:text-5xl md:text-6xl">
          Reads and resources I keep coming back to.
        </h1>
      </Reveal>
      <Reveal>
        <BookmarksFilter items={items} />
      </Reveal>
    </div>
  );
}
