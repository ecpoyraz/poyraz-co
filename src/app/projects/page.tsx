import type { Metadata } from "next";
import Link from "next/link";
import { projects } from "#content";
import { published } from "@/lib/collections";
import { MediaCard } from "@/components/media-card";
import { Reveal } from "@/components/reveal";
import { TagPill } from "@/components/tag-pill";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Designing memorable digital experiences. Each project reflects my passion for driving growth and user engagement.",
  alternates: { canonical: "/projects" },
  openGraph: { url: "/projects" },
};

export default function ProjectsPage() {
  const items = published([...projects]);
  return (
    <div className="flex flex-col gap-16 md:gap-20">
      <Reveal as="header" className="pt-6 md:pt-14">
        <p className="label-mono mb-4 text-muted">Work</p>
        <h1 className="max-w-3xl font-display text-4xl font-normal leading-[1.02] tracking-[-0.03em] sm:text-5xl md:text-6xl">
          Tech products I&apos;ve helped scale with growth and care.
        </h1>
      </Reveal>

      <Reveal as="section" className="grid gap-5 md:grid-cols-2">
        {items.map((project, i) => (
          <div key={project.slug} className="flex flex-col gap-3">
            <MediaCard
              href={project.permalink}
              title={project.title}
              cover={project.cover}
              priority={i < 2}
            />
            <div className="flex items-center justify-between gap-3">
              <Link
                href={project.permalink}
                className="font-display text-lg font-semibold tracking-[-0.01em] text-foreground transition hover:text-accent"
              >
                {project.title}
              </Link>
              <TagPill>{project.category}</TagPill>
            </div>
          </div>
        ))}
      </Reveal>
    </div>
  );
}
