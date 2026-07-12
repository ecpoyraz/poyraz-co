"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown } from "lucide-react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const TARGET = 64_800; // MRR value the counter settles on
const GROWTH = "+38%";

/**
 * Pinned, scroll-scrubbed hero. "You believed" sits alone and blinks while
 * the page is idle at the top. The moment you scroll, the blink stops and
 * the rest of the sentence, the MRR card, and the counter all step forward
 * together with the scrollbar — including the number itself, which counts
 * up (and back down) as you scroll.
 */
export function HeroMrr() {
  const root = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);
  const youRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      gsap.set(".hm-word", { autoAlpha: 0.3, y: 0 });
      gsap.set(".hm-card", { autoAlpha: 0, y: reduced ? 0 : 28 });
      gsap.set(".hm-badge", { autoAlpha: 0, y: reduced ? 0 : 6 });

      const counter = { val: 0 };
      const setCounter = () => {
        const num = numberRef.current;
        if (num) {
          num.textContent = `$${Math.round(counter.val).toLocaleString("en-US")}`;
        }
      };
      setCounter();

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=2800",
          scrub: 1,
          fastScrollEnd: true,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            youRef.current?.classList.toggle(
              "blink-soft",
              self.progress <= 0.001,
            );
          },
          onLeaveBack: () => youRef.current?.classList.add("blink-soft"),
        },
      });

      // "You believed" steps back to muted as the rest of the sentence arrives
      tl.to(
        ".hm-scroll-cue",
        { autoAlpha: 0, y: reduced ? 0 : 8, duration: 0.35, ease: "sine.out" },
        0,
      ).to(
        youRef.current,
        { color: "var(--muted)", duration: 0.5, ease: "power2.out" },
        1.0,
      )
        .to(
          ".hm-word-1",
          { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" },
          1.0,
        )
        .to(
          ".hm-word-2",
          { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" },
          1.9,
        )
        .to(
          ".hm-word-3",
          { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" },
          2.5,
        )
        .to(
          ".hm-card",
          { autoAlpha: 1, y: 0, duration: 0.8, ease: "power2.out" },
          4.0,
        )
        .to(
          counter,
          {
            val: TARGET,
            duration: 2.6,
            ease: "power1.out",
            onUpdate: setCounter,
          },
          4.7,
        )
        .to(
          ".hm-badge",
          { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" },
          7.6,
        );

      // outro — a long hold on the finished state first, then the whole
      // scene fades away before the pin releases, so the next section
      // starts on a clean slate
      tl.to(
        ".hm-scene",
        { autoAlpha: 0, duration: 0.8, ease: "sine.inOut" },
        10.1,
      ).to({}, { duration: 0.3 });
    },
    { scope: root },
  );

  return (
    <div ref={root}>
      <div className="hm-scene relative flex h-[calc(100svh-6.5rem)] flex-col items-center justify-center overflow-hidden px-5">
        {/* the sentence, word by word as you scroll */}
        <h1 className="hero-drift-slow max-w-5xl text-center font-display text-4xl font-normal leading-[1.15] tracking-[-0.02em] sm:text-5xl md:text-6xl lg:text-7xl">
          <span ref={youRef} className="blink-soft text-foreground">
            You believed
          </span>{" "}
          <span className="hm-word hm-word-1 text-foreground">
            great product
          </span>
          <br />
          <span className="hm-word hm-word-2 text-muted">
            would earn you
          </span>{" "}
          <span className="hm-word hm-word-3 text-foreground">money</span>
        </h1>

        <div
          aria-hidden
          className="hm-scroll-cue absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-muted sm:bottom-10"
        >
          <span className="label-mono whitespace-nowrap">Scroll to continue</span>
          <span className="scroll-cue-bob flex size-8 items-center justify-center rounded-full border border-border bg-background/80">
            <ArrowDown className="size-4" strokeWidth={1.5} />
          </span>
        </div>

        {/* the MRR card, follows as you keep scrolling */}
        <div className="hm-card mt-12">
          <div className="hero-drift w-[300px] rounded-lg border border-border bg-card p-8 shadow-[0_24px_80px] shadow-foreground/[0.07] sm:w-[340px]">
            <p className="label-mono text-muted">MRR</p>
            <p className="mt-3 font-display text-5xl font-medium tabular-nums tracking-[-0.02em] text-foreground sm:text-6xl">
              <span ref={numberRef}>$0</span>
            </p>
            <div className="hm-badge mt-5">
              <span className="inline-flex items-center gap-1 rounded-full bg-tag-green/10 px-3 py-1 text-sm font-medium text-tag-green">
                ↑ {GROWTH}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
