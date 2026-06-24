import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getPublishedPosts } from "@/lib/posts";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Notebook",
  description:
    "A selection of ideas and thoughts to inspire, learn, and create.",
  alternates: { canonical: "/notebook" },
  openGraph: { url: "/notebook" },
};

export default function NotebookPage() {
  const posts = getPublishedPosts();
  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-3">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Notebook
        </h1>
        <p className="max-w-2xl text-[15px] leading-relaxed text-muted">
          A selection of ideas and thoughts to inspire, learn, and create.
        </p>
      </header>
      <div className="grid gap-6 sm:grid-cols-2">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={post.permalink}
            className="group flex flex-col gap-3"
          >
            <div className="overflow-hidden rounded-xl border border-border bg-subtle">
              {post.cover && (
                <Image
                  src={post.cover}
                  alt={post.title}
                  width={800}
                  height={450}
                  className="aspect-[16/9] w-full object-cover"
                />
              )}
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-display text-[15px] font-semibold tracking-tight text-foreground transition group-hover:text-accent">
                {post.title}
              </span>
              <span className="text-xs text-muted">{post.category}</span>
            </div>
          </Link>
        ))}
      </div>
      <div className="border-t border-border pt-8">
        <NewsletterSignup />
      </div>
      <Footer />
    </div>
  );
}
