import Image from "next/image";
import { Footer } from "@/components/footer";

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-5">
        <Image
          src="/images/avatar.png"
          alt="Eyüp Poyraz"
          width={80}
          height={80}
          className="size-20 rounded-full border border-border"
        />
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          About Me
        </h1>
      </header>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          I am Eyüp, an engineer and product marketer in the tech industry,
          blending product, marketing, and data. With over half a decade in the
          field, I help companies scale their products and create real value for
          their users.
        </p>
        <p>
          I work at the intersection of product and marketing, launching
          features, optimizing conversion funnels, and scaling adoption across
          digital channels. I define KPIs, set up dashboards, and run conversion
          analyses to inform decisions across acquisition and retention.
        </p>
        <h2>What I do</h2>
        <p>
          From growth strategy to hands-on execution, I focus on driving user
          value and sustainable growth for tech products across fintech and
          SaaS.
        </p>
      </div>
      <Footer />
    </div>
  );
}
