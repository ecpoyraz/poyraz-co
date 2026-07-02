"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  SquarePen,
  Briefcase,
  NotebookText,
  Send,
} from "lucide-react";

const TABS = [
  { label: "Home", href: "/", icon: Compass },
  { label: "Projects", href: "/projects", icon: SquarePen },
  { label: "Services", href: "/services", icon: Briefcase },
  { label: "Notebook", href: "/notebook", icon: NotebookText },
  { label: "Contact", href: "/contact", icon: Send },
];

export function MobileTabBar() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/90 backdrop-blur md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="flex items-stretch justify-around">
        {TABS.map(({ label, href, icon: Icon }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition ${
                  active ? "text-accent" : "text-muted hover:text-foreground"
                }`}
              >
                <Icon className="size-[18px]" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
