import Link from "next/link";
import Image from "next/image";
import { Copy } from "lucide-react";
import { Footer } from "@/components/footer";
import { getPublishedPosts } from "@/lib/posts";
import { projects, stack, bookmarks } from "#content";
import { published } from "@/lib/collections";
import { ProjectCard } from "@/components/project-card";
import { StackCard } from "@/components/stack-card";
import { BookmarkCard } from "@/components/bookmark-card";

export default function Home() {
  const posts = getPublishedPosts();
  const featuredProjects = published([...projects]).slice(0, 2);
  const featuredStack = published([...stack]).slice(0, 6);
  const featuredBookmarks = published([...bookmarks]).slice(0, 4);

  return (
    <div className="flex flex-col gap-14">
      <section className="flex flex-col gap-6 pt-1">
        <h1 className="font-display text-4xl font-bold tracking-tight sm:text-[2.7rem]">
          Hi, This is Eyüp Poyraz.
        </h1>
        <p className="max-w-2xl text-[15px] leading-relaxed text-muted">
          Explore my work as a marketer with a track record of scaling tech
          products to maximize user value.
        </p>
        <div className="flex items-center gap-3">
          <Link
            href="/about"
            className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:opacity-90"
          >
            About
          </Link>
          <a
            href="mailto:hi@poyraz.co"
            className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-subtle"
          >
            <Copy className="size-4" />
            E-Mail
          </a>
        </div>
      </section>

      <section className="flex flex-col gap-5">
        <h2 className="font-display text-2xl font-semibold tracking-tight">
          Projects
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-border p-6 sm:p-7">
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
      </section>

      <section className="flex flex-col gap-5">
        <h2 className="font-display text-2xl font-semibold tracking-tight">
          Bookmarks
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          {featuredBookmarks.map((bookmark) => (
            <BookmarkCard key={bookmark.url} bookmark={bookmark} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            Tech Stack
          </h2>
          <p className="text-sm text-muted">
            Softwares I use on a regular basis.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {featuredStack.map((tool) => (
            <StackCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
