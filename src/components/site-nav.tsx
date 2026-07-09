"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Sidebar } from "@/components/sidebar";

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close the drawer whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll and close on Escape while the drawer is open.
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

  return (
    <>
      {/* Floating hamburger */}
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="fixed right-5 top-5 z-[60] flex size-12 items-center justify-center rounded-xl border border-border bg-background/80 text-foreground shadow-sm backdrop-blur transition hover:bg-subtle md:left-5 md:right-auto"
      >
        {open ? (
          <X className="size-[18px]" />
        ) : (
          <Menu className="size-[18px]" />
        )}
      </button>

      {/* Floating menu panel */}
      {open && (
        <>
          {/* transparent click-catcher: closes on outside click, no dim/blur */}
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 cursor-default"
          />
          <div
            role="dialog"
            aria-modal="true"
            onClick={(e) => {
              if ((e.target as HTMLElement).closest("a")) setOpen(false);
            }}
            className="animate-fade-in fixed inset-0 z-50 flex flex-col overflow-y-auto bg-card pt-10 md:inset-auto md:left-4 md:top-[68px] md:max-h-[calc(100vh-5.5rem)] md:w-72 md:max-w-[calc(100vw-2rem)] md:rounded-2xl md:border md:border-border md:pt-0 md:shadow-2xl md:shadow-foreground/10"
          >
            <Sidebar />
          </div>
        </>
      )}
    </>
  );
}
