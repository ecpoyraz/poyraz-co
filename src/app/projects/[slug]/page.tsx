import { notFound } from "next/navigation";
import { projects } from "#content";
import { MDXContent } from "@/components/mdx-content";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();
  return (
    <article className="flex flex-col gap-6">
      <header>
        <span className="text-xs uppercase tracking-wide text-muted">
          {project.category}
        </span>
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          {project.title}
        </h1>
        <p className="mt-2 text-muted">{project.summary}</p>
      </header>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <MDXContent code={project.code} />
      </div>
    </article>
  );
}
