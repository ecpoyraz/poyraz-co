import Link from "next/link";
import Image from "next/image";
import type { stack } from "#content";

export function StackCard({ tool }: { tool: (typeof stack)[number] }) {
  return (
    <Link href={tool.permalink} className="group flex items-center gap-3">
      {tool.logo && (
        <Image
          src={tool.logo}
          alt={tool.name}
          width={40}
          height={40}
          className="size-10 shrink-0 rounded-lg border border-border bg-white object-contain p-1.5"
        />
      )}
      <div className="flex min-w-0 flex-col">
        <span className="text-sm font-semibold tracking-tight text-foreground transition group-hover:text-accent">
          {tool.name}
        </span>
        <span className="truncate text-xs text-muted">{tool.category}</span>
      </div>
    </Link>
  );
}
