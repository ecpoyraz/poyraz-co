import Link from "next/link";
import type { ReactNode } from "react";

// Univenn-style index rows: hairline top borders, name left, pills/meta right.
export function IndexList({
  children,
  bottomBorder = true,
  className,
}: {
  children: ReactNode;
  bottomBorder?: boolean;
  className?: string;
}) {
  return (
    <ul
      className={`${bottomBorder ? "border-b border-border" : ""} ${className ?? ""}`}
    >
      {children}
    </ul>
  );
}

export function IndexRow({
  href,
  title,
  meta,
  tags,
  external = false,
}: {
  href: string;
  title: string;
  meta?: string;
  tags?: ReactNode;
  external?: boolean;
}) {
  const inner = (
    <>
      <span className="min-w-0 truncate text-base font-medium text-foreground sm:text-lg">
        {title}
      </span>
      <span className="flex shrink-0 items-center gap-2">
        {tags}
        {meta && (
          <span className="label-mono hidden text-muted sm:inline">{meta}</span>
        )}
      </span>
    </>
  );
  const rowClass =
    "flex items-center justify-between gap-4 border-t border-border px-3 py-5 transition-colors hover:bg-card";

  return (
    <li>
      {external ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={rowClass}
        >
          {inner}
        </a>
      ) : (
        <Link href={href} className={rowClass}>
          {inner}
        </Link>
      )}
    </li>
  );
}
