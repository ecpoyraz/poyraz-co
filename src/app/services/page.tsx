import Link from "next/link";
import { Footer } from "@/components/footer";

const SERVICES = [
  {
    title: "Growth Strategy",
    desc: "Tailored advice to support your growth and fix the bottlenecks holding you back.",
  },
  {
    title: "KPI & Tool Setup",
    desc: "Define the metrics that matter and set up the analytics stack to track them.",
  },
  {
    title: "Product Marketing",
    desc: "Positioning, go-to-market, and launch motions that move activation.",
  },
  {
    title: "Funnel Optimization",
    desc: "Find and fix the leaks across acquisition, activation, and retention.",
  },
];

export default function ServicesPage() {
  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-3">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Services
        </h1>
        <p className="max-w-2xl text-[15px] leading-relaxed text-muted">
          I help companies build growth momentum and scale their product. Here
          is how we can work together.
        </p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2">
        {SERVICES.map((s) => (
          <div
            key={s.title}
            className="flex flex-col gap-2 rounded-xl border border-border p-5"
          >
            <span className="font-display text-base font-semibold tracking-tight">
              {s.title}
            </span>
            <span className="text-sm leading-relaxed text-muted">{s.desc}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-subtle p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-0.5">
          <span className="font-display text-lg font-semibold tracking-tight">
            Discover Call (Free)
          </span>
          <span className="text-sm text-muted">
            Let&apos;s meet and discuss how we can collaborate.
          </span>
        </div>
        <Link
          href="/contact"
          className="w-fit rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:opacity-90"
        >
          Schedule Call
        </Link>
      </div>
      <Footer />
    </div>
  );
}
