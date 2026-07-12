import Link from "next/link";
import Image from "next/image";

// Large rail card: cover image only, no text overlay.
export function MediaCard({
  href,
  title,
  cover,
  priority = false,
  decorative = false,
}: {
  href: string;
  title: string;
  cover?: string;
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
    </Link>
  );
}
