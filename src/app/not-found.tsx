import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col gap-5 py-16 md:py-28">
      <span className="label-mono text-muted">404</span>
      <h1 className="max-w-3xl font-display text-5xl font-semibold leading-[0.98] tracking-[-0.03em] sm:text-6xl md:text-7xl">
        Page not found.
      </h1>
      <p className="max-w-md text-[15px] leading-relaxed text-muted">
        The page you are looking for does not exist or has moved.
      </p>
      <Link
        href="/"
        className="mt-2 inline-flex w-fit rounded-lg bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-85"
      >
        Back home
      </Link>
    </div>
  );
}
