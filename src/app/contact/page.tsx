import { Footer } from "@/components/footer";

export default function ContactPage() {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Contact
        </h1>
        <p className="max-w-2xl text-[15px] leading-relaxed text-muted">
          Need a supportive hand? Send me a message and let&apos;s talk.
        </p>
      </header>
      <form className="flex max-w-xl flex-col gap-4">
        <input
          type="text"
          placeholder="Your name"
          aria-label="Your name"
          className="rounded-lg border border-border bg-background px-3 py-2.5 text-sm"
        />
        <input
          type="email"
          placeholder="Your email"
          aria-label="Your email"
          className="rounded-lg border border-border bg-background px-3 py-2.5 text-sm"
        />
        <textarea
          placeholder="Your message"
          aria-label="Your message"
          rows={5}
          className="rounded-lg border border-border bg-background px-3 py-2.5 text-sm"
        />
        <button
          type="submit"
          className="w-fit rounded-lg bg-foreground px-5 py-2.5 text-sm font-medium text-background transition hover:opacity-90"
        >
          Send message
        </button>
      </form>
      <Footer />
    </div>
  );
}
