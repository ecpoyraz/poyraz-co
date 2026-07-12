"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

// Singleton observer shared across all Reveal instances.
let observer: IntersectionObserver | null = null;
const callbacks = new Map<Element, () => void>();

function getObserver() {
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            callbacks.get(entry.target)?.();
            callbacks.delete(entry.target);
            observer?.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
  }
  return observer;
}

// Underlies <Reveal>. Exposed directly for elements that already own their
// root tag (e.g. IndexRow's <li>) and can't be wrapped without breaking
// HTML nesting rules.
export function useReveal<T extends HTMLElement>(delay: 0 | 1 | 2 | 3 = 0) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Above-the-fold elements animate in immediately (staggered page enter).
    if (el.getBoundingClientRect().top < window.innerHeight) {
      requestAnimationFrame(() => el.classList.add("is-visible"));
      return;
    }
    callbacks.set(el, () => el.classList.add("is-visible"));
    getObserver().observe(el);
    return () => {
      callbacks.delete(el);
      observer?.unobserve(el);
    };
  }, []);

  return {
    ref,
    "data-reveal": true as const,
    style: delay ? { transitionDelay: `${delay * 60}ms` } : undefined,
  };
}

export function Reveal({
  as: Tag = "div",
  delay = 0,
  className,
  children,
}: {
  as?: ElementType;
  delay?: 0 | 1 | 2 | 3;
  className?: string;
  children: ReactNode;
}) {
  const reveal = useReveal<HTMLElement>(delay);

  return (
    <Tag {...reveal} className={className}>
      {children}
    </Tag>
  );
}
