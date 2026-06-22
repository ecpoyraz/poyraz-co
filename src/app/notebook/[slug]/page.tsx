import { notFound } from "next/navigation";
import { notebook } from "#content";
import { MDXContent } from "@/components/mdx-content";

export function generateStaticParams() {
  return notebook.map((post) => ({ slug: post.slug }));
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = notebook.find((p) => p.slug === slug);
  if (!post) notFound();
  return (
    <article className="flex flex-col gap-6">
      <header>
        <span className="text-xs uppercase tracking-wide text-muted">
          {post.category}
        </span>
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          {post.title}
        </h1>
      </header>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <MDXContent code={post.code} />
      </div>
    </article>
  );
}
