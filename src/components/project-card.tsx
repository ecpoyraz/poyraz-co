import Link from "next/link";
import Image from "next/image";
import type { projects } from "#content";

export function ProjectCard({
  project,
  priority = false,
}: {
  project: (typeof projects)[number];
  priority?: boolean;
}) {
  return (
    <Link href={project.permalink} className="group flex flex-col gap-3">
      <div className="overflow-hidden rounded-2xl border border-border bg-subtle">
        {project.cover && (
          <Image
            src={project.cover}
            alt={project.title}
            width={1600}
            height={1000}
            quality={90}
            priority={priority}
            sizes="(max-width: 768px) 100vw, 800px"
            className="aspect-[16/10] w-full object-cover"
          />
        )}
      </div>
      <div className="flex items-center justify-between gap-3 px-1">
        <span className="font-display text-[15px] font-semibold tracking-tight text-foreground transition-colors group-hover:text-accent">
          {project.title}
        </span>
        <span className="shrink-0 rounded-full border border-border bg-subtle px-2.5 py-0.5 text-xs text-muted">
          {project.category}
        </span>
      </div>
    </Link>
  );
}
