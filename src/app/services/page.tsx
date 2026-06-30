import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { ServiceCard } from "@/components/service-card";
import { SERVICES } from "@/lib/services";

export const metadata: Metadata = {
  title: "Services",
  description:
    "I help companies build growth momentum and scale their product.",
  alternates: { canonical: "/services" },
  openGraph: { url: "/services" },
};

export default function ServicesPage() {
  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-3">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Services{" "}
          <span className="font-medium text-muted">
            Let&apos;s Build Momentum
          </span>
        </h1>
        <p className="max-w-2xl text-[15px] leading-relaxed text-muted">
          I help companies build growth momentum and scale their product, from
          strategy to hands-on execution.
        </p>
      </header>
      <div className="grid gap-4 sm:grid-cols-3">
        {SERVICES.map((service) => (
          <ServiceCard key={service.title} service={service} />
        ))}
      </div>
      <Footer />
    </div>
  );
}
