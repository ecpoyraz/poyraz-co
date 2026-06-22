import Link from "next/link";
import { NAV_GROUPS } from "@/lib/nav";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border pt-8 text-sm text-muted">
      <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
        {NAV_GROUPS.map((group, i) => (
          <div key={i} className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-wide text-muted">
              {group.title ?? "Index"}
            </span>
            {group.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>
        ))}
      </div>
      <p className="mt-8">poyraz.co</p>
    </footer>
  );
}
