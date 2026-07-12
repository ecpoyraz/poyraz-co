import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

/** A normal-flow CTA card shown immediately before the projects section. */
export function AnimatedCta() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#0b0b0b] p-7 text-white sm:p-10 md:p-14">
      <div className="flex items-center gap-4">
        <span className="label-mono shrink-0 text-white/45">Next move</span>
        <span className="h-px w-full bg-white/35" />
      </div>

      <div className="py-16 sm:py-24">
        <div className="flex flex-col items-start gap-8">
          <p className="max-w-4xl font-display text-[clamp(2rem,5vw,4.75rem)] font-normal leading-[1.02] tracking-[-0.035em]">
            Let&apos;s work together and create{" "}
            <span className="text-brand-light">real traction.</span>
          </p>

          <Link
            href="/contact"
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-medium text-brand transition hover:bg-white/85"
          >
            Let&apos;s talk
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
