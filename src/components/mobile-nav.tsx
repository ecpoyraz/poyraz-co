"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  return (
    <div className="md:hidden">
      <button
        aria-label="Open menu"
        onClick={() => setOpen(true)}
        className="p-4 text-foreground"
      >
        Menu
      </button>
      {open && (
        <div className="fixed inset-0 z-50 bg-background">
          <button
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 text-foreground"
          >
            Close
          </button>
          <Sidebar />
        </div>
      )}
    </div>
  );
}
