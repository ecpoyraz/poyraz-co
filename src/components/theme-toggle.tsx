"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  // Mount gate: the documented next-themes hydration guard; a one-shot boolean, no cascading renders.
  useEffect(() => setMounted(true), []); // eslint-disable-line react-hooks/set-state-in-effect
  if (!mounted)
    return (
      <button
        aria-label="Toggle theme"
        className="size-8 rounded-lg border border-border"
      />
    );
  const isDark = resolvedTheme === "dark";
  return (
    <button
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex size-8 items-center justify-center rounded-lg border border-border text-muted transition hover:bg-subtle hover:text-foreground"
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}
