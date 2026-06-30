import Link from "next/link";
import Image from "next/image";
import type { projects } from "#content";

export function ProjectCard({
  project,
  priority = false,
  overlay = false,
}: {
  project: (typeof projects)[number];
  priority?: boolean;
  overlay?: boolean;
}) {
  if (overlay) {
    return (
      <Link
        href={project.permalink}
        className="group relative block overflow-hidden rounded-2xl border border-border bg-subtle"
      >
        {project.cover && (
          <Image
            src={project.cover}
            alt={project.title}
            width={1600}
            height={1000}
            quality={90}
            priority={priority}
            sizes="(max-width: 768px) 100vw, 800px"
            className="aspect-[16/11] w-full object-cover transition duration-500 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
          <span className="font-display text-base font-semibold leading-tight tracking-tight text-white">
            {project.title}
          </span>
          <span className="shrink-0 rounded-full border border-white/25 bg-white/10 px-2.5 py-0.5 text-xs text-white/90 backdrop-blur-sm">
            {project.category}
          </span>
        </div>
      </Link>
    );
  }

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
