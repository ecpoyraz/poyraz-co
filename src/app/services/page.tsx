import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Services",
  description:
    "I help companies build growth momentum and scale their product.",
  alternates: { canonical: "/services" },
  openGraph: { url: "/services" },
};

const SERVICES = [
  {
    title: "Discovery Call",
    desc: "Intro chat to see if we're a good fit.",
    bullets: [
      "Learn your product & goals",
      "Share my growth approach",
      "Agree on next steps",
    ],
    cta: "Book Free Call",
  },
  {
    title: "Consultancy",
    desc: "Tailored advice to support your growth and fix bottlenecks",
    bullets: ["Growth audit", "90-day action plan", "KPI & tool setup"],
    cta: "Get consultancy",
  },
  {
    title: "Kickstarter",
    desc: "Hands on execution",
    bullets: [
      "Run weekly experiments",
      "Build campaigns & automations",
      "Track and report results",
    ],
    cta: "Launch with me",
  },
];

export default function ServicesPage() {
  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-3">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Services{" "}
          <span className="text-muted font-medium">
            Let&apos;s Build Momentum
          </span>
        </h1>
        <p className="max-w-2xl text-[15px] leading-relaxed text-muted">
          I help companies to build growth momentum and scale their product
        </p>
      </header>
      <div className="grid gap-4 sm:grid-cols-3">
        {SERVICES.map((s) => (
          <div
            key={s.title}
            className="flex h-full flex-col rounded-2xl border border-border p-6"
          >
            <span className="font-display text-xl font-semibold tracking-tight">
              {s.title}
            </span>
            <p className="mt-2 text-sm text-muted">{s.desc}</p>
            <ul className="mt-4 flex flex-col gap-1.5 text-sm text-muted">
              {s.bullets.map((bullet) => (
                <li key={bullet}>&bull; {bullet}</li>
              ))}
            </ul>
            <div className="mt-auto pt-5">
              <Link
                href="/contact"
                className="inline-flex rounded-md border border-border bg-subtle px-4 py-2 text-sm font-medium text-foreground transition hover:bg-background"
              >
                {s.cta}
              </Link>
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
}
