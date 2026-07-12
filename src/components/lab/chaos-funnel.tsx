"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Bell, Download, Mail, Smartphone } from "lucide-react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// icon-only badges, no labels — an outlined card (background matches the
// page, only the border reads) that holds either a lucide icon or a brand
// mark. Both render in `currentColor`, so the one `color` transition on
// this wrapper takes the whole badge from monochrome to its real color.
// Centered on its own top/left point via translate(-50%,-50%)
const BADGE_CLASS =
  "flex items-center justify-center rounded-2xl border border-border/60 bg-background text-foreground size-16 sm:size-18";
const CENTERED = { transform: "translate(-50%, -50%)" } as const;

// brand marks are shipped as flat SVGs and reused as a CSS mask so they sit
// monochrome next to the lucide icons — same trick the old logo strip used.
// bg-current means they inherit whatever `color` the badge wrapper is at.
function BrandMark({ slug, className }: { slug: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={`inline-block shrink-0 bg-current ${className ?? "size-7 sm:size-8"}`}
      style={{
        maskImage: `url(/images/logos/${slug}.svg)`,
        WebkitMaskImage: `url(/images/logos/${slug}.svg)`,
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskPosition: "center",
        WebkitMaskPosition: "center",
      }}
    />
  );
}

const ICON_CLASS = "size-7 sm:size-8 shrink-0";

// real brand colors for the ad-channel logos, and the site's own tag palette
// (resolved from CSS variables at runtime, so it follows light/dark theme)
// for the product icons — applied once each badge lands in the flow
const BRAND_COLOR: Record<string, string> = {
  meta: "#0467DF",
  instagram: "#E4405F",
  "google-ads": "#4285F4",
  "apple-search-ads": "#1d1d1f", // the flow lands on the beige page, dark mark reads fine
};

// product icons pick up the tag palette scoped to this section — read live
// from CSS so the on-dark overrides on the scene element are respected
function flowColorFor(key: string, scope: Element): string {
  if (BRAND_COLOR[key]) return BRAND_COLOR[key];
  const styles = getComputedStyle(scope);
  const read = (v: string) => styles.getPropertyValue(v).trim();
  switch (key) {
    case "download":
      return read("--tag-blue");
    case "mobile-app":
      return read("--tag-purple");
    case "email":
      return read("--tag-orange");
    case "push-notification":
      return read("--tag-blue");
    case "revenue":
      return read("--tag-green");
    default:
      return "currentColor";
  }
}

// piled up tight under the headline — one dense row of overlapping badges,
// each ~half a badge-width from the next with a little vertical jitter and
// alternating tilts, so they read like a messy strip of app icons, no gaps.
// Offsets are px from the section center; below ~600px viewports they
// scale down with vw (via min/max) so the row never clips off-screen.
// Declared in the order they later travel the pipeline. flowTop/flowLeft
// place the same node inside the automation-flow diagram below, on the
// exact 800x240 coordinate grid the desktop connector paths use — the
// finished system reads left to right, converging on revenue at the right
// edge. Below sm the flow uses MOBILE_FLOW_POS / MOBILE_CONNECTORS instead
// and reads top to bottom.
const pileAt = (x: number, y: number) => {
  const vw = `${(x / 6).toFixed(2)}vw`;
  const offset = x >= 0 ? `min(${x}px, ${vw})` : `max(${x}px, ${vw})`;
  return {
    top: `calc(54% + ${y}px)`,
    left: `calc(50% + ${offset})`,
  };
};

