import type { ComponentPropsWithoutRef } from "react";
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

export const mdxComponents = {
  Callout,
  table: TableWrap,
};
