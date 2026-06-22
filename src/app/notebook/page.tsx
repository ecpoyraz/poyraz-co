import { getPublishedPosts } from "@/lib/posts";
import { PostCard } from "@/components/post-card";

export default function NotebookPage() {
  const posts = getPublishedPosts();
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          Notebook
        </h1>
        <p className="mt-2 text-muted">
          Thoughts and notes on product and marketing.
        </p>
      </header>
      <div className="flex flex-col">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
