import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { notebook } from "#content";
import { MDXContent } from "@/components/mdx-content";
import { Footer } from "@/components/footer";

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
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-4">
        <Link
          href="/notebook"
          className="flex w-fit items-center gap-1.5 text-sm text-muted transition hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Notebook
        </Link>
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-wider text-muted">
            {post.category}
          </span>
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {post.title}
          </h1>
        </div>
      </header>
      <article className="prose prose-neutral max-w-none dark:prose-invert">
        <MDXContent code={post.code} />
      </article>
      <Footer />
    </div>
  );
}
