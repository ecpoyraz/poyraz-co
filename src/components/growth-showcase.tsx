import type { CSSProperties } from "react";
import Link from "next/link";
import { Heart, MessageCircle, Bell, TrendingUp, Mail } from "lucide-react";
import { CopyEmailButton } from "@/components/copy-email-button";

const tile =
  "group rounded-xl border border-border bg-card shadow-sm shadow-foreground/[0.03] transition-colors duration-300 hover:border-[var(--c)] hover:bg-[var(--ct)]";
// monochrome by default, colors on hover (drives currentColor: icons, svg strokes)
const ink =
  "text-foreground/35 transition-colors duration-300 group-hover:text-[var(--c)]";
const bar =
  "bg-foreground/20 transition-colors duration-300 group-hover:bg-[var(--c)]";

const st = (c: string, ct: string, deg: number): CSSProperties =>
  ({ "--c": c, "--ct": ct, transform: `rotate(${deg}deg)` }) as CSSProperties;

function Logo({
  slug,
  color,
  className,
}: {
  slug: string;
  color: string;
  className?: string;
}) {
  return (
    <span
      className={`block bg-foreground/30 transition-colors duration-300 hover:bg-[var(--lc)] ${
        className ?? "size-10"
      }`}
      style={
        {
          "--lc": color,
          maskImage: `url(/images/logos/${slug}.svg)`,
          WebkitMaskImage: `url(/images/logos/${slug}.svg)`,
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskPosition: "center",
          WebkitMaskPosition: "center",
          maskSize: "contain",
          WebkitMaskSize: "contain",
        } as CSSProperties
      }
    />
  );
}

