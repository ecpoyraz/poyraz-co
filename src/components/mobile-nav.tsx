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
  type LucideIcon,
} from "lucide-react";
import { NAV_GROUPS } from "@/lib/nav";
import { XIcon, LinkedInIcon } from "@/components/social-icons";

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

const NAV_ITEMS = NAV_GROUPS.flatMap((group) => group.links);

export function MobileNav() {
  const pathname = usePathname();
  return (
    <div className="md:hidden">
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-background/85 px-5 py-3.5 backdrop-blur">
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
          aria-label="Search"
          className="flex size-10 items-center justify-center rounded-xl border border-border text-muted transition hover:bg-subtle"
        >
          <Search className="size-5" />
        </button>
      </header>

      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/90 backdrop-blur"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex gap-1 overflow-x-auto px-3 py-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {NAV_ITEMS.map((link) => {
            const Icon = ICONS[link.label] ?? Compass;
            const active =
              !link.external &&
              (link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href));
            const showDot = link.label === "Bookmarks";
            const className = `flex shrink-0 flex-col items-center gap-1 rounded-xl px-3 py-1.5 text-[11px] font-medium transition ${
              active ? "bg-subtle text-foreground" : "text-muted"
            }`;
            const content = (
              <>
                <span className="relative">
                  <Icon className="size-5" />
                  {showDot && (
                    <span className="absolute -right-1 -top-1 size-1.5 rounded-full bg-green-500" />
                  )}
                </span>
                <span>{link.label}</span>
              </>
            );
            return link.external ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className={className}
              >
                {content}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={className}
              >
                {content}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
