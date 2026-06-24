import type { Metadata } from "next";
import { Copy } from "lucide-react";

import { Footer } from "@/components/footer";
import { XIcon, LinkedInIcon } from "@/components/social-icons";
import { ContactForm } from "@/components/contact-form";
import { CalEmbed } from "@/components/cal-embed";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "I'm always looking to collaborate on interesting projects with great people.",
  alternates: { canonical: "/contact" },
  openGraph: { url: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Contact
        </h1>
        <p className="max-w-2xl text-[15px] leading-relaxed text-muted">
          I&apos;m always looking to collaborate on interesting projects with
          great people. Need a supportive hand? I have two!
        </p>
      </header>

      <div className="flex flex-wrap gap-2.5">
        <a
          href="mailto:hi@poyraz.co"
          className="inline-flex items-center gap-2 rounded-md border border-border bg-subtle px-4 py-2 text-sm font-medium text-foreground transition hover:bg-background"
        >
          <Copy className="size-3.5" />
          E-Mail
        </a>
        <a
          href="https://x.com/eyuppoyraz"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-md border border-border bg-subtle px-4 py-2 text-sm font-medium text-foreground transition hover:bg-background"
        >
          <XIcon className="size-3.5" />X
        </a>
        <a
          href="https://www.linkedin.com/in/eyuppoyraz/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-md border border-border bg-subtle px-4 py-2 text-sm font-medium text-foreground transition hover:bg-background"
        >
          <LinkedInIcon className="size-3.5" />
          Linkedin
        </a>
      </div>

      <div className="rounded-2xl border border-border p-6 sm:p-7">
        <h2 className="mb-4 font-display text-lg font-semibold tracking-tight">
          Send message
        </h2>
        <ContactForm />
      </div>

      <div className="rounded-2xl border border-border p-6 sm:p-7">
        <h2 className="font-display text-lg font-semibold tracking-tight">
          Schedule Call
        </h2>
        <p className="mt-1 text-sm text-muted">Book a 30 minute intro call.</p>
        <div className="mt-4">
          <CalEmbed />
        </div>
      </div>

      <Footer />
    </div>
  );
}
