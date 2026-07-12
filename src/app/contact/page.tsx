import type { Metadata } from "next";

import { XIcon, LinkedInIcon } from "@/components/social-icons";
import { ContactForm } from "@/components/contact-form";
import { CalEmbed } from "@/components/cal-embed";
import { CopyEmailButton } from "@/components/copy-email-button";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "I'm always looking to collaborate on interesting projects with great people.",
  alternates: { canonical: "/contact" },
  openGraph: { url: "/contact" },
};

const pillClass =
  "inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition hover:bg-subtle";

export default function ContactPage() {
  return (
    <div className="flex flex-col gap-14 md:gap-16">
      <Reveal as="header" className="pt-6 md:pt-14">
        <p className="label-mono mb-4 text-muted">Contact</p>
        <h1 className="max-w-3xl font-display text-4xl font-semibold leading-[1.02] tracking-[-0.03em] sm:text-5xl md:text-6xl">
          Let&apos;s collaborate on something great.
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-muted md:text-lg">
          I&apos;m always looking to collaborate on interesting projects with
          great people. Need a supportive hand? I have two!
        </p>
        <div className="mt-8 flex flex-wrap gap-2.5">
          <CopyEmailButton />
          <a
            href="https://x.com/eyuppoyraz"
            target="_blank"
            rel="noreferrer"
            className={pillClass}
          >
            <XIcon className="size-3.5" />X
          </a>
          <a
            href="https://www.linkedin.com/in/eyuppoyraz/"
            target="_blank"
            rel="noreferrer"
            className={pillClass}
          >
            <LinkedInIcon className="size-3.5" />
            Linkedin
          </a>
        </div>
      </Reveal>

      <Reveal className="rounded-xl bg-card p-6 sm:p-8">
        <h2 className="mb-5 font-display text-2xl font-semibold tracking-tight">
          Send message
        </h2>
        <ContactForm />
      </Reveal>

      <Reveal className="rounded-xl bg-card p-6 sm:p-8">
        <h2 className="font-display text-2xl font-semibold tracking-tight">
          Schedule Call
        </h2>
        <p className="mt-1 text-sm text-muted">Book a 30 minute intro call.</p>
        <div className="mt-5">
          <CalEmbed />
        </div>
      </Reveal>
    </div>
  );
}
