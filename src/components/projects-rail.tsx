"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";

export function ProjectsRail({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const drag = useRef({ active: false, startX: 0, startScroll: 0, moved: 0 });
  const hovering = useRef(false);
  const visible = useRef(false);

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft >= max - 4);
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

  const cardStep = () => {
    const el = ref.current;
    if (!el) return 300;
    const first = el.firstElementChild as HTMLElement | null;
    return first ? first.offsetWidth + 20 : el.clientWidth * 0.8;
  };

  const step = (dir: number) => {
    ref.current?.scrollBy({ left: dir * cardStep(), behavior: "smooth" });
  };

  // Gentle auto-advance; pauses on hover/drag/hidden tab, off for reduced motion.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rail = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible.current = entry.isIntersecting;
      },
      { threshold: 0.25 },
    );
    if (rail) observer.observe(rail);

    const id = setInterval(() => {
      const el = ref.current;
      if (
        !el ||
        !visible.current ||
        hovering.current ||
        drag.current.active ||
        document.hidden
      )
        return;
      const max = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft >= max - 4)
        el.scrollTo({ left: 0, behavior: "smooth" });
      else el.scrollBy({ left: cardStep(), behavior: "smooth" });
    }, 5000);
    return () => {
      clearInterval(id);
      observer.disconnect();
    };
  }, []);

  // Drag to scroll (mouse / touch via pointer events).
  const onDown = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    drag.current = {
      active: true,
      startX: e.clientX,
      startScroll: el.scrollLeft,
      moved: 0,
    };
  };
  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || !drag.current.active) return;
    const dx = e.clientX - drag.current.startX;
    drag.current.moved = Math.max(drag.current.moved, Math.abs(dx));
    el.scrollLeft = drag.current.startScroll - dx;
  };
  const onUp = () => {
    drag.current.active = false;
  };
  // Suppress the click that follows a drag so cards don't navigate mid-swipe.
  const onClickCapture = (e: React.MouseEvent) => {
    if (drag.current.moved > 6) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div>
      <div
        ref={ref}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerEnter={() => {
          hovering.current = true;
        }}
        onPointerLeave={() => {
          hovering.current = false;
          onUp();
        }}
        onClickCapture={onClickCapture}
        className="flex cursor-grab snap-x snap-mandatory gap-5 overflow-x-auto py-1 active:cursor-grabbing [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <Link
          href="/projects"
          className="inline-flex items-center gap-1 text-sm font-medium text-foreground transition hover:text-accent"
        >
          All projects
          <ArrowUpRight className="size-4" />
        </Link>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label="Previous projects"
            disabled={atStart}
            className="flex size-9 items-center justify-center rounded-lg border border-border bg-background text-foreground transition hover:bg-subtle disabled:pointer-events-none disabled:opacity-35"
          >
            <ArrowLeft className="size-[18px]" />
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            aria-label="Next projects"
            disabled={atEnd}
            className="flex size-9 items-center justify-center rounded-lg border border-border bg-background text-foreground transition hover:bg-subtle disabled:pointer-events-none disabled:opacity-35"
          >
            <ArrowRight className="size-[18px]" />
          </button>
        </div>
      </div>
    </div>
  );
}
