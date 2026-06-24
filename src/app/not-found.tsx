import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col gap-4 py-12">
      <span className="text-xs font-medium uppercase tracking-[0.16em] text-muted">
        404
      </span>
      <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
        Page not found
      </h1>
      <p className="max-w-md text-[15px] leading-relaxed text-muted">
        The page you are looking for does not exist or has moved.
      </p>
      <Link
        href="/"
        className="mt-1 inline-flex w-fit rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:opacity-90"
      >
        Back home
      </Link>
    </div>
  );
}
