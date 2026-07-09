import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Footer } from "@/components/footer";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { getPublishedPosts } from "@/lib/posts";
import { projects, stack, bookmarks } from "#content";
import { published } from "@/lib/collections";
import { ProjectCard } from "@/components/project-card";
import { ProjectsRail } from "@/components/projects-rail";
import { GrowthShowcase } from "@/components/growth-showcase";
import { StackCard } from "@/components/stack-card";
import { ArrowUpRight } from "lucide-react";
import { SITE_URL } from "@/lib/site";

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
    "arc",
    "fal-ai",
    "obsidian",
    "granola",
    "wispr-flow",
  ]
    .map((slug) => stack.find((t) => t.slug === slug))
    .filter((t): t is (typeof stack)[number] => Boolean(t));
  const featuredBookmarks = published([...bookmarks]).slice(0, 6);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name: "Eyüp Can Poyraz",
        url: SITE_URL,
        jobTitle: "Product and Growth Marketer",
        sameAs: [
          "https://x.com/eyuppoyraz",
          "https://www.linkedin.com/in/eyuppoyraz/",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "Eyüp Can Poyraz",
        publisher: { "@id": `${SITE_URL}/#person` },
      },
    ],
  };

  return (
    <div className="flex w-full flex-col gap-12 md:mx-[calc(50%-37.5vw)] md:w-[75vw] md:gap-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GrowthShowcase />

      {/* Projects — draggable rail with prev/next arrows.
          No .reveal fade-in here: this section holds the LCP image, and
          fade-up starts at opacity:0 (animation-fill-mode: both), which
          delays when Chrome counts the element as painted under CPU
          throttling. Lower sections keep the staggered entrance. */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            Projects
          </h2>
          <p className="text-sm text-muted">
            Selected case studies across fintech, SaaS and crypto.
          </p>
        </div>
        <ProjectsRail>
          {allProjects.map((project, i) => (
            <div
              key={project.slug}
              className="w-[80vw] shrink-0 snap-start md:w-[calc((100%-2.5rem)/3)]"
            >
              <ProjectCard project={project} overlay priority={i === 0} />
            </div>
          ))}
        </ProjectsRail>
      </section>

      {/* Notebook — compact 3-up grid, last cell is Read all */}
      <section className="reveal reveal-2 flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            Notebook
          </h2>
          <p className="text-sm text-muted">
            Sharing my thoughts and knowledge about product &amp; marketing
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.slice(0, 5).map((post) => (
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
              <div className="p-4">
                <span className="font-display text-[15px] font-semibold leading-snug tracking-tight text-foreground transition group-hover:text-accent">
                  {post.title}
                </span>
              </div>
            </Link>
          ))}
          <Link
            href="/notebook"
            className="group flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-subtle/40 p-6 text-center transition hover:border-accent/50 hover:bg-subtle"
          >
            <span className="flex size-10 items-center justify-center rounded-full border border-border bg-background text-foreground transition group-hover:border-accent group-hover:text-accent">
              <ArrowUpRight className="size-5" />
            </span>
            <span className="font-display text-[15px] font-semibold tracking-tight text-foreground transition group-hover:text-accent">
              Read all
            </span>
            <span className="text-xs text-muted">
              Every article &amp; case study
            </span>
          </Link>
        </div>
        <div className="mt-2 border-t border-border pt-8">
          <div className="mx-auto max-w-2xl">
            <NewsletterSignup />
          </div>
        </div>
      </section>

      {/* Bookmarks — 3 x 2 gallery cards, title over the image */}
      <section className="reveal reveal-3 flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            Bookmarks
          </h2>
          <p className="text-sm text-muted">
            Reads and resources I keep coming back to.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredBookmarks.map((bookmark) => (
            <a
              key={bookmark.url}
              href={bookmark.url}
              target="_blank"
              rel="noreferrer"
              className="group relative block aspect-[16/10] overflow-hidden rounded-xl border border-border bg-subtle"
            >
              {bookmark.image ? (
                <Image
                  src={bookmark.image}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, 320px"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`/api/og?url=${encodeURIComponent(bookmark.url)}`}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/5" />
              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-4">
                <span className="line-clamp-2 font-display text-[15px] font-semibold leading-snug tracking-tight text-white">
                  {bookmark.title}
                </span>
                <span className="text-[11px] font-medium uppercase tracking-wider text-white/60">
                  {bookmark.tags.slice(0, 2).join(" · ")}
                </span>
              </div>
              <ArrowUpRight className="absolute right-3 top-3 size-4 text-white/70 transition group-hover:text-white" />
            </a>
          ))}
        </div>
        <div className="flex justify-end">
          <Link
            href="/bookmarks"
            className="inline-flex items-center gap-1 text-sm font-medium text-foreground transition hover:text-accent"
          >
            All bookmarks
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="reveal reveal-4 flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            Tech Stack
          </h2>
          <p className="text-sm text-muted">
            The tools behind how I build, measure, and grow.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredStack.map((tool) => (
            <StackCard key={tool.slug} tool={tool} />
          ))}
        </div>
        <div className="flex justify-end">
          <Link
            href="/stack"
            className="inline-flex items-center gap-1 text-sm font-medium text-foreground transition hover:text-accent"
          >
            All tools
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </section>

      {/* Let's work together */}
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
