import Link from "next/link";
import type { projects } from "#content";

export function ProjectCard({
  project,
}: {
  project: (typeof projects)[number];
}) {
  return (
    <Link
      href={project.permalink}
      className="flex flex-col gap-1 rounded-md border border-border p-4 hover:opacity-80"
    >
      <span className="text-xs uppercase tracking-wide text-muted">
        {project.category}
      </span>
      <span className="font-display text-lg font-semibold text-foreground">
        {project.title}
      </span>
      <span className="text-sm text-muted">{project.summary}</span>
    </Link>
  );
}
