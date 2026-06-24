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
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import { NAV_GROUPS } from "@/lib/nav";
import { ThemeToggle } from "@/components/theme-toggle";
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

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="flex h-full w-full flex-col gap-6 p-4 text-[13px]">
      <Link href="/" className="flex items-center gap-2.5 px-1">
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
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition ${
                    active
                      ? "bg-subtle font-medium text-foreground"
                      : "text-muted hover:bg-subtle hover:text-foreground"
                  }`}
                >
                  <span className="relative">
                    <Icon
                      className={`size-[18px] shrink-0 transition ${
                        active ? "text-accent" : ""
                      }`}
                    />
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

      <div className="flex items-center justify-between px-1">
        <span className="text-xs text-muted">Theme</span>
        <ThemeToggle />
      </div>
    </aside>
  );
}
