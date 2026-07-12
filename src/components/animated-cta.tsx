"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const OPENING = ["Don’t", "waste", "your", "time", "and", "money."];

/**
 * A two-beat, scroll-scrubbed closing statement. The first thought builds
 * word by word, recedes, and makes room for the outcome and contact action.
 */
export function AnimatedCta() {
  const root = useRef<HTMLDivElement>(null);
  const scene = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const dy = reduced ? 0 : 18;

      gsap.set(panel.current, {
        autoAlpha: 0,
        y: reduced ? 0 : 64,
      });
      gsap.set(".cta-word", { autoAlpha: 0, y: dy });
      gsap.set(".cta-second", { autoAlpha: 0, y: dy });
      gsap.set(".cta-action", { autoAlpha: 0, y: reduced ? 0 : 12 });
      gsap.set(".cta-rule", { scaleX: 0, transformOrigin: "left center" });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=2800",
          scrub: 1,
          pin: scene.current,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // The card stays completely hidden while approaching the viewport.
      // Once the scene pins, it appears already centered and rises gently
      // into its resting position, matching the preceding story sections.
      tl.to(panel.current, {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
      }).to(
        ".cta-rule",
        { scaleX: 1, duration: 0.8, ease: "power2.out" },
        0.65,
      );

      OPENING.forEach((_, index) => {
        tl.to(
          `.cta-word-${index}`,
          { autoAlpha: 1, y: 0, duration: 0.45, ease: "power2.out" },
          1.15 + index * 0.28,
        );
      });

      tl.to(
          ".cta-first",
          {
            autoAlpha: 0,
            y: reduced ? 0 : -16,
            duration: 0.55,
            ease: "sine.inOut",
          },
          4.35,
        )
        .to(
          panel.current,
          {
            backgroundColor: "#801919",
            duration: 0.65,
            ease: "sine.inOut",
          },
          4.9,
        )
        .to(
          ".cta-second",
          { autoAlpha: 1, y: 0, duration: 0.8, ease: "power2.out" },
          5.55,
        )
        .to(
          ".cta-action",
          { autoAlpha: 1, y: 0, duration: 0.65, ease: "power2.out" },
          6.2,
        )
        .to({}, { duration: 1.1 })
        .to(scene.current, {
          autoAlpha: 0,
          duration: 0.8,
          ease: "sine.inOut",
        })
        .to({}, { duration: 0.3 });
    },
    { scope: root },
  );

  return (
    <div ref={root}>
      <section
        ref={scene}
        className="flex h-screen items-center justify-center"
      >
        <div
          ref={panel}
          className="relative flex h-[72svh] min-h-[34rem] max-h-[52rem] w-full flex-col overflow-hidden rounded-2xl bg-[#0b0b0b] p-7 text-white sm:p-10 md:p-14"
        >
          <div className="flex items-center gap-4">
            <span className="label-mono shrink-0 text-white/45">
              Next move
            </span>
            <span className="cta-rule h-px w-full bg-white/35" />
          </div>

          <div className="my-auto grid items-center">
            <h2 className="cta-first col-start-1 row-start-1 max-w-5xl font-display text-[clamp(2.45rem,7vw,6.5rem)] font-normal leading-[0.98] tracking-[-0.04em]">
              {OPENING.map((word, index) => (
                <span
                  key={word}
                  className={`cta-word cta-word-${index} inline-block ${index === 1 ? "text-brand-light" : ""}`}
                >
                  {word}&nbsp;
                </span>
              ))}
            </h2>

            <div className="cta-second col-start-1 row-start-1 max-w-5xl">
              <p className="font-display text-[clamp(2.45rem,7vw,6.5rem)] font-normal leading-[0.98] tracking-[-0.04em]">
                Let&apos;s work together and create{" "}
                <span className="text-brand-light">real traction.</span>
              </p>
            </div>
          </div>

          <div className="cta-action flex justify-end">
            <Link
              href="/contact"
              className="ml-auto inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-medium text-brand transition hover:bg-white/85"
            >
              Let&apos;s talk
              <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
