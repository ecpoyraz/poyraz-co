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
import { BookmarkCard } from "@/components/bookmark-card";

export const metadata: Metadata = {
  description:
    "Explore my work as a marketer with a track record of scaling tech products to maximize user value.",
  alternates: { canonical: "/" },
  openGraph: { url: "/" },
};

export default function Home() {
  const posts = getPublishedPosts();
  const allProjects = published([...projects]);
  const featuredStack = published([...stack]).slice(0, 6);
  const featuredBookmarks = published([...bookmarks]).slice(0, 4);

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
              className="w-[78%] shrink-0 snap-start sm:w-[300px]"
            >
              <ProjectCard project={project} priority={i === 0} />
            </div>
          ))}
        </ProjectsCarousel>
      </section>

      <section className="reveal reveal-2 rounded-2xl border border-border bg-card p-6 sm:p-7">
        <h2 className="font-display text-2xl font-semibold tracking-tight">
          Notebook
        </h2>
        <p className="mt-1.5 text-sm text-muted">
          Sharing my thoughts and knowledge about product &amp; marketing
        </p>
        <div className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={post.permalink}
              className="group flex items-center gap-3"
            >
              {post.cover && (
                <Image
                  src={post.cover}
                  alt=""
                  width={44}
                  height={44}
                  className="size-11 shrink-0 rounded-lg border border-border object-cover"
                />
              )}
              <div className="flex flex-col">
                <span className="text-sm font-semibold leading-snug text-foreground transition group-hover:text-accent">
                  {post.title}
                </span>
                <span className="text-xs text-muted">{post.category}</span>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-6 border-t border-border pt-6">
          <NewsletterSignup />
        </div>
      </section>

      <section className="reveal reveal-3 flex flex-col gap-5">
        <h2 className="font-display text-2xl font-semibold tracking-tight">
          Bookmarks
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          {featuredBookmarks.map((bookmark) => (
            <BookmarkCard key={bookmark.url} bookmark={bookmark} />
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

      <section className="reveal reveal-4 rounded-2xl border border-border bg-card p-6 sm:p-7">
        <h2 className="font-display text-2xl font-semibold tracking-tight">
          Tech Stack
        </h2>
        <p className="mt-1.5 text-sm text-muted">
          Softwares I use on a regular basis.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {featuredStack.map((tool) => (
            <StackCard key={tool.slug} tool={tool} />
          ))}
        </div>
        <div className="mt-6 flex justify-center">
          <Link
            href="/stack"
            className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-subtle"
          >
            View all
          </Link>
        </div>
      </section>

      <section className="reveal reveal-5 grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col items-start gap-2 rounded-2xl border border-border bg-card p-6">
          <h3 className="font-display text-lg font-semibold tracking-tight">
            Discover Call (Free)
          </h3>
          <p className="text-sm text-muted">
            Let&apos;s meet and discuss how can we collaborate
          </p>
          <Link
            href="/services"
            className="mt-2 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:opacity-90"
          >
            Schedule Call
          </Link>
        </div>
        <div className="flex flex-col items-start gap-2 rounded-2xl border border-border bg-card p-6">
          <h3 className="font-display text-lg font-semibold tracking-tight">
            Product Growth Consultancy
          </h3>
          <p className="text-sm text-muted">
            Explore my growth &amp; product services.
          </p>
          <Link
            href="/services"
            className="mt-2 rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-subtle"
          >
            View Services
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
