import type { Metadata } from "next";
import { ServiceCard } from "@/components/service-card";
import { SERVICES } from "@/lib/services";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Services",
  description:
    "I help companies build growth momentum and scale their product.",
  alternates: { canonical: "/services" },
  openGraph: { url: "/services" },
};

export default function ServicesPage() {
  return (
    <div className="flex flex-col gap-16 md:gap-20">
      <Reveal as="header" className="pt-6 md:pt-14">
        <p className="label-mono mb-4 text-muted">Services</p>
        <h1 className="max-w-3xl font-display text-4xl font-normal leading-[1.02] tracking-[-0.03em] sm:text-5xl md:text-6xl">
          Let&apos;s build momentum.
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-muted md:text-lg">
          I help companies build growth momentum and scale their product, from
          strategy to hands-on execution.
        </p>
      </Reveal>
      <Reveal className="grid gap-4 sm:grid-cols-3">
        {SERVICES.map((service) => (
          <ServiceCard key={service.title} service={service} />
        ))}
      </Reveal>
    </div>
  );
}
