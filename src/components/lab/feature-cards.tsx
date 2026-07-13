"use client";

import { useRef } from "react";
import { Check } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const WORDS = ["great features.", "a beautiful UI."];

const NAV_WIDTHS = [72, 58, 66, 50]; // % — varied skeleton bar widths, no labels
const BAR_HEIGHTS = [35, 55, 40, 78, 50, 88]; // %
// A warm, tonal palette keeps the mockup aligned with the site's cream
// background and orange accent without introducing a harsh near-black bar.
const BAR_COLORS = [
  "bg-brand",
  "bg-brand-warm",
  "bg-brand-light",
  "bg-brand",
  "bg-brand-warm",
  "bg-brand-light",
];
const STAT_FILLS = ["bg-brand/12", "bg-brand-warm/12", "bg-brand-light/18"];

/**
 * Pinned, scroll-scrubbed second section. Nothing is visible at rest. The
 * moment you scroll, "You built" fades in, "great features." follows right
 * after, and an app mockup unfurls underneath the line — literally from nothing: the outer frame
 * draws itself in top-down, then the colorless traffic-light dots, then the
 * sidebar, then the page content, all as plain shapes. No copy anywhere in
 * the mockup. Once the wireframe is fully drawn, the
 * headline crossfades to "a beautiful UI." (with a beat of empty space
 * between the fade-out and fade-in, so the two never overlap) and the
 * shapes pick up color.
 *
 * Under prefers-reduced-motion the pin + scrub stay, but every transform
 * (y-shift, scale) collapses to a plain opacity fade.
 */
