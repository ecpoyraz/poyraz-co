"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const TOTAL = 10; // arbitrary line-draw duration, everything below is a fraction of it
const LINE_START = 3.85; // the line only starts once the chart has unfurled

// GSAP rounds stroke-dashoffset to whole px, so the draw range has to be
// large — with pathLength 1 the line snaps from hidden to fully drawn
const PATH_UNITS = 1000;

// `at` values are the line's arc-length fraction when its tip reaches the
// marker's x — measured on the path below, NOT the x-fraction (the early
// bump and trough make arc length run ahead of x)
const START = { key: "launch", x: 40, y: 300, at: TOTAL * 0.02 };

const MARKERS = [
  {
    key: "distribution",
    label: "Distribution",
    x: 500,
    y: 250,
    at: TOTAL * 0.6,
  },
  { key: "activation", label: "Activation", x: 600, y: 150, at: TOTAL * 0.76 },
  { key: "retention", label: "Retention", x: 700, y: 55, at: TOTAL * 0.92 },
];

const Y_AXIS = [
  { y: 270, label: "$2K" },
  { y: 200, label: "$10K" },
  { y: 130, label: "$50K" },
  { y: 60, label: "$100K" },
];

/**
 * Sections 3 + 4 as one continuous, pinned scene on a big red panel that
 * settles over the beige page (slight gaps at the edges, never full-bleed).
 * Nothing is visible at rest — the moment you scroll, the title fades in
 * alone, vertically centered. Then, like the app mockup in the section
 * before it, the chart unfurls from nothing beneath the line of text,
 * pushing the title up, and only once the chart has landed does the
 * revenue line start drawing: a small launch bump, a decline that settles
 * low at "most businesses die here". At that turn the first line fades
 * out and collapses — the chart rides up into its place — and lines 2 + 3
 * ("What actually brings revenue is" + Distribution / Activation /
 * Retention, filling in one at a time) unfurl UNDER the chart with the
 * scroll as the line climbs through each driver.
 */
