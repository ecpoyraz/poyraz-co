import Link from "next/link";
import type { Service } from "@/lib/services";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <div className="flex h-full flex-col rounded-lg bg-card p-7">
      <h3 className="font-display text-xl font-semibold tracking-tight">
        {service.title}
      </h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted">
        {service.desc}
      </p>
      <ul className="mt-5 flex flex-col gap-2.5">
        {service.bullets.map((bullet) => (
          <li
            key={bullet}
            className="flex items-start gap-3 text-sm text-muted"
          >
            <span className="mt-[7px] size-1.5 shrink-0 rounded-lg bg-accent" />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-6">
        <Link
          href={service.href}
          className="inline-flex w-full items-center justify-center rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-85"
        >
          {service.cta}
        </Link>
      </div>
    </div>
  );
}
