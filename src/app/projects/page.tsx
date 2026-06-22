import { projects } from "#content";
import { published } from "@/lib/collections";
import { ProjectCard } from "@/components/project-card";
import { Footer } from "@/components/footer";

export default function ProjectsPage() {
  const items = published([...projects]);
  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-3">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Projects
        </h1>
        <p className="max-w-2xl text-[15px] leading-relaxed text-muted">
          Here are some of the tech products I have helped scale. Each project
          reflects my passion for driving growth and user engagement.
        </p>
      </header>
      <div className="flex flex-col gap-8">
        {items.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
      <Footer />
    </div>
  );
}
