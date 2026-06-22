"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  // Mount gate: the documented next-themes hydration guard; a one-shot boolean, no cascading renders.
  useEffect(() => setMounted(true), []); // eslint-disable-line react-hooks/set-state-in-effect
  if (!mounted) return <button aria-label="Toggle theme" className="h-8 w-8" />;
  const next = resolvedTheme === "dark" ? "light" : "dark";
  return (
    <button
      aria-label="Toggle theme"
      onClick={() => setTheme(next)}
      className="h-8 w-8 rounded-md border border-border text-foreground"
    >
      {resolvedTheme === "dark" ? "☀" : "☾"}
    </button>
  );
}
