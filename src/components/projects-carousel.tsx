"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function ProjectsCarousel({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    update();
    const el = ref.current;
    el?.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el?.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const scrollBy = (dir: number) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  // Fade only the edges that have more content to scroll toward.
  const left = atStart ? "black 0" : "transparent 0, black 40px";
  const right = atEnd
    ? "black 100%"
    : "black calc(100% - 72px), transparent 100%";
  const mask = `linear-gradient(to right, ${left}, ${right})`;

  return (
    <div className="group relative">
      <div
        ref={ref}
        style={{ maskImage: mask, WebkitMaskImage: mask }}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>

      <button
        type="button"
        onClick={() => scrollBy(-1)}
        aria-label="Previous projects"
        className={`absolute left-2 top-[42%] hidden size-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/90 text-foreground shadow-sm backdrop-blur transition hover:bg-subtle sm:flex ${
          atStart ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>

      <button
        type="button"
        onClick={() => scrollBy(1)}
        aria-label="Next projects"
        className={`absolute right-2 top-[42%] hidden size-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/90 text-foreground shadow-sm backdrop-blur transition hover:bg-subtle sm:flex ${
          atEnd ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>
    </div>
  );
}
