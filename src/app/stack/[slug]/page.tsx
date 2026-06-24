import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { stack } from "#content";
import { MDXContent } from "@/components/mdx-content";
import { StackCard } from "@/components/stack-card";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { Footer } from "@/components/footer";
import { similarSlugs } from "@/lib/stack-groups";

export function generateStaticParams() {
  return stack.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = stack.find((t) => t.slug === slug);
  if (!tool) return {};
  return {
    title: tool.name,
    description: tool.description,
    alternates: { canonical: tool.permalink },
    openGraph: {
      url: tool.permalink,
      title: tool.name,
      description: tool.description,
    },
  };
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = stack.find((t) => t.slug === slug);
  if (!tool) notFound();

  const similar = similarSlugs(slug)
    .map((s) => stack.find((t) => t.slug === s))
    .filter((t): t is (typeof stack)[number] => Boolean(t));

  return (
    <div className="flex flex-col gap-8">
      <Link
        href="/stack"
        className="flex w-fit items-center gap-1.5 text-sm text-muted transition hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        All Tools
      </Link>

      <header className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          {tool.logo && (
            <Image
              src={tool.logo}
              alt={tool.name}
              width={48}
              height={48}
              className="size-12 shrink-0 rounded-xl border border-border bg-white object-contain p-1.5"
            />
          )}
          <h1 className="font-display text-3xl font-bold tracking-tight">
            {tool.name}
          </h1>
        </div>
        <a
          href={tool.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex w-fit rounded-md border border-border bg-subtle px-4 py-2 text-sm font-medium text-foreground transition hover:bg-background"
        >
          Visit {tool.name}&apos;s Website
        </a>
      </header>

      <article className="prose prose-neutral max-w-none dark:prose-invert">
        <MDXContent code={tool.code} />
      </article>

      {similar.length > 0 && (
        <section className="rounded-2xl border border-border bg-card p-6 sm:p-7">
          <h2 className="font-display text-lg font-semibold tracking-tight">
            Similar Apps
          </h2>
          <div className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2">
            {similar.map((t) => (
              <StackCard key={t.slug} tool={t} />
            ))}
          </div>
        </section>
      )}

      <div className="rounded-2xl border border-border bg-card p-6 sm:p-7">
        <NewsletterSignup
          title="Never miss a new tool"
          subtitle="Get notified as soon as I add new tools to my stack."
        />
      </div>

      <Footer />
    </div>
  );
}
