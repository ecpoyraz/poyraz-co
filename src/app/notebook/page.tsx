import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getPublishedPosts } from "@/lib/posts";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { TagPill, toneFor } from "@/components/tag-pill";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Notebook",
  description:
    "A selection of ideas and thoughts to inspire, learn, and create.",
  alternates: { canonical: "/notebook" },
  openGraph: { url: "/notebook" },
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export default function NotebookPage() {
  const posts = getPublishedPosts();
  return (
    <div className="flex flex-col gap-16 md:gap-20">
      <Reveal as="header" className="pt-6 md:pt-14">
        <p className="label-mono mb-4 text-muted">Writing</p>
        <h1 className="max-w-3xl font-display text-4xl font-normal leading-[1.02] tracking-[-0.03em] sm:text-5xl md:text-6xl">
          Ideas and thoughts to inspire, learn, and create.
        </h1>
      </Reveal>

      <Reveal as="section" className="grid gap-x-5 gap-y-12 sm:grid-cols-2">
        {posts.map((post, i) => (
          <Link key={post.slug} href={post.permalink} className="group block">
            <div className="overflow-hidden rounded-lg bg-subtle">
              {post.cover && (
                <Image
                  src={post.cover}
                  alt={post.title}
                  width={1600}
                  height={1100}
                  quality={90}
                  priority={i < 2}
                  sizes="(max-width: 640px) 92vw, 620px"
                  className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                />
              )}
            </div>
            <div className="mt-4 flex items-center gap-3">
              <TagPill tone={toneFor(post.category)}>{post.category}</TagPill>
              <span className="label-mono text-muted">
                {formatDate(post.date)}
              </span>
            </div>
            <h2 className="mt-2 font-display text-xl font-semibold leading-snug tracking-tight text-foreground sm:text-2xl">
              {post.title}
            </h2>
          </Link>
        ))}
      </Reveal>

      <Reveal as="section" className="rounded-lg bg-card p-8 md:p-10">
        <div className="mx-auto max-w-2xl">
          <NewsletterSignup />
        </div>
      </Reveal>
    </div>
  );
}