export function FeatureCards() {
  const root = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const dy = reduced ? 0 : 6;

      const fullHeight = wrapRef.current?.scrollHeight ?? 0;
      gsap.set(wrapRef.current, { height: 0 });

      gsap.set(".fc-lead", { autoAlpha: 0, y: dy });
      gsap.set(".fc-word", { autoAlpha: 0, y: dy });

      gsap.set(".fc-light", { opacity: 0 });
      gsap.set(".fc-sidebar", { autoAlpha: 0 });
      gsap.set(".fc-nav-bar", { scaleX: 0, transformOrigin: "left" });
      gsap.set(".fc-stat-box", { scaleY: 0, transformOrigin: "bottom" });
      gsap.set(".fc-stat-fill", { opacity: 0 });
      gsap.set(".fc-bar-track", { scaleY: 0, transformOrigin: "bottom" });
      gsap.set(".fc-bar-fill", { height: 0 });
      gsap.set(".fc-row-bar", { scaleX: 0, transformOrigin: "left" });
      gsap.set(".fc-row-check", { scale: 0, transformOrigin: "50% 50%" });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=2700",
          scrub: 1.5,
          fastScrollEnd: true,
          pin: true,
          anticipatePin: 1,
        },
      });

      // "You built" rises as the frame unfurls from nothing beneath it, and
      // "great features." fades in — both triggered by the first scroll
      tl.to(
        wrapRef.current,
        { height: fullHeight, duration: 1.1, ease: "power2.inOut" },
        0,
      )
        .to(
          ".fc-lead",
          { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" },
          0.05,
        )
        .to(
          ".fc-word-0",
          { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" },
          0.15,
        );

      // Act I — the wireframe draws itself: frame (via the height reveal
      // above), then the colorless top-left dots, then the sidebar, then
      // the page content — pure shapes, no copy
      tl.to(
        ".fc-light",
        { opacity: 0.5, stagger: 0.08, duration: 0.3, ease: "power2.out" },
        0.35,
      )
        .to(
          ".fc-sidebar",
          { autoAlpha: 1, duration: 0.3, ease: "power2.out" },
          0.55,
        )
        .to(
          ".fc-nav-bar",
          { scaleX: 1, stagger: 0.08, duration: 0.3, ease: "power2.out" },
          0.65,
        )
        .to(
          ".fc-stat-box",
          { scaleY: 1, stagger: 0.1, duration: 0.35, ease: "power2.out" },
          0.75,
        )
        .to(
          ".fc-bar-track",
          { scaleY: 1, stagger: 0.06, duration: 0.3, ease: "power2.out" },
          0.85,
        )
        .to(
          ".fc-row-bar",
          { scaleX: 1, stagger: 0.1, duration: 0.3, ease: "power2.out" },
          0.95,
        )
        .to({}, { duration: 0.3 });

      // Transition → UI — old word fully fades out, a beat of empty space,
      // then the next one fades in, so the two never overlap mid-scroll
      tl.to(".fc-word-0", {
        autoAlpha: 0,
        y: -dy,
        duration: 0.3,
        ease: "power2.in",
      }).to(
        ".fc-word-1",
        { autoAlpha: 1, y: 0, duration: 0.3, ease: "power2.out" },
        "+=0.3",
      );

      // Act II — the shapes pick up color: the wireframe becomes the real thing
      tl.to(".fc-light", {
        opacity: 1,
        stagger: 0.08,
        duration: 0.3,
        ease: "power2.out",
      })
        .to(
          ".fc-stat-fill",
          { opacity: 1, stagger: 0.1, duration: 0.3, ease: "power2.out" },
          "<",
        )
        .to(
          ".fc-row-check",
          { scale: 1, stagger: 0.08, duration: 0.3, ease: "back.out(2)" },
          "<0.1",
        );

      BAR_HEIGHTS.forEach((h, i) => {
        tl.to(
          `.fc-bar-fill-${i}`,
          { height: `${h}%`, duration: 0.35, ease: "power2.out" },
          i === 0 ? "<0.1" : "<0.06",
        );
      });

      // long hold on the finished state, then the whole scene fades away
      // before the pin releases, so the next section starts on a clean slate
      tl.to({}, { duration: 0.9 })
        .to(".fc-scene", { autoAlpha: 0, duration: 0.6, ease: "sine.inOut" })
        .to({}, { duration: 0.25 });
    },
    { scope: root },
  );

  return (
    <div ref={root}>
      <div className="flex h-screen flex-col justify-center overflow-hidden px-5 md:px-10">
        <div className="fc-scene mx-auto w-full max-w-6xl">
          <h2 className="font-display text-4xl font-normal leading-[1.1] tracking-[-0.02em] text-foreground sm:text-6xl">
            <span className="fc-lead inline-block text-muted">You built</span>{" "}
            <span className="relative inline-block align-top">
              <span className="invisible">{WORDS[0]}</span>
              {WORDS.map((word, i) => (
                <span
                  key={word}
                  className={`fc-word fc-word-${i} absolute inset-0 whitespace-nowrap text-foreground`}
                >
                  {word}
                </span>
              ))}
            </span>
          </h2>

          {/* the app mockup: starts at zero height, unfurls from the top down */}
          <div ref={wrapRef} className="overflow-hidden">
            <div className="mt-10 overflow-hidden rounded-2xl border border-brand/15 bg-card shadow-[0_30px_90px] shadow-brand/[0.08]">
              {/* chrome — colorless dots, no url text */}
              <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
                <span className="relative size-2.5">
                  <span className="absolute inset-0 rounded-full bg-border" />
                  <span className="fc-light fc-light-0 absolute inset-0 rounded-full bg-brand" />
                </span>
                <span className="relative size-2.5">
                  <span className="absolute inset-0 rounded-full bg-border" />
                  <span className="fc-light fc-light-1 absolute inset-0 rounded-full bg-brand-warm" />
                </span>
                <span className="relative size-2.5">
                  <span className="absolute inset-0 rounded-full bg-border" />
                  <span className="fc-light fc-light-2 absolute inset-0 rounded-full bg-brand-light" />
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr]">
                {/* sidebar — plain shape bars, no labels */}
                <div className="fc-sidebar hidden flex-col gap-3 border-r border-border p-4 sm:flex">
                  <span className="size-5 rounded-md bg-border" />
                  {NAV_WIDTHS.map((w, i) => (
                    <span
                      key={i}
                      className={`fc-nav-bar fc-nav-bar-${i} h-2 rounded-full bg-subtle`}
                      style={{ width: `${w}%` }}
                    />
                  ))}
                </div>

                {/* main content */}
                <div className="flex flex-col gap-4 p-4 sm:p-6">
                  {/* stat boxes — pure shapes, no copy */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="fc-stat-box relative h-16 overflow-hidden rounded-lg border border-border">
                      <span
                        className={`fc-stat-fill absolute inset-0 ${STAT_FILLS[0]}`}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="h-6 w-16 rounded-md bg-border" />
                      </div>
                    </div>
                    <div className="fc-stat-box relative h-16 overflow-hidden rounded-lg border border-border">
                      <span
                        className={`fc-stat-fill absolute inset-0 ${STAT_FILLS[1]}`}
                      />
                      <div className="absolute inset-0 flex items-center justify-center gap-1.5">
                        <span className="size-2 rounded-full bg-border" />
                        <span className="size-2 rounded-full bg-border" />
                        <span className="size-2 rounded-full bg-border" />
                      </div>
                    </div>
                    <div className="fc-stat-box relative h-16 overflow-hidden rounded-lg border border-border">
                      <span
                        className={`fc-stat-fill absolute inset-0 ${STAT_FILLS[2]}`}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="h-6 w-10 rounded-md bg-border" />
                      </div>
                    </div>
                  </div>

                  {/* chart — shapes only */}
                  <div className="flex h-24 items-end gap-2 rounded-lg border border-border bg-background p-3">
                    {BAR_HEIGHTS.map((_, i) => (
                      <div key={i} className="relative h-full flex-1">
                        <div className="fc-bar-track absolute inset-x-0 bottom-0 h-full rounded-t bg-subtle" />
                        <div
                          className={`fc-bar-fill fc-bar-fill-${i} absolute inset-x-0 bottom-0 rounded-t ${BAR_COLORS[i]}`}
                        />
                      </div>
                    ))}
                  </div>

                  {/* list rows — a check shape + a bar, no labels */}
                  <div className="flex flex-col gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2.5 rounded-md border border-border bg-background px-3 py-2.5"
                      >
                        <span className="fc-row-check flex size-4 flex-none items-center justify-center rounded-full bg-accent/15 text-accent">
                          <Check className="size-3" strokeWidth={3} />
                        </span>
                        <span className="fc-row-bar h-2 flex-1 rounded-full bg-subtle" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