function Artifacts() {
  return (
    <>
      {/* ---------- Group A (renders into the lower row) ---------- */}
      {/* Line chart */}
      <div
        className={`${tile} w-40 p-3`}
        style={st("#2563eb", "rgba(37,99,235,0.06)", -5)}
      >
        <div className="mb-2 h-1.5 w-9 rounded-full bg-foreground/15" />
        <svg viewBox="0 0 130 64" className={`w-full ${ink}`} fill="none">
          <path
            d="M4 56 L30 40 L52 46 L80 22 L126 6"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4 56 L30 40 L52 46 L80 22 L126 6 L126 62 L4 62 Z"
            fill="currentColor"
            fillOpacity="0.08"
          />
        </svg>
      </div>

      {/* Phone */}
      <div
        className={`${tile} h-36 w-[70px] p-1.5`}
        style={st("#7c3aed", "rgba(124,58,237,0.06)", 4)}
      >
        <div className="flex h-full w-full flex-col gap-1.5 rounded-lg bg-subtle p-2">
          <div className="mx-auto h-1 w-5 rounded-full bg-foreground/20" />
          <div className={`mt-1 h-6 w-full rounded ${bar} opacity-40`} />
          <div className="h-1.5 w-3/4 rounded-full bg-foreground/15" />
          <div className="h-1.5 w-1/2 rounded-full bg-foreground/10" />
          <div className={`mt-auto h-4 w-full rounded ${bar} opacity-40`} />
        </div>
      </div>

      <Logo slug="claude" color="#d97757" className="size-11" />

      {/* Instagram ad */}
      <div
        className={`${tile} w-40 p-2.5`}
        style={st("#e11d48", "rgba(225,29,72,0.06)", -3)}
      >
        <div className="mb-2 flex items-center gap-2">
          <div className="size-5 rounded-full bg-foreground/15" />
          <div className="flex flex-1 flex-col gap-1">
            <div className="h-1.5 w-12 rounded-full bg-foreground/20" />
            <div className="h-1 w-8 rounded-full bg-foreground/10" />
          </div>
        </div>
        <div className="aspect-[4/3] w-full rounded-md bg-foreground/[0.07]" />
        <div className={`mt-2 flex gap-2.5 ${ink}`}>
          <Heart className="size-3.5" />
          <MessageCircle className="size-3.5" />
        </div>
      </div>

      {/* Revenue */}
      <div
        className={`${tile} px-4 py-3`}
        style={st("#059669", "rgba(5,150,105,0.07)", 3)}
      >
        <div className="flex items-center gap-1.5 text-foreground/70 transition-colors duration-300 group-hover:text-[var(--c)]">
          <span className="font-display text-[26px] font-bold tracking-tight">
            $428K
          </span>
          <TrendingUp className="size-4" />
        </div>
        <div className="mt-1 text-[9px] font-semibold uppercase tracking-wider text-foreground/30">
          Revenue influenced
        </div>
      </div>

      <Logo slug="meta" color="#0467df" className="size-12" />

      {/* ---------- Group B (renders into the upper row) ---------- */}
      {/* Notification */}
      <div
        className={`${tile} flex w-56 items-center gap-2.5 p-2.5`}
        style={st("#d97706", "rgba(217,119,6,0.07)", -2)}
      >
        <div className="flex size-8 items-center justify-center rounded-lg bg-foreground/10">
          <Bell className={`size-4 ${ink}`} />
        </div>
        <div className="flex flex-1 flex-col gap-1.5">
          <div className="h-1.5 w-20 rounded-full bg-foreground/20" />
          <div className="h-1.5 w-32 rounded-full bg-foreground/10" />
        </div>
        <span className="text-[9px] text-foreground/25">now</span>
      </div>

      {/* Bar chart */}
      <div
        className={`${tile} w-36 p-3`}
        style={st("#0284c7", "rgba(2,132,199,0.06)", 3)}
      >
        <div className="flex h-14 items-end gap-1.5">
          {[40, 62, 50, 78, 96].map((h, i) => (
            <span
              key={i}
              className={`flex-1 rounded-sm ${bar}`}
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>

      {/* Email sequence */}
      <div
        className={`${tile} flex w-40 flex-col gap-1.5 p-3`}
        style={st("#4f46e5", "rgba(79,70,229,0.06)", 2)}
      >
        {[1, 0.8, 0.65].map((w, i) => (
          <div
            key={i}
            className="flex items-center gap-2 rounded-md bg-subtle px-2 py-1.5"
            style={{ width: `${w * 100}%` }}
          >
            <Mail className={`size-3 ${ink}`} />
            <span className="h-1 flex-1 rounded-full bg-foreground/12" />
          </div>
        ))}
      </div>

      <Logo slug="googleanalytics" color="#e37400" className="size-11" />
    </>
  );
}

// collage fades out at the bottom and softly at both side edges
const vFade =
  "[mask-image:linear-gradient(to_bottom,black_0%,black_72%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_72%,transparent_100%)]";
const hFade =
  "[mask-image:linear-gradient(to_right,transparent_0%,black_15%,black_85%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_15%,black_85%,transparent_100%)]";

export function GrowthShowcase() {
  return (
    <section className="reveal relative w-full overflow-hidden pb-6 pt-2">
      {/* text on top */}
      <div className="relative z-10 mx-auto flex max-w-xl flex-col items-center gap-5 pt-6 text-center">
        <div className="flex flex-col gap-3">
          <h1 className="font-display text-[2rem] font-bold leading-[1.1] tracking-tight sm:text-[2.5rem]">
            Hi, This is Eyüp Poyraz.
          </h1>
          <p className="mx-auto max-w-md text-[15px] leading-relaxed text-muted">
            A full-stack growth marketer scaling tech products across the entire
            funnel. Strategy, building, and AI automation, end to end.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link
            href="/about"
            className="rounded-md border border-border bg-subtle px-4 py-2 text-sm font-medium text-foreground transition hover:bg-background"
          >
            About
          </Link>
          <CopyEmailButton />
        </div>
      </div>

      {/* artifact collage, starts below the buttons */}
      <div className={`relative z-0 mt-10 ${hFade}`} aria-hidden="true">
        <div
          className={`flex flex-wrap-reverse items-end justify-center gap-x-8 gap-y-7 px-2 py-5 md:gap-x-12 ${vFade}`}
        >
          <Artifacts />
        </div>
      </div>
    </section>
  );
}
