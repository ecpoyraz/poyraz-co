import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { notebook } from "#content";
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
      <Footer />
    </div>
  );
}
