"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Compass,
  SquarePen,
  Briefcase,
  CircleUserRound,
  Bookmark,
  NotebookText,
  Layers,
  Send,
  Search,
  ChevronLeft,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import { NAV_GROUPS } from "@/lib/nav";
import { ThemeToggle } from "@/components/theme-toggle";

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
    </svg>
  );
}

const ICONS: Record<string, LucideIcon | typeof XIcon> = {
  Home: Compass,
  Projects: SquarePen,
  Services: Briefcase,
  About: CircleUserRound,
  Bookmarks: Bookmark,
  Notebook: NotebookText,
  Stack: Layers,
  Contact: Send,
  X: XIcon,
  LinkedIn: LinkedInIcon,
};

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="flex h-full w-full flex-col gap-5 p-4 text-[13px]">
      <div className="flex items-center justify-between gap-2 px-1">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/images/avatar.png"
            alt="Eyüp Poyraz"
            width={40}
            height={40}
            className="size-10 rounded-full border border-border"
          />
          <span className="flex flex-col leading-tight">
            <span className="font-display text-[15px] font-semibold tracking-tight text-foreground">
              Eyüp Poyraz
            </span>
            <span className="text-xs text-muted">Marketer</span>
          </span>
        </Link>
        <button
          aria-label="Collapse sidebar"
          className="flex size-6 items-center justify-center rounded-md border border-border text-muted transition hover:bg-subtle hover:text-foreground"
        >
          <ChevronLeft className="size-3.5" />
        </button>
      </div>

      <nav className="flex flex-1 flex-col gap-5">
        {NAV_GROUPS.map((group) => (
          <div key={group.title ?? "primary"} className="flex flex-col gap-0.5">
            {group.title && (
              <span className="mb-1 px-2 text-[11px] font-medium uppercase tracking-wider text-muted/70">
                {group.title}
              </span>
            )}
            {group.links.map((link) => {
              const Icon = ICONS[link.label] ?? Compass;
              const active =
                !link.external &&
                (link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href));
              const showDot = link.label === "Bookmarks";
              return link.external ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-muted transition hover:bg-subtle hover:text-foreground"
                >
                  <Icon className="size-[18px] shrink-0" />
                  <span className="flex-1">{link.label}</span>
                  <ArrowUpRight className="size-3.5 opacity-0 transition group-hover:opacity-60" />
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition ${
                    active
                      ? "bg-subtle font-medium text-foreground"
                      : "text-muted hover:bg-subtle hover:text-foreground"
                  }`}
                >
                  <span className="relative">
                    <Icon className="size-[18px] shrink-0" />
                    {showDot && (
                      <span className="absolute -right-0.5 -top-0.5 size-1.5 rounded-full bg-green-500" />
                    )}
                  </span>
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="flex items-center justify-between gap-2 rounded-lg border border-border bg-subtle px-2.5 py-2 text-muted">
        <span className="flex items-center gap-2">
          <Search className="size-4" />
          <span className="text-[13px]">Search...</span>
        </span>
        <kbd className="rounded border border-border bg-background px-1.5 py-0.5 text-[11px] font-medium">
          S
        </kbd>
      </div>

      <div className="px-1">
        <ThemeToggle />
      </div>
    </aside>
  );
}
