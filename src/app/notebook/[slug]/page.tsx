import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { notebook } from "#content";
import { getPublishedPosts } from "@/lib/posts";
import { MDXContent } from "@/components/mdx-content";
import { Footer } from "@/components/footer";

export function generateStaticParams() {
  return notebook.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = notebook.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: post.permalink },
    openGraph: {
      type: "article",
      url: post.permalink,
      title: post.title,
      description: post.excerpt,
      images: post.cover ? [post.cover] : undefined,
    },
    twitter: { images: post.cover ? [post.cover] : undefined },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = notebook.find((p) => p.slug === slug);
  if (!post) notFound();

  // Other articles to read next: prefer ones sharing tags, then most recent.
  const readNext = getPublishedPosts()
    .filter((p) => p.slug !== post.slug)
    .map((p) => ({
      p,
      shared: p.tags.filter((t) => post.tags.includes(t)).length,
    }))
    .sort(
      (a, b) =>
        b.shared - a.shared ||
        new Date(b.p.date).getTime() - new Date(a.p.date).getTime(),
    )
    .slice(0, 3)
    .map((x) => x.p);

  const siteUrl = "https://poyraz.co";
  const url = `${siteUrl}${post.permalink}`;
  const author = {
    "@type": "Person",
    name: "Eyup Poyraz",
    url: `${siteUrl}/about`,
  };
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    author,
    publisher: author,
    articleSection: post.category,
    keywords: post.tags.length ? post.tags.join(", ") : undefined,
    image: post.cover ? `${siteUrl}${post.cover}` : undefined,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    inLanguage: "en",
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      {
        "@type": "ListItem",
        position: 2,
        name: "Notebook",
        item: `${siteUrl}/notebook`,
      },
      { "@type": "ListItem", position: 3, name: post.title, item: url },
    ],
  };

  return (
    <div className="flex flex-col gap-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <header className="flex flex-col gap-4">
        <Link
          href="/notebook"
          className="flex w-fit items-center gap-1.5 text-sm text-muted transition hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Notebook
        </Link>
        <div className="flex flex-col gap-3">
          <span className="text-xs font-medium uppercase tracking-wider text-accent">
            {post.category}
          </span>
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {post.title}
          </h1>
          <p className="max-w-2xl text-[15px] leading-relaxed text-muted">
            {post.excerpt}
          </p>
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm text-muted">
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <span aria-hidden>·</span>
            <span>{post.metadata.readingTime} min read</span>
          </div>
          {post.tags.length > 0 && (
            <ul className="flex flex-wrap gap-2 pt-1">
              {post.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-border bg-subtle px-2.5 py-0.5 text-xs text-muted"
                >
                  {tag}
                </li>
              ))}
            </ul>
          )}
        </div>
        {post.cover && (
          <Image
            src={post.cover}
            alt={post.title}
            width={1280}
            height={720}
            className="w-full rounded-2xl border border-border"
          />
        )}
      </header>
      <article className="prose prose-neutral max-w-none dark:prose-invert">
        <MDXContent code={post.code} />
      </article>

      {readNext.length > 0 && (
        <section className="border-t border-border pt-8">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="font-display text-xl font-semibold tracking-tight">
              Read next
            </h2>
            <Link
              href="/notebook"
              className="text-sm font-medium text-muted transition hover:text-accent"
            >
              All articles
            </Link>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {readNext.map((p) => (
              <Link
                key={p.slug}
                href={p.permalink}
                className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition hover:border-accent/40"
              >
                {p.cover && (
                  <div className="overflow-hidden border-b border-border bg-subtle">
                    <Image
                      src={p.cover}
                      alt=""
                      width={640}
                      height={360}
                      className="aspect-[16/9] w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                    />
                  </div>
                )}
                <div className="p-4">
                  <span className="font-display text-[15px] font-semibold leading-snug tracking-tight text-foreground transition group-hover:text-accent">
                    {p.title}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
