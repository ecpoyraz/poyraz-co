"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

const EMAIL = "eyup@poyraz.co";

export function CopyEmailButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {
      // clipboard may be unavailable; still show feedback
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "Email address copied" : `Copy ${EMAIL}`}
      className="inline-flex items-center gap-2 rounded-md border border-border bg-subtle px-4 py-2 text-sm font-medium text-foreground transition hover:bg-background"
    >
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      {copied ? "Copied" : "E-Mail"}
    </button>
  );
}
