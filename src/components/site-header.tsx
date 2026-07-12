"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { HEADER_LINKS } from "@/lib/nav";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const pathname = usePathname();

  // Hide on scroll down, reveal on scroll up. Always visible near the top.
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 80) {
        setHidden(false);
      } else if (y > lastY + 2) {
        setHidden(true);
      } else if (y < lastY - 2) {
        setHidden(false);
      }
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the overlay whenever the route changes.
  useEffect(() => {
    setOpen(false); // eslint-disable-line react-hooks/set-state-in-effect
  }, [pathname]);

  // Lock body scroll and close on Escape while the overlay is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur transition-transform duration-300 ${
          hidden && !open ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="px-5 md:px-10">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between">
            {/* Desktop nav — pages on the left */}
            <nav className="hidden items-center gap-7 md:flex">
              {HEADER_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm transition-colors hover:text-foreground ${
                    isActive(link.href) ? "text-foreground" : "text-muted"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <Link
              href="/contact"
              className="hidden rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-85 md:block"
            >
              Get in touch
            </Link>

            {/* Mobile controls */}
            <div className="ml-auto flex items-center md:hidden">
              <button
                type="button"
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
                className="flex size-10 items-center justify-center rounded-lg text-foreground transition hover:bg-subtle"
              >
                {open ? <X className="size-5" /> : <Menu className="size-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile overlay menu — sibling of the header: the header's backdrop-blur
         would otherwise turn this fixed element into an absolutely-positioned one. */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="animate-fade-in fixed inset-x-0 bottom-0 top-16 z-40 flex flex-col justify-between overflow-y-auto bg-background px-5 pb-10 pt-8 md:hidden"
        >
          <nav className="flex flex-col">
            {HEADER_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`border-t border-border py-5 font-display text-3xl font-medium tracking-tight ${
                  isActive(link.href) ? "text-foreground" : "text-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/contact"
            className="mt-10 rounded-lg bg-foreground px-5 py-3.5 text-center text-base font-medium text-background"
          >
            Get in touch
          </Link>
        </div>
      )}
    </>
  );
}
