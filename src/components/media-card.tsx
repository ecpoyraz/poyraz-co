import Link from "next/link";
import Image from "next/image";

// Large media card. Homepage rail cards can opt into a compact caption.
export function MediaCard({
  href,
  title,
  cover,
  description,
  priority = false,
  decorative = false,
}: {
  href: string;
  title: string;
  cover?: string;
  description?: string;
  priority?: boolean;
  decorative?: boolean;
}) {
  return (
    <Link
      href={href}
      aria-hidden={decorative || undefined}
      tabIndex={decorative ? -1 : undefined}
      aria-label={decorative ? undefined : title}
      className="group relative block overflow-hidden rounded-2xl bg-brand-soft ring-1 ring-brand/10"
    >
      {cover && (
        <Image
          src={cover}
          alt={decorative ? "" : title}
          width={1600}
          height={1100}
          quality={90}
          priority={priority}
          sizes="(max-width: 768px) 88vw, 640px"
          className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-[1.04]"
        />
      )}
      {description && (
        <div className="border-t border-brand/10 bg-card p-5 sm:p-6">
          <h3 className="font-display text-xl font-semibold tracking-[-0.02em] text-foreground transition-colors group-hover:text-accent">
            {title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
            {description}
          </p>
        </div>
      )}
    </Link>
  );
}
