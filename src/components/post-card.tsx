import Link from "next/link";
import type { Post } from "@/lib/posts";

export function PostCard({ post }: { post: Post }) {
  return (
    <Link
      href={post.permalink}
      className="flex flex-col gap-1 border-b border-border py-4 hover:opacity-80"
    >
      <span className="text-xs uppercase tracking-wide text-muted">
        {post.category}
      </span>
      <span className="font-display text-lg font-semibold text-foreground">
        {post.title}
      </span>
      <span className="text-sm text-muted">{post.excerpt}</span>
    </Link>
  );
}
