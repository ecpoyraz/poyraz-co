import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { projects } from "#content";
import { published } from "@/lib/collections";
import { MDXContent } from "@/components/mdx-content";
import { ProjectCard } from "@/components/project-card";
import { Footer } from "@/components/footer";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: project.permalink },
    openGraph: {
      type: "article",
      url: project.permalink,
      title: project.title,
      description: project.summary,
      images: project.cover ? [project.cover] : undefined,
    },
    twitter: { images: project.cover ? [project.cover] : undefined },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();
  const others = published([...projects])
    .filter((p) => p.slug !== slug)
    .slice(0, 2);

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-6">
        <Link
          href="/projects"
          className="flex w-fit items-center gap-1.5 text-sm text-muted transition hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          <span>All Projects</span>
          <span className="text-muted/50">/ {project.title}</span>
        </Link>
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          {project.title}
        </h1>
        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-lg border border-border bg-subtle px-3 py-1.5 text-sm text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        {project.cover && (
          <Image
            src={project.cover}
            alt={project.title}
            width={1600}
            height={1000}
            quality={90}
            priority
            sizes="(max-width: 768px) 100vw, 768px"
            className="w-full rounded-2xl border border-border"
          />
        )}
      </header>

      <article className="prose prose-neutral max-w-none dark:prose-invert">
        <MDXContent code={project.code} />
      </article>

      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-subtle p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-0.5">
          <span className="font-display text-lg font-semibold tracking-tight">
            Want to scale your business?
          </span>
          <span className="text-sm text-muted">
            Let&apos;s work together to fuel your growth
          </span>
        </div>
        <form className="flex gap-2">
          <input
            type="email"
            required
            placeholder="Your Email"
            aria-label="Email address"
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:opacity-90"
          >
            Submit
          </button>
        </form>
      </div>

      {others.length > 0 && (
        <section className="flex flex-col gap-5">
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            Other Projects
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {others.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
