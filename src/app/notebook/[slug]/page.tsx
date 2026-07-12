import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { notebook } from "#content";
import { getPublishedPosts } from "@/lib/posts";
import { MDXContent } from "@/components/mdx-content";
import { IndexList, IndexRow } from "@/components/index-list";
import { TagPill, toneFor } from "@/components/tag-pill";

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
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-10">
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
        <div className="flex flex-col gap-4">
          <div>
            <TagPill tone={toneFor(post.category)}>{post.category}</TagPill>
          </div>
          <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-5xl">
            {post.title}
          </h1>
          <p className="max-w-2xl text-[15px] leading-relaxed text-muted">
            {post.excerpt}
          </p>
          <div className="label-mono flex flex-wrap items-center gap-x-3 gap-y-1 text-muted">
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
                <li key={tag}>
                  <TagPill>{tag}</TagPill>
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
            className="w-full rounded-xl"
          />
        )}
      </header>
      <article className="prose prose-neutral max-w-none">
        <MDXContent code={post.code} />
      </article>

      {readNext.length > 0 && (
        <section className="pt-4">
          <div className="mb-6 flex items-baseline justify-between gap-4">
            <h2 className="font-display text-2xl font-semibold tracking-tight">
              Read next
            </h2>
            <Link
              href="/notebook"
              className="text-sm font-medium text-muted transition hover:text-foreground"
            >
              All articles
            </Link>
          </div>
          <IndexList>
            {readNext.map((p) => (
              <IndexRow
                key={p.slug}
                href={p.permalink}
                title={p.title}
                tags={<TagPill tone={toneFor(p.category)}>{p.category}</TagPill>}
              />
            ))}
          </IndexList>
        </section>
      )}

    </div>
  );
}
