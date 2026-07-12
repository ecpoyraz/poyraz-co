"use client";

import { useState } from "react";
import { sendGAEvent } from "@next/third-parties/google";

type Status = "idle" | "loading" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("loading");
    setError("");

    try {
      const formData = new FormData(form);
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData)),
      });
      if (!res.ok) {
        const json = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(json.error || "Something went wrong.");
      }
      setStatus("success");
      sendGAEvent("event", "contact_message_sent", { method: "contact_form" });
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <p className="text-sm text-foreground">
        Thanks, your message has been sent. I will get back to you soon.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          type="text"
          name="name"
          placeholder="Name"
          aria-label="Name"
          className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm"
        />
        <input
          type="email"
          name="email"
          required
          placeholder="Email"
          aria-label="Email"
          className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm"
        />
      </div>
      <input
        type="url"
        name="website"
        placeholder="Company website"
        aria-label="Company website"
        className="mt-3 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm"
      />
      <textarea
        name="message"
        required
        rows={5}
        placeholder="Your message"
        aria-label="Your message"
        className="mt-3 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm"
      />
      {status === "error" && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}
      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-4 w-full rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-background transition hover:opacity-85 disabled:opacity-60"
      >
        {status === "loading" ? "Sending..." : "Submit"}
      </button>
    </form>
  );
}
