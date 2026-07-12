"use client";

import { useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

export function NewsletterSignup({
  title = "Join 1K+ Readers",
  subtitle = "Sent out every two weeks. No spam.",
}: {
  title?: string;
  subtitle?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = new FormData(e.currentTarget).get("email");
    setStatus("loading");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-1">
        <h3 className="font-display text-lg font-medium tracking-tight">
          {title}
        </h3>
        <p className="text-sm text-muted">{subtitle}</p>
      </div>
      {status === "success" ? (
        <p className="text-sm text-foreground">Thanks for subscribing.</p>
      ) : (
        <form className="flex flex-col gap-1" onSubmit={onSubmit}>
          <div className="flex gap-2">
            <input
              type="email"
              name="email"
              required
              placeholder="Your Email"
              aria-label="Email address"
              className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground sm:w-56"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="shrink-0 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:opacity-85 disabled:opacity-60"
            >
              {status === "loading" ? "..." : "Submit"}
            </button>
          </div>
          {status === "error" && (
            <p className="text-xs text-red-500">
              Could not subscribe. Try again.
            </p>
          )}
        </form>
      )}
    </div>
  );
}
