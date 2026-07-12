import { ArrowDown } from "lucide-react";

export function HomeIntro() {
  return (
    <section className="relative flex min-h-[calc(100svh-6.5rem)] flex-col justify-center py-16">
      <div className="max-w-6xl">
        <h1 className="home-intro-title whitespace-nowrap font-display text-[clamp(1.9rem,6.5vw,6rem)] font-normal leading-none tracking-[-0.05em] text-foreground">
          A full stack marketer
        </h1>

        <p className="home-intro-copy mt-10 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl md:mt-12 md:text-2xl">
          Hi, it&apos;s Eyüp. I blend product marketing, growth, content,
          analytics, and a little code to help tech products find traction and
          scale.
        </p>
      </div>

      <div
        aria-hidden
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-muted sm:bottom-10"
      >
        <span className="label-mono whitespace-nowrap">Scroll to continue</span>
        <span className="scroll-cue-bob flex size-8 items-center justify-center rounded-full border border-border bg-background/80">
          <ArrowDown className="size-4" strokeWidth={1.5} />
        </span>
      </div>
    </section>
  );
}
