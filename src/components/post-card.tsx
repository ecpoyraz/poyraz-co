import Link from "next/link";
import type { Post } from "@/lib/posts";

export function PostCard({ post }: { post: Post }) {
  return (
    <Link
      href={post.permalink}
      className="group flex flex-col gap-1.5 border-b border-border py-5 transition last:border-0"
    >
      <span className="inline-flex w-fit items-center rounded-full border border-border bg-subtle px-2.5 py-0.5 text-[10.5px] font-medium uppercase tracking-wider text-muted">
        {post.category}
      </span>
      <span className="font-display text-[17px] font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-accent">
        {post.title}
      </span>
      <span className="text-sm leading-relaxed text-muted">{post.excerpt}</span>
    </Link>
  );
}
