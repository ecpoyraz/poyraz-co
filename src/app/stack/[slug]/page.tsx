import { notFound } from "next/navigation";
import { stack } from "#content";
import { MDXContent } from "@/components/mdx-content";

export function generateStaticParams() {
  return stack.map((tool) => ({ slug: tool.slug }));
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = stack.find((t) => t.slug === slug);
  if (!tool) notFound();
  return (
    <article className="flex flex-col gap-6">
      <header>
        <span className="text-xs uppercase tracking-wide text-muted">
          {tool.category}
        </span>
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          {tool.name}
        </h1>
        <a
          href={tool.url}
          target="_blank"
          rel="noreferrer"
          className="mt-2 text-sm text-accent hover:underline"
        >
          Visit website
        </a>
      </header>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <MDXContent code={tool.code} />
      </div>
    </article>
  );
}
