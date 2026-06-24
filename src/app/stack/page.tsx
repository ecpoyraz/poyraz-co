import type { Metadata } from "next";
import { stack } from "#content";
import { StackCard } from "@/components/stack-card";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { Footer } from "@/components/footer";
import { GROUPS } from "@/lib/stack-groups";

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
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Stack
        </h1>
        <p className="max-w-2xl text-[15px] leading-relaxed text-muted">
          Software I use to craft something valuable.
        </p>
      </header>

      {GROUPS.map((group) => {
        const groupTools = group.slugs
          .map(bySlug)
          .filter((t): t is (typeof tools)[number] => Boolean(t));
        if (groupTools.length === 0) return null;
        return (
          <section
            key={group.title}
            className="rounded-2xl border border-border bg-card p-6 sm:p-7"
          >
            <h2 className="font-display text-lg font-semibold tracking-tight">
              {group.title}
            </h2>
            <div className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2">
              {groupTools.map((tool) => (
                <StackCard key={tool.slug} tool={tool} />
              ))}
            </div>
          </section>
        );
      })}

      <div className="rounded-2xl border border-border bg-card p-6 sm:p-7">
        <NewsletterSignup
          title="Never miss a new tool"
          subtitle="Get notified as soon as I add new tools to my stack."
        />
      </div>

      <Footer />
    </div>
  );
}
