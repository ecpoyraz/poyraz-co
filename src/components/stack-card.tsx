import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { stack } from "#content";

export function StackCard({ tool }: { tool: (typeof stack)[number] }) {
  return (
    <a
      href={tool.url}
      target="_blank"
      rel="noreferrer"
      className="group flex items-start gap-4 rounded-xl border border-border bg-card p-4 transition hover:border-accent/40"
    >
      {tool.logo && (
        <Image
          src={tool.logo}
          alt={tool.name}
          width={44}
          height={44}
          unoptimized={tool.logo.endsWith(".svg")}
          className="size-11 shrink-0 rounded-lg border border-border bg-white object-contain p-1.5"
        />
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-display text-[15px] font-semibold tracking-tight text-foreground transition group-hover:text-accent">
            {tool.name}
          </span>
          <span className="shrink-0 rounded-full border border-border bg-subtle px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wider text-muted">
            {tool.category}
          </span>
        </div>
        <p className="text-sm leading-relaxed text-muted">{tool.note}</p>
      </div>
      <ArrowUpRight className="mt-0.5 size-4 shrink-0 text-muted transition group-hover:text-accent" />
    </a>
  );
}
