import { projects } from "#content";
import { published } from "@/lib/collections";
import { ProjectCard } from "@/components/project-card";

export default function ProjectsPage() {
  const items = published([...projects]);
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          Projects
        </h1>
        <p className="mt-2 text-muted">
          Selected work across fintech and SaaS.
        </p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </div>
  );
}
