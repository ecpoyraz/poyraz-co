import Link from "next/link";
import Image from "next/image";
import { getPublishedPosts } from "@/lib/posts";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { Footer } from "@/components/footer";

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
      <div className="flex flex-col">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={post.permalink}
            className="group flex items-center gap-4 border-b border-border py-5 last:border-0"
          >
            {post.cover && (
              <Image
                src={post.cover}
                alt=""
                width={48}
                height={48}
                className="size-12 shrink-0 rounded-lg border border-border object-cover"
              />
            )}
            <div className="flex min-w-0 flex-col gap-0.5">
              <span className="font-display text-[17px] font-semibold tracking-tight text-foreground transition group-hover:text-accent">
                {post.title}
              </span>
              <span className="truncate text-sm text-muted">
                {post.excerpt}
              </span>
            </div>
            <span className="ml-auto hidden shrink-0 rounded-full border border-border bg-subtle px-2.5 py-0.5 text-xs text-muted sm:block">
              {post.category}
            </span>
          </Link>
        ))}
      </div>
      <NewsletterSignup />
      <Footer />
    </div>
  );
}
