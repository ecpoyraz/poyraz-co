import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Footer } from "@/components/footer";
import { CopyEmailButton } from "@/components/copy-email-button";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { getPublishedPosts } from "@/lib/posts";
import { projects, stack, bookmarks } from "#content";
import { published } from "@/lib/collections";
import { ProjectCard } from "@/components/project-card";
import { ProjectsCarousel } from "@/components/projects-carousel";
import { StackCard } from "@/components/stack-card";
import { ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  description:
    "Explore my work as a marketer with a track record of scaling tech products to maximize user value.",
  alternates: { canonical: "/" },
  openGraph: { url: "/" },
};

export default function Home() {
  const posts = getPublishedPosts();
  const allProjects = published([...projects]);
  const featuredStack = [
    "claude-code",
    "codex",
    "n8n",
    "higgsfield",
    "mixpanel",
    "apollo",
  ]
    .map((slug) => stack.find((t) => t.slug === slug))
    .filter((t): t is (typeof stack)[number] => Boolean(t));
  const featuredBookmarks = published([...bookmarks]).slice(0, 6);

  return (
    <div className="flex flex-col gap-12">
      <section className="reveal flex flex-col gap-5 pt-1">
        <h1 className="font-display text-[2rem] font-bold leading-[1.1] tracking-tight sm:text-[2.25rem]">
          Hi, This is Eyüp Poyraz.
        </h1>
        <p className="max-w-xl text-[15px] leading-relaxed text-muted">
          Explore my work as a marketer with a track record of scaling tech
          products to maximize user value.
        </p>
        <div className="flex items-center gap-2.5">
          <Link
            href="/about"
            className="rounded-md border border-border bg-subtle px-4 py-2 text-sm font-medium text-foreground transition hover:bg-background"
          >
            About
          </Link>
          <CopyEmailButton />
        </div>
      </section>

      <section className="reveal reveal-1 flex flex-col gap-5">
        <h2 className="font-display text-2xl font-semibold tracking-tight">
          Projects
        </h2>
        <ProjectsCarousel>
          {allProjects.map((project, i) => (
            <div
              key={project.slug}
              className="w-[78%] shrink-0 snap-start sm:w-[72%]"
            >
              <ProjectCard project={project} priority={i === 0} overlay />
            </div>
          ))}
        </ProjectsCarousel>
      </section>

      <section className="reveal reveal-2">
        <h2 className="font-display text-2xl font-semibold tracking-tight">
          Notebook
        </h2>
        <p className="mt-1.5 text-sm text-muted">
          Sharing my thoughts and knowledge about product &amp; marketing
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {posts.slice(0, 4).map((post) => (
            <Link
              key={post.slug}
              href={post.permalink}
              className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition hover:border-accent/40"
            >
              {post.cover && (
                <div className="overflow-hidden border-b border-border bg-subtle">
                  <Image
                    src={post.cover}
                    alt=""
                    width={640}
                    height={360}
                    className="aspect-[16/9] w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                  />
                </div>
              )}
              <div className="flex flex-col gap-1.5 p-4">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-accent">
                  {post.category}
                </span>
                <span className="font-display text-[15px] font-semibold leading-snug tracking-tight text-foreground transition group-hover:text-accent">
                  {post.title}
                </span>
                <span className="line-clamp-2 text-sm leading-relaxed text-muted">
                  {post.excerpt}
                </span>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-5 flex justify-center">
          <Link
            href="/notebook"
            className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-subtle"
          >
            Read all
          </Link>
        </div>
        <div className="mt-6 border-t border-border pt-6">
          <NewsletterSignup />
        </div>
      </section>

      <section className="reveal reveal-3 flex flex-col gap-5">
        <h2 className="font-display text-2xl font-semibold tracking-tight">
          Bookmarks
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {featuredBookmarks.map((bookmark) => (
            <a
              key={bookmark.url}
              href={bookmark.url}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-3.5 rounded-xl border border-border bg-card px-3.5 py-3 transition hover:border-accent/40 hover:bg-subtle"
            >
              {bookmark.image ? (
                <Image
                  src={bookmark.image}
                  alt=""
                  width={48}
                  height={48}
                  className="size-12 shrink-0 rounded-lg border border-border object-cover"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`/api/og?url=${encodeURIComponent(bookmark.url)}`}
                  alt=""
                  loading="lazy"
                  className="size-12 shrink-0 rounded-lg border border-border object-cover"
                />
              )}
              <div className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold leading-snug text-foreground transition group-hover:text-accent">
                  {bookmark.title}
                </span>
                <span className="mt-0.5 block text-[11px] font-medium uppercase tracking-wider text-muted">
                  {bookmark.tags.slice(0, 2).join(" · ")}
                </span>
              </div>
              <ArrowUpRight className="size-4 shrink-0 text-muted transition group-hover:text-accent" />
            </a>
          ))}
        </div>
        <div className="flex justify-center pt-1">
          <Link
            href="/bookmarks"
            className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-subtle"
          >
            Load More
          </Link>
        </div>
      </section>

      <section className="reveal reveal-4 flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            Tech Stack
          </h2>
          <p className="text-sm text-muted">
            The tools behind how I build, measure, and grow.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {featuredStack.map((tool) => (
            <StackCard key={tool.slug} tool={tool} />
          ))}
        </div>
        <div className="flex justify-center pt-1">
          <Link
            href="/stack"
            className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-subtle"
          >
            View all
          </Link>
        </div>
      </section>

      <section className="reveal reveal-5">
        <div className="flex flex-col items-start gap-5 rounded-2xl bg-foreground p-8 text-background sm:flex-row sm:items-center sm:justify-between sm:p-10">
          <div className="flex flex-col gap-2">
            <h2 className="font-display text-2xl font-semibold tracking-tight">
              Let&apos;s work together
            </h2>
            <p className="max-w-md text-sm leading-relaxed text-background/70">
              From a free intro call to hands-on growth execution. Let&apos;s
              build momentum.
            </p>
          </div>
          <Link
            href="/services"
            className="shrink-0 rounded-md bg-background px-5 py-2.5 text-sm font-medium text-foreground transition hover:opacity-90"
          >
            View services
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
