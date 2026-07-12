import type { ReactNode } from "react";

export type TagTone = "orange" | "purple" | "green" | "blue" | "neutral";

const TONES: Record<TagTone, string> = {
  neutral: "bg-subtle text-foreground/80",
  orange: "bg-tag-orange/10 text-tag-orange",
  purple: "bg-tag-purple/10 text-tag-purple",
  green: "bg-tag-green/10 text-tag-green",
  blue: "bg-tag-blue/10 text-tag-blue",
};

const HASH_TONES: TagTone[] = ["orange", "purple", "green", "blue"];

// Deterministic tone from a label so the same category always gets the same color.
export function toneFor(label: string): TagTone {
  let hash = 0;
  for (let i = 0; i < label.length; i++) {
    hash = (hash * 31 + label.charCodeAt(i)) | 0;
  }
  return HASH_TONES[Math.abs(hash) % HASH_TONES.length];
}

export function TagPill({
  tone = "neutral",
  className,
  children,
}: {
  tone?: TagTone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-3 py-1 text-xs font-medium ${TONES[tone]} ${className ?? ""}`}
    >
      {children}
    </span>
  );
}