export function RevenueArc() {
  const root = useRef<HTMLDivElement>(null);
  const chartWrapRef = useRef<HTMLDivElement>(null);
  const title0WrapRef = useRef<HTMLDivElement>(null);
  const bottomWrapRef = useRef<HTMLDivElement>(null);
  const chartSvgRef = useRef<SVGSVGElement>(null);
  const lineRef = useRef<SVGPathElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // The line's stroke lives in user space (no non-scaling-stroke — see the
  // comment on the path), so its on-screen thickness follows the svg's
  // scale. Compensate by sizing the stroke in user units for a ~3px
  // perpendicular thickness at any viewport, re-measured on resize.
  useEffect(() => {
    const sizeLine = () => {
      const svg = chartSvgRef.current;
      const line = lineRef.current;
      if (!svg || !line) return;
      const h = svg.getBoundingClientRect().height;
      if (h > 0) line.style.strokeWidth = `${(3.25 * 360) / h}`;
    };
    sizeLine();
    const ro = new ResizeObserver(sizeLine);
    if (chartSvgRef.current) ro.observe(chartSvgRef.current);
    return () => ro.disconnect();
  }, []);

  useGSAP(
    () => {
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const dy = reduced ? 0 : 10;

      // the chart and the bottom lines start at zero height, so the title
      // sits alone in the vertical center — unfurling them later moves the
      // layout naturally
      gsap.set(chartWrapRef.current, { height: 0 });
      gsap.set(bottomWrapRef.current, { height: 0 });

      gsap.set(".ra-line", { strokeDashoffset: PATH_UNITS });
      gsap.set(".ra-title-1", { autoAlpha: 0, y: dy });
      gsap.set(".ra-tag", { autoAlpha: 0, y: reduced ? 0 : 8 });
      gsap.set(".ra-word", { autoAlpha: 0, y: reduced ? 0 : 8 });
      gsap.set(".ra-marker", { scale: 0, transformOrigin: "50% 50%" });
      gsap.set(".ra-intro-title", { autoAlpha: 0, y: reduced ? 0 : 26 });

      const sharedBackground =
        root.current?.closest<HTMLElement>(".story-three-four");
      if (!sharedBackground) return;
      gsap.set(sharedBackground, { backgroundColor: "#801919" });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=5200",
          scrub: 1.5,
          fastScrollEnd: true,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Act 0 — the title fades in alone, centered on the screen, slow and
      // soft enough to register as its own beat…
      tl.to(
        ".ra-intro-title",
        { autoAlpha: 1, y: 0, duration: 1.0, ease: "sine.inOut" },
        0.95,
      );

      // …then the chart unfurls from nothing beneath it, pushing the title
      // up to its final spot — same move as the mockup one section earlier.
      // All the height moves below are fromTo with functional endpoints:
      // a plain to() snapshots its start value on first render and keeps
      // it through refreshes, so a font swap or resize leaves a stale
      // fixed height on these overflow-hidden wrappers (the title showed
      // up clipped at some widths). fromTo re-derives both ends from the
      // live DOM on every invalidateOnRefresh.
      tl.fromTo(
        chartWrapRef.current,
        { height: 0 },
        {
          height: () => chartWrapRef.current?.scrollHeight ?? 0,
          duration: 1.6,
          ease: "power2.inOut",
          immediateRender: false,
        },
        2.15,
      );

      // only once the chart has landed does the line start drawing
      tl.fromTo(
        ".ra-line",
        { strokeDashoffset: PATH_UNITS },
        { strokeDashoffset: 0, duration: TOTAL, immediateRender: false },
        LINE_START,
      );

      // launch dot + label, right as the line leaves the origin
      tl.to(
        ".ra-marker-launch",
        { scale: 1, duration: 0.3, ease: "back.out(2)" },
        LINE_START + START.at + 0.15,
      )
        .to(
          ".ra-tag-launch",
          { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" },
          LINE_START + START.at + 0.2,
        )
        .to(
          ".ra-tag-trough",
          { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" },
          LINE_START + TOTAL * 0.4,
        );

      // the turn: once the line has bottomed out at the trough, line 1 has
      // made its point — it fades away and its space collapses, riding the
      // chart up to where the title used to sit
      const turnAt = LINE_START + TOTAL * 0.44;
      tl.to(
        ".ra-title-0",
        { autoAlpha: 0, y: -dy, duration: 0.5, ease: "sine.inOut" },
        turnAt,
      );

      // The chart's ride-up is one continuous move, not three: every layout
      // change that shifts it — the title collapsing above, the whole block
      // translating up, and the second line unfurling below — runs on the
      // SAME start, duration and ease. Sequencing them (as before) let each
      // motion stop and the next start, and under scrub that stop/start read
      // as the chart nudging up then down. Starting the collapse only after
      // the title has fully faded also keeps its text from squishing while
      // still visible. riseAt/riseDur keep the three tweens locked together.
      const riseAt = turnAt + 0.5;
      const riseDur = 0.9;
      const riseEase = "power2.inOut";

      tl.fromTo(
        title0WrapRef.current,
        { height: () => title0WrapRef.current?.scrollHeight ?? 0 },
        {
          height: 0,
          duration: riseDur,
          ease: riseEase,
          immediateRender: false,
        },
        riseAt,
      );

      // the collapse alone only frees the title's height, which vertical
      // centering splits in half — push the whole block further up so the
      // chart clearly claims the top of the panel (desktop has the shorter
      // chart and the headroom; mobile is already balanced)
      tl.fromTo(
        contentRef.current,
        { y: 0 },
        {
          y: () => (window.innerWidth >= 640 ? -window.innerHeight * 0.1 : 0),
          duration: riseDur,
          ease: riseEase,
          immediateRender: false,
        },
        riseAt,
      );

      // the second line unfurls underneath the chart in the same breath —
      // its copy stays invisible until later, so only the empty space opens
      // here and the net height change stays smooth instead of bumping twice
      tl.fromTo(
        bottomWrapRef.current,
        { height: 0 },
        {
          height: () => bottomWrapRef.current?.scrollHeight ?? 0,
          duration: riseDur,
          ease: riseEase,
          immediateRender: false,
        },
        riseAt,
      ).to(
        ".ra-title-1",
        { autoAlpha: 1, y: 0, duration: 0.45, ease: "sine.out" },
        riseAt + riseDur + 0.2,
      );

      // act II markers, as the line climbs through each driver — the dot,
      // its name on the chart and the same word on line 3 under the chart
      // all land together, in step with the line tip passing through
      MARKERS.forEach((m) => {
        tl.to(
          `.ra-marker-${m.key}`,
          { scale: 1, duration: 0.4, ease: "back.out(2)" },
          LINE_START + m.at + 0.25,
        )
          .to(
            `.ra-tag-${m.key}`,
            { autoAlpha: 1, y: 0, duration: 0.35, ease: "power2.out" },
            LINE_START + m.at + 0.35,
          )
          .to(
            `.ra-word-${m.key}`,
            { autoAlpha: 1, y: 0, duration: 0.35, ease: "power2.out" },
            LINE_START + m.at + 0.25,
          );
      });

      // Outro — hold the completed chart, fade every item out completely,
      // then leave a short beat on the empty red surface before changing
      // that same background to black. Keeping these moments sequential
      // makes the handoff read as one surface changing state, not a second
      // panel arriving over the first.
      const outroAt = LINE_START + TOTAL + 1.2;
      tl.to(
        contentRef.current,
        { autoAlpha: 0, duration: 0.7, ease: "sine.inOut" },
        outroAt,
      )
        .fromTo(
          sharedBackground,
          { backgroundColor: "#801919" },
          {
            backgroundColor: "#1f0808",
            duration: 0.8,
            ease: "sine.inOut",
            immediateRender: false,
          },
          outroAt + 1.15,
        )
        .to({}, { duration: 0.3 });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="-mt-[70vh]">
      {/* the scene breaks out to full width so the red panel can run nearly
          edge to edge over the beige page; palette vars are re-scoped to
          light-on-red so every text/border/accent utility follows */}
      <div
        className="ra-scene relative ml-[calc(50%-50vw)] flex h-screen w-screen flex-col justify-center overflow-hidden px-5 md:px-10"
        style={
          {
            "--foreground": "#f3efe8",
            "--muted": "rgba(243, 239, 232, 0.66)",
            "--border": "rgba(243, 239, 232, 0.24)",
            "--accent": "#f3efe8",
          } as React.CSSProperties
        }
      >
        <div
          ref={contentRef}
          className="relative z-10 mx-auto w-[min(92vw,90rem)] max-w-none -translate-y-4 sm:translate-y-0"
        >
          <div className="ra-intro-title">
            <div ref={title0WrapRef} className="overflow-hidden">
              <h2 className="ra-title-0 font-display text-5xl font-normal leading-[1.02] tracking-[-0.03em] text-foreground sm:text-6xl">
                But it didn&apos;t work as you expected.
              </h2>
            </div>
          </div>

          {/* the chart: starts at zero height, unfurls from the top down */}
          <div ref={chartWrapRef} className="overflow-hidden">
            <div className="ra-intro-chart relative mt-3 w-full sm:mt-8">
              {/* the viewBox stays 800x360 but the rendered aspect differs
                per breakpoint: taller on mobile (800/520), 30% shorter on
                desktop (800/250). preserveAspectRatio=none stretches the
                geometry; text and dots carry a counter scale-y so they
                keep their true proportions (0.6923 = 360/520, 1.44 = 360/250) */}
              <svg
                ref={chartSvgRef}
                viewBox="0 0 800 360"
                preserveAspectRatio="none"
                className="aspect-[800/520] w-full sm:aspect-[800/250]"
                aria-hidden
              >
                {Y_AXIS.map(({ y }) => (
                  <line
                    key={y}
                    x1="40"
                    y1={y}
                    x2="760"
                    y2={y}
                    stroke="var(--border)"
                    strokeWidth="1"
                    vectorEffect="non-scaling-stroke"
                  />
                ))}
                <line
                  x1="40"
                  y1="320"
                  x2="760"
                  y2="320"
                  stroke="var(--muted)"
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                />
                {/* y-axis MRR benchmarks — anchored inside the viewBox just
                  above each gridline; end-anchored at x=34 they overflowed
                  the left edge and got clipped */}
                {Y_AXIS.map(({ y, label }) => (
                  <text
                    key={y}
                    x="40"
                    y={y - 7}
                    textAnchor="start"
                    className="label-mono origin-center scale-y-[0.6923] text-[16px] [transform-box:fill-box] sm:scale-y-[1.44] sm:text-[11px]"
                    fill="var(--muted)"
                  >
                    {label}
                  </text>
                ))}
                {/* axis title — the taller mobile chart doesn't need it,
                  it only crowds the trough tag there */}
                <text
                  x="760"
                  y="344"
                  textAnchor="end"
                  className="label-mono hidden origin-center text-[11px] [transform-box:fill-box] sm:block sm:scale-y-[1.44]"
                  fill="var(--muted)"
                >
                  Time
                </text>

                {/* one continuous line: launch bump, decline, trough, then climb —
                  the trough stays just above the x-axis, never below it */}
                {/* NO non-scaling-stroke here, on purpose: with it Chrome
                  measures dash distances in screen pixels and ignores the
                  pathLength normalization, so on wide screens the 1000-unit
                  dash pattern repeats mid-path (the line renders with a
                  hole) and on the stretched mobile chart the draw-on runs
                  ahead of the scheduled offset. In user space the dash
                  math is exact everywhere; the effect above compensates
                  the stroke thickness for the svg's scale */}
                <path
                  ref={lineRef}
                  className="ra-line"
                  d="M 40 300
                   C 90 275 130 250 160 248
                   C 220 245 260 270 300 300
                   C 330 310 350 315 380 315
                   C 420 313 460 293 500 250
                   C 550 210 580 180 600 150
                   C 650 100 680 70 700 55
                   C 720 45 740 38 760 30"
                  fill="none"
                  stroke="var(--accent)"
                  strokeLinecap="round"
                  pathLength={PATH_UNITS}
                  strokeDasharray={PATH_UNITS}
                />

                {/* launch dot — same plain style used along the rest of the line */}
                <g className="ra-marker ra-marker-launch">
                  <circle
                    cx={START.x}
                    cy={START.y}
                    r="6"
                    fill="var(--accent)"
                    className="origin-center scale-y-[0.6923] [transform-box:fill-box] sm:scale-y-[1.44]"
                  />
                </g>

                {/* driver dots — bigger and glowing, no blinking: a static halo ring
                  plus a solid center reads as "the payoff" without being noisy */}
                {MARKERS.map((m) => (
                  <g
                    key={m.key}
                    className={`ra-marker ra-marker-${m.key}`}
                    style={{ filter: "drop-shadow(0 0 6px var(--accent))" }}
                  >
                    <circle
                      cx={m.x}
                      cy={m.y}
                      r="13"
                      fill="var(--accent)"
                      opacity="0.18"
                      className="origin-center scale-y-[0.6923] [transform-box:fill-box] sm:scale-y-[1.44]"
                    />
                    <circle
                      cx={m.x}
                      cy={m.y}
                      r="7"
                      fill="var(--accent)"
                      className="origin-center scale-y-[0.6923] [transform-box:fill-box] sm:scale-y-[1.44]"
                    />
                  </g>
                ))}
              </svg>

              <span
                className="ra-tag ra-tag-launch label-mono absolute -translate-y-1/2 text-[10px] text-muted sm:text-[11px]"
                style={{ left: "8%", top: "83.3%" }}
              >
                launch day
              </span>
              <span className="ra-tag ra-tag-trough label-mono absolute left-[42%] top-[91%] text-[10px] text-muted sm:text-[11px]">
                most businesses die here
              </span>
              {MARKERS.map((m) => (
                <span
                  key={m.key}
                  className={`ra-tag ra-tag-${m.key} label-mono absolute -translate-x-1/2 text-[10px] text-accent sm:text-[11px]`}
                  style={{
                    left: `${(m.x / 800) * 100}%`,
                    top: `calc(${(m.y / 360) * 100}% - 38px)`,
                  }}
                >
                  {m.label}
                </span>
              ))}
            </div>
          </div>

          {/* lines 2 + 3 — collapsed until the turn, then they unfurl UNDER
              the chart and fill in with the scroll */}
          <div ref={bottomWrapRef} className="overflow-hidden">
            <div className="ra-bottom flex flex-col gap-1 pt-4 sm:pt-10">
              <h2 className="ra-title-1 font-display text-4xl font-normal leading-[1.05] tracking-[-0.02em] text-foreground sm:text-4xl">
                What actually brings revenue is
              </h2>
              <div className="flex flex-wrap items-baseline gap-x-2 font-display text-5xl font-normal leading-[0.98] tracking-[-0.03em] sm:text-5xl">
                {MARKERS.map((m, i) => (
                  <span
                    key={m.key}
                    className={`ra-word ra-word-${m.key} text-accent`}
                  >
                    {m.label}
                    {i < MARKERS.length - 1 ? "," : "."}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
