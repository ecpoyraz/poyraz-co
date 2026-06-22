"use client";

import { useState } from "react";

export function NewsletterSignup() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <section className="mt-10 border-t border-border pt-6">
      <h2 className="font-display text-lg font-semibold">Join 1K+ readers</h2>
      <p className="mt-1 text-sm text-muted">
        Sent out every two weeks. No spam.
      </p>
      {submitted ? (
        <p className="mt-3 text-sm text-foreground">Thanks for subscribing.</p>
      ) : (
        <form
          className="mt-3 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
        >
          <input
            type="email"
            required
            placeholder="you@email.com"
            aria-label="Email address"
            className="flex-1 rounded-md border border-border bg-transparent px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="rounded-md border border-border px-4 py-2 text-sm text-foreground hover:opacity-80"
          >
            Submit
          </button>
        </form>
      )}
    </section>
  );
}