const ITEMS: {
  key: string;
  icon: ReactNode;
  top: string;
  left: string;
  rotate: number;
  flowTop: number;
  flowLeft: number;
}[] = [
  {
    key: "meta",
    icon: <BrandMark slug="meta" />,
    ...pileAt(-208, -8),
    rotate: -10,
    flowTop: 8,
    flowLeft: 10,
  },
  {
    key: "instagram",
    icon: <BrandMark slug="instagram" />,
    ...pileAt(-156, 6),
    rotate: 8,
    flowTop: 36,
    flowLeft: 10,
  },
  {
    key: "google-ads",
    icon: <BrandMark slug="googleads" />,
    ...pileAt(-104, -6),
    rotate: -6,
    flowTop: 64,
    flowLeft: 10,
  },
  {
    key: "apple-search-ads",
    icon: <BrandMark slug="apple" />,
    ...pileAt(-52, 8),
    rotate: 10,
    flowTop: 92,
    flowLeft: 10,
  },
  {
    key: "download",
    icon: <Download className={ICON_CLASS} />,
    ...pileAt(0, -8),
    rotate: 7,
    flowTop: 50,
    flowLeft: 30,
  },
  {
    key: "mobile-app",
    icon: <Smartphone className={ICON_CLASS} />,
    ...pileAt(52, 6),
    rotate: -8,
    flowTop: 50,
    flowLeft: 50,
  },
  {
    key: "email",
    icon: <Mail className={ICON_CLASS} />,
    ...pileAt(104, -6),
    rotate: 9,
    flowTop: 30,
    flowLeft: 70,
  },
  {
    key: "push-notification",
    icon: <Bell className={ICON_CLASS} />,
    ...pileAt(156, 8),
    rotate: -5,
    flowTop: 70,
    flowLeft: 70,
  },
];

const FLOW_ORDER = ITEMS.map((_, i) => i);

// Connector wiring on the 800x240 grid. The direction is left-to-right:
// four channels merge into download, continue through the product, fork
// into lifecycle touchpoints and converge on revenue.
const CONNECTORS: { d: string; targetIdx: number }[] = [
  { d: "M80,19 L150,19 L150,120 L240,120", targetIdx: 4 },
  { d: "M80,86 L150,86 L150,120 L240,120", targetIdx: 4 },
  { d: "M80,154 L150,154 L150,120 L240,120", targetIdx: 4 },
  { d: "M80,221 L150,221 L150,120 L240,120", targetIdx: 4 },
  { d: "M240,120 L400,120", targetIdx: 5 },
  { d: "M400,120 L470,120 L470,72 L560,72", targetIdx: 6 },
  { d: "M400,120 L470,120 L470,168 L560,168", targetIdx: 7 },
  { d: "M560,72 L620,72 L620,120", targetIdx: 6 },
  { d: "M560,168 L620,168 L620,120 L620,240", targetIdx: 7 },
];

// Mobile rewires the same nodes onto a 360x480 portrait grid, so the flow
// reads top to bottom instead: the four channels sit in a row up top and
// merge down into download, the product follows, forks into email / push,
// and the merge drops through the bottom edge onto "revenue". Node centers
// below are grid units; ghost percentages derive from them (x/360, y/480).
const MOBILE_FLOW_POS: Record<string, { top: number; left: number }> = {
  meta: { left: 12.5, top: 8.33 },
  instagram: { left: 37.5, top: 8.33 },
  "google-ads": { left: 62.5, top: 8.33 },
  "apple-search-ads": { left: 87.5, top: 8.33 },
  download: { left: 50, top: 33.33 },
  "mobile-app": { left: 50, top: 56.25 },
  email: { left: 25, top: 80.2 },
  "push-notification": { left: 75, top: 80.2 },
};

// same wiring order and reveal targets as CONNECTORS, rotated vertical —
// the last two (email / push merge) are rewritten at runtime to land on
// the word "revenue", exactly like the desktop pair
const MOBILE_CONNECTORS: { d: string; targetIdx: number }[] = [
  { d: "M45,74 L45,100 L180,100 L180,126", targetIdx: 4 },
  { d: "M135,74 L135,100 L180,100 L180,126", targetIdx: 4 },
  { d: "M225,74 L225,100 L180,100 L180,126", targetIdx: 4 },
  { d: "M315,74 L315,100 L180,100 L180,126", targetIdx: 4 },
  { d: "M180,194 L180,236", targetIdx: 5 },
  { d: "M180,304 L180,328 L90,328 L90,351", targetIdx: 6 },
  { d: "M180,304 L180,328 L270,328 L270,351", targetIdx: 7 },
  { d: "M90,419 L90,450 L180,450", targetIdx: 6 },
  { d: "M270,419 L270,450 L180,450 L180,480", targetIdx: 7 },
];

