import Link from "next/link";
import { NAV_GROUPS } from "@/lib/nav";
import { ThemeToggle } from "@/components/theme-toggle";

export function Sidebar() {
  return (
    <aside className="flex h-full w-full flex-col gap-6 p-6 text-sm">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="font-display text-base font-semibold text-foreground"
        >
          Eyüp Poyraz
        </Link>
        <ThemeToggle />
      </div>
      <nav className="flex flex-col gap-5">
        {NAV_GROUPS.map((group, i) => (
          <div key={i} className="flex flex-col gap-1">
            {group.title && (
              <span className="mb-1 text-xs uppercase tracking-wide text-muted">
                {group.title}
              </span>
            )}
            {group.links.map((link) =>
              link.external ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted hover:text-foreground"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-muted hover:text-foreground"
                >
                  {link.label}
                </Link>
              ),
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}
