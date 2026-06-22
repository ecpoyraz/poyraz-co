import { Footer } from "@/components/footer";
import { getPublishedPosts } from "@/lib/posts";
import { PostCard } from "@/components/post-card";
import { projects } from "#content";
import { published } from "@/lib/collections";
import { ProjectCard } from "@/components/project-card";

export default function Home() {
  return (
    <div className="flex flex-col gap-16">
      <section>
        <h1 className="font-display text-4xl font-semibold tracking-tight">
          Hi, This is Eyüp Poyraz.
        </h1>
        <p className="mt-4 max-w-xl text-muted">
          Explore my work as a marketer with a track record of scaling tech
          products to maximize user value.
        </p>
      </section>
      <section>
        <h2 className="font-display text-2xl font-semibold">Projects</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {published([...projects])
            .slice(0, 2)
            .map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
        </div>
      </section>
      <section>
        <h2 className="font-display text-2xl font-semibold">Notebook</h2>
        <div className="mt-4 flex flex-col">
          {getPublishedPosts()
            .slice(0, 3)
            .map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
        </div>
      </section>
      <section>
        <h2 className="font-display text-2xl font-semibold">Bookmarks</h2>
      </section>
      <section>
        <h2 className="font-display text-2xl font-semibold">Tech Stack</h2>
      </section>
      <Footer />
    </div>
  );
}
