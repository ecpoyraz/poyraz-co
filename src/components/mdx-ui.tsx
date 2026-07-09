import type { ComponentPropsWithoutRef } from "react";
import Image from "next/image";
import { Info, Lightbulb, TriangleAlert } from "lucide-react";

const variantIcon = {
  info: Info,
  tip: Lightbulb,
  warning: TriangleAlert,
} as const;

type CalloutVariant = keyof typeof variantIcon;

// Banner / context block used inside articles. Presentational only.
export function Callout({
  variant = "info",
  title,
  children,
}: {
  variant?: CalloutVariant;
  title?: string;
  children?: React.ReactNode;
}) {
  const Icon = variantIcon[variant] ?? Info;
  return (
    <div className="callout callout-accent">
      <Icon className="callout-icon size-5" strokeWidth={2} aria-hidden />
      <div className="callout-body">
        {title && <p className="callout-title">{title}</p>}
        {children}
      </div>
    </div>
  );
}

// Wraps GFM tables so they scroll on narrow screens and read as cards.
function TableWrap(props: ComponentPropsWithoutRef<"table">) {
  return (
    <div className="prose-table-wrap">
      <table {...props} />
    </div>
  );
}

// Markdown images (`![]()`) compile to a plain <img> with no width/height,
// so `fill` + a sized wrapper is used instead of intrinsic dimensions.
// `span` (not `div`) keeps this a valid child when remark wraps a
// standalone image in a <p>.
function MDXImage({ src, alt }: ComponentPropsWithoutRef<"img">) {
  if (!src || typeof src !== "string") return null;
  return (
    <span className="relative my-6 block aspect-[16/10] w-full overflow-hidden rounded-xl border border-border bg-subtle">
      <Image
        src={src}
        alt={alt ?? ""}
        fill
        sizes="(max-width: 768px) 100vw, 720px"
        className="object-cover"
      />
    </span>
  );
}

export const mdxComponents = {
  Callout,
  table: TableWrap,
  img: MDXImage,
};