// below Tailwind's sm breakpoint the flow flips to the portrait grid
function useIsMobileFlow() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const onChange = () => setIsMobile(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return isMobile;
}

/**
 * Pinned, scroll-scrubbed section in two acts. Act I: "Competition is
 * harder than ever. So is marketing." builds while monochrome icon-only
 * badges (ad logos and product icons) pile in, tightly overlapping and
 * tilted, below it — the mess a marketer is supposed to juggle. Act II,
 * same section, still scrolling: the headline swaps to "I orchestrate
 * this, from chaos to revenue.", a wired automation-flow diagram draws in,
 * and every badge in the pile physically travels into its node in the
 * pipeline, straightening and picking up its real color on the way. Each
 * connecting pipe fades in once its node has landed, keeping a soft
 * endless dash flowing along it, and the last pipe elbows down onto the
 * word "revenue" itself.
 */
export function ChaosFunnel() {
  const root = useRef<HTMLDivElement>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const flowShellRef = useRef<HTMLDivElement>(null);
  const tickWrapRef = useRef<HTMLDivElement>(null);
  const tickPathRef = useRef<SVGPathElement>(null);
  const revenueWordRef = useRef<HTMLSpanElement>(null);
  const isMobile = useIsMobileFlow();

  // Mail and push merge directly onto the real "revenue" word's axis. The
  // merge continues to the bottom of the flow SVG, then the closing pipe
  // resumes on the exact same vertical axis — remeasured on resize. The
  // merge rows differ per grid: right edge on desktop, bottom on mobile.
  useEffect(() => {
    const update = () => {
      const shell = flowShellRef.current;
      const wrap = tickWrapRef.current;
      const path = tickPathRef.current;
      const word = revenueWordRef.current;
      const mailPath = pathRefs.current[7];
      const pushPath = pathRefs.current[8];
      if (!shell || !wrap || !path || !word || !mailPath || !pushPath) return;
      const shellRect = shell.getBoundingClientRect();
      const wrapRect = wrap.getBoundingClientRect();
      const wordRect = word.getBoundingClientRect();
      const wordCenter = wordRect.left + wordRect.width / 2;
      const gridWidth = isMobile ? 360 : 800;
      const mergeX =
        ((wordCenter - shellRect.left) / shellRect.width) * gridWidth;
      const toX = wordCenter - wrapRect.left;
      const h = wrapRect.height;
      if (isMobile) {
        mailPath.setAttribute("d", `M90,419 L90,450 L${mergeX},450`);
        pushPath.setAttribute(
          "d",
          `M270,419 L270,450 L${mergeX},450 L${mergeX},480`,
        );
      } else {
        mailPath.setAttribute("d", `M560,72 L${mergeX},72 L${mergeX},120`);
        pushPath.setAttribute(
          "d",
          `M560,168 L${mergeX},168 L${mergeX},120 L${mergeX},240`,
        );
      }
      path.setAttribute("d", `M${toX},0 L${toX},${h}`);
    };
    update();
    // the word's position shifts as the display font lands and as
    // ScrollTrigger pins re-measure the layout — track all of it
    document.fonts?.ready.then(update);
    ScrollTrigger.addEventListener("refresh", update);
    const ro = new ResizeObserver(update);
    if (flowShellRef.current) ro.observe(flowShellRef.current);
    if (tickWrapRef.current) ro.observe(tickWrapRef.current);
    if (revenueWordRef.current) ro.observe(revenueWordRef.current);
    window.addEventListener("resize", update);
    return () => {
      ScrollTrigger.removeEventListener("refresh", update);
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [isMobile]);

  useGSAP(
    () => {
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const dy = reduced ? 0 : 10;
      const sharedBackground = root.current?.closest<HTMLElement>(
        ".story-three-four",
      );
      if (!sharedBackground) return;

      gsap.set(".cf-act1 span", { autoAlpha: 0, y: dy });
      gsap.set(".cf-act2 span", { autoAlpha: 0, y: dy });
      gsap.set(".cf-punch-2", { autoAlpha: 0, y: dy });
      gsap.set(".cf-flow-shell", { autoAlpha: 0 });
      gsap.set(".cf-connector", { autoAlpha: 0 });
      gsap.set(".cf-ghost", { autoAlpha: 0 });
      ITEMS.forEach((chip, i) => {
        gsap.set(`.cf-fly-${i}`, {
          autoAlpha: 0,
          rotation: chip.rotate,
          transformOrigin: "50% 50%",
        });
      });
      // act I plays on the black panel, so the piled badges start in their
      // on-dark outfit — they dress back down for the beige page at the turn
      gsap.set(".cf-fly", {
        backgroundColor: "#1f0808",
        borderColor: "rgba(253, 251, 248, 0.4)",
        color: "#fdfbf8",
      });

      // once a pipe is revealed it keeps a soft, endless dash flowing along
      // it — an independent loop, decoupled from the scroll-scrubbed reveal
      if (!reduced) {
        pathRefs.current.forEach((path) => {
          if (!path) return;
          gsap.to(path, {
            strokeDashoffset: -24,
            duration: 1.4,
            repeat: -1,
            ease: "none",
          });
        });
      }

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=8000",
          scrub: 1,
          fastScrollEnd: true,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // act I plays on a big near-black panel that settles over the beige
      // page — slight gaps at the edges, never full-bleed
      const scope =
        root.current?.querySelector(".cf-scene") ?? document.documentElement;

      // Snapshot every destination before the timeline starts. Keeping both
      // axes in one immutable vector prevents a later DOM measurement from
      // introducing an intermediate waypoint while the scene is scrubbed.
      const landingOffsets = ITEMS.map((_, i) => {
        const source = root.current?.querySelector<HTMLElement>(`.cf-fly-${i}`);
        const target = root.current?.querySelector<HTMLElement>(
          `.cf-ghost-${i}`,
        );
        if (!source || !target) return { x: 0, y: 0 };
        const from = source.getBoundingClientRect();
        const to = target.getBoundingClientRect();
        return {
          x: to.left + to.width / 2 - (from.left + from.width / 2),
          y: to.top + to.height / 2 - (from.top + from.height / 2),
        };
      });

      // ── Act I: the chaos ──────────────────────────────────────────────
      // the headline first appears alone, vertically centered on the
      // panel; once both lines have landed it rides up to its natural
      // spot and the badge pile takes the stage beneath it
      const heads = root.current?.querySelector<HTMLElement>(".cf-heads");
      const sceneEl = root.current?.querySelector<HTMLElement>(".cf-scene");
      // core layout choreography, so it plays under reduced motion too —
      // same convention as the badge travel and the height unfurls
      let headsCenterOffset = 0;
      if (heads && sceneEl) {
        const hr = heads.getBoundingClientRect();
        const sr = sceneEl.getBoundingClientRect();
        headsCenterOffset = sr.top + sr.height / 2 - (hr.top + hr.height / 2);
      }

      tl.fromTo(
        ".cf-heads",
        { y: headsCenterOffset },
        { y: 0, duration: 0.8, ease: "power2.inOut" },
        1.7,
      );

      tl.to(
        ".cf-lead-1",
        { autoAlpha: 1, y: 0, duration: 0.7, ease: "sine.out" },
        0.3,
      ).to(
        ".cf-punch-1",
        { autoAlpha: 1, y: 0, duration: 0.7, ease: "sine.out" },
        1.2,
      );

      ITEMS.forEach((_, i) => {
        tl.to(
          `.cf-fly-${i}`,
          { autoAlpha: 1, duration: 0.9, ease: "sine.inOut" },
          2.1 + i * 0.22,
        );
      });

      // ── the turn: same section, new claim — the black panel lifts, the
      // beige page returns, and the piled badges swap to their on-light
      // outfit in the same breath
      tl.to(".cf-act1", {
        autoAlpha: 0,
        y: -dy,
        duration: 0.7,
        ease: "sine.inOut",
      })
        .fromTo(
          sharedBackground,
          { backgroundColor: "#1f0808" },
          {
            backgroundColor: "#fdfbf8",
            duration: 0.7,
            ease: "sine.inOut",
            immediateRender: false,
          },
          "<",
        )
        .to(
          ".cf-fly",
          {
            backgroundColor: "#fdfbf8",
            borderColor: "rgba(163, 152, 131, 0.45)",
            color: "#0c0c0a",
            duration: 0.7,
            ease: "sine.inOut",
          },
          "<",
        )
        .to(
          ".cf-lead-2",
          { autoAlpha: 1, y: 0, duration: 0.7, ease: "sine.out" },
          "+=0.1",
        );

      // The empty flow canvas eases in first. It gives the moving cards a
      // destination without revealing their final copies prematurely.
      tl.to(
        ".cf-flow-shell",
        { autoAlpha: 1, duration: 0.9, ease: "power2.out" },
        6.5,
      );

      // ── Act II: orchestrate the pile ──────────────────────────────────
      // The same visible cards travel into the diagram. The four acquisition
      // channels fan out together; the downstream steps then land in sequence,
      // making the structure readable as it is built rather than after it.
      const flowAt = (k: number) =>
        7.0 + (k < 4 ? k * 0.12 : 0.7 + (k - 4) * 0.34);
      FLOW_ORDER.forEach((chipIdx, k) => {
        const at = flowAt(k);
        const color = flowColorFor(ITEMS[chipIdx].key, scope);
        tl.to(
          `.cf-fly-${chipIdx}`,
          {
            x: landingOffsets[chipIdx].x,
            y: landingOffsets[chipIdx].y,
            rotation: 0,
            scale: 0.96,
            color,
            borderColor: "rgba(163, 152, 131, 0.34)",
            boxShadow: "0 18px 45px rgba(64, 46, 28, 0.10)",
            duration: reduced ? 0.55 : 1.05,
            ease: reduced ? "sine.inOut" : "power3.inOut",
          },
          at,
        )
          .to(
            `.cf-fly-${chipIdx}`,
            {
              scale: 1,
              boxShadow: "0 0 0 rgba(64, 46, 28, 0)",
              duration: 0.22,
              ease: "back.out(1.8)",
            },
            at + (reduced ? 0.5 : 0.98),
          )
          .to(
            `.cf-ghost-${chipIdx}`,
            { autoAlpha: 1, color, duration: 0.12, ease: "none" },
            at + (reduced ? 0.62 : 1.12),
          )
          .to(
            `.cf-fly-${chipIdx}`,
            { autoAlpha: 0, duration: 0.12, ease: "none" },
            "<",
          );
      });

      // Each pipe begins flowing only after its destination has clicked into
      // place. This makes the direction of the system legible at a glance.
      CONNECTORS.forEach((c, i) => {
        const at = flowAt(c.targetIdx) + (reduced ? 0.7 : 1.2);
        tl.to(
          `.cf-connector-${i}`,
          { autoAlpha: 1, duration: 0.45, ease: "sine.inOut" },
          at,
        );
      });

      // the last pipe rides down from the diagram into the word it all
      // leads to — the payoff line is already fading in underneath it so
      // the dashes land on "revenue" itself
      const endAt = flowAt(FLOW_ORDER.length - 1) + 1.5;
      tl.to(
        ".cf-punch-2",
        { autoAlpha: 1, y: 0, duration: 0.7, ease: "sine.inOut" },
        endAt,
      )
        .to(
          ".cf-connector-tick",
          { autoAlpha: 1, duration: 0.6, ease: "sine.inOut" },
          endAt + 0.3,
        )
        .to(
          ".cf-word-revenue",
          {
            color: flowColorFor("revenue", scope),
            duration: 0.5,
            ease: "sine.out",
          },
          endAt + 0.7,
        );

      // outro — a long hold on the finished state first, then the whole
      // scene fades away before the pin releases, so the next section
      // starts on a clean slate
      tl.to(
        ".cf-scene",
        { autoAlpha: 0, duration: 0.7, ease: "sine.inOut" },
        endAt + 2.6,
      ).to({}, { duration: 0.3 });
    },
    // crossing the sm breakpoint swaps the flow grid, so the whole scene
    // (including the measured landing offsets) has to rebuild
    { scope: root, dependencies: [isMobile], revertOnUpdate: true },
  );

  return (
    <div ref={root} className="-mt-[100svh]">
      {/* the scene breaks out to full width so the black panel of act I can
          run full-bleed over the beige page — the same surface the revenue
          panel handed off in red, now black; act II plays on the beige
          page itself, so no palette re-scoping here */}
      <div className="cf-scene relative ml-[calc(50%-50vw)] flex h-screen w-screen flex-col items-center justify-center overflow-hidden px-5 md:px-10">
        {/* The badges are the actual moving objects: the pile straightens,
            picks up color and lands on the matching flow coordinates. */}
        {ITEMS.map((chip, i) => (
          <span
            key={chip.key}
            className={`cf-fly cf-fly-${i} absolute z-30 ${BADGE_CLASS}`}
            style={{ top: chip.top, left: chip.left, ...CENTERED }}
          >
            {chip.icon}
          </span>
        ))}

        {/* both headlines stacked in the same spot; act I crossfades to act II */}
        <div className="cf-heads relative z-20 grid max-w-4xl place-items-center text-center font-display text-4xl font-normal leading-[1.15] tracking-[-0.02em] sm:text-6xl">
          <h2 className="cf-act1 col-start-1 row-start-1">
            <span className="cf-lead-1 inline-block text-[#cfc9bd]">
              Competition is harder than ever.
            </span>{" "}
            <br />
            <span className="cf-punch-1 inline-block text-[#f3efe8]">
              So is marketing.
            </span>
          </h2>
          <h2 className="cf-act2 col-start-1 row-start-1">
            <span className="cf-lead-2 inline-block text-foreground">
              I orchestrate this,
            </span>
          </h2>
        </div>

        {/* the automation flow — a wired diagram; each node materializes in
            place, in its own color, as the connecting pipes draw in */}
        <div
          ref={flowShellRef}
          className={`cf-flow-shell relative z-10 mt-8 w-full sm:mt-10 ${
            isMobile
              ? "aspect-[360/480] max-w-sm"
              : "aspect-[800/240] max-w-6xl"
          }`}
        >
          <svg
            viewBox={isMobile ? "0 0 360 480" : "0 0 800 240"}
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full text-border"
            aria-hidden
          >
            {(isMobile ? MOBILE_CONNECTORS : CONNECTORS).map((c, i) => (
              <path
                key={i}
                ref={(el) => {
                  pathRefs.current[i] = el;
                }}
                d={c.d}
                className={`cf-connector cf-connector-${i}`}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeDasharray="7 7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
          </svg>

          {ITEMS.map((chip, i) => {
            const pos = isMobile
              ? MOBILE_FLOW_POS[chip.key]
              : { top: chip.flowTop, left: chip.flowLeft };
            return (
              <span
                key={chip.key}
                className={`cf-ghost cf-ghost-${i} absolute z-30 ${BADGE_CLASS}`}
                style={{
                  top: `${pos.top}%`,
                  left: `${pos.left}%`,
                  ...CENTERED,
                }}
              >
                {chip.icon}
              </span>
            );
          })}
        </div>

        {/* The last pipe continues straight down from the mail/push merge
            and lands on the word "revenue" itself. */}
        <div
          ref={tickWrapRef}
          className="relative z-10 h-10 w-full sm:h-12"
          aria-hidden
        >
          <svg className="cf-connector cf-connector-tick absolute inset-0 h-full w-full overflow-visible text-border">
            <path
              ref={(el) => {
                tickPathRef.current = el;
                pathRefs.current[CONNECTORS.length] = el;
              }}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeDasharray="7 7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* the closing beat — lands under the flow once every badge is home,
            "revenue" landing in money green */}
        <h2 className="cf-punch-2 relative z-20 text-center font-display text-3xl font-normal tracking-[-0.02em] text-foreground sm:text-5xl">
          from chaos to{" "}
          <span
            ref={revenueWordRef}
            className="cf-word-revenue text-foreground"
          >
            revenue
          </span>
          .
        </h2>
      </div>
    </div>
  );
}
