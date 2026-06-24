"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Sidebar } from "@/components/sidebar";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  return (
    <div className="md:hidden">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <Link
          href="/"
          className="font-display text-[15px] font-semibold tracking-tight"
        >
          Eyüp Poyraz
        </Link>
        <button
          aria-label="Open menu"
          onClick={() => setOpen(true)}
          className="flex size-9 items-center justify-center rounded-lg border border-border text-foreground transition hover:bg-subtle"
        >
          <Menu className="size-5" />
        </button>
      </div>
      {open && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
          <div
            className="animate-fade-in absolute inset-0 bg-background/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="animate-slide-in absolute inset-y-0 left-0 w-72 max-w-[82%] border-r border-border bg-background">
            <button
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 z-10 flex size-8 items-center justify-center rounded-lg border border-border text-muted transition hover:bg-subtle hover:text-foreground"
            >
              <X className="size-4" />
            </button>
            <Sidebar />
          </div>
        </div>
      )}
    </div>
  );
}
