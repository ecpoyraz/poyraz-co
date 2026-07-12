import type { Metadata } from "next";
import { stack } from "#content";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { GROUPS } from "@/lib/stack-groups";
import { IndexList, IndexRow } from "@/components/index-list";
import { TagPill, toneFor } from "@/components/tag-pill";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Stack",
  description: "Tools, resources and software I use daily.",
  alternates: { canonical: "/stack" },
  openGraph: { url: "/stack" },
};

export default function StackPage() {
  const tools = [...stack].filter((t) => !t.draft);
  const bySlug = (slug: string) => tools.find((t) => t.slug === slug);

  return (
    <div className="flex flex-col gap-16 md:gap-20">
      <Reveal as="header" className="pt-6 md:pt-14">
        <p className="label-mono mb-4 text-muted">Tools</p>
        <h1 className="max-w-3xl font-display text-4xl font-semibold leading-[1.02] tracking-[-0.03em] sm:text-5xl md:text-6xl">
          Software I use to craft something valuable.
        </h1>
      </Reveal>

      <div className="flex flex-col gap-14">
        {GROUPS.map((group) => {
          const groupTools = group.slugs
            .map(bySlug)
            .filter((t): t is (typeof tools)[number] => Boolean(t));
          if (groupTools.length === 0) return null;
          return (
            <Reveal as="section" key={group.title}>
              <p className="label-mono mb-2 text-muted">{group.title}</p>
              <p className="mb-6 text-sm text-muted">{group.description}</p>
              <IndexList>
                {groupTools.map((tool) => (
                  <IndexRow
                    key={tool.slug}
                    href={tool.url}
                    title={tool.name}
                    external
                    tags={
                      <TagPill tone={toneFor(tool.category)}>
                        {tool.category}
                      </TagPill>
                    }
                  />
                ))}
              </IndexList>
            </Reveal>
          );
        })}
      </div>

      <Reveal className="rounded-xl bg-card p-8 md:p-10">
        <NewsletterSignup
          title="Never miss a new tool"
          subtitle="Get notified as soon as I add new tools to my stack."
        />
      </Reveal>
    </div>
  );
}
