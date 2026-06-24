import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { getPublishedPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "About",
  description:
    "From Aegean's heart, I am Eyup, an engineer and product marketer blending product, marketing and data.",
  alternates: { canonical: "/about" },
  openGraph: { url: "/about" },
};

const experience = [
  {
    period: "2023 - Present",
    role: "Senior Growth Manager",
    company: "Param",
    url: "https://param.com.tr/",
    logo: "/images/exp-param.jpg",
    description:
      "Param is a leading Fintech company and embedded finance provider with +12M user and $10B transaction volume.",
  },
  {
    period: "2022",
    role: "Growth Manager",
    company: "CLV",
    url: "https://clv.org/",
    logo: "/images/exp-clv.webp",
    description:
      "Clover Finance (CLV) is one of top 50 blockchain company that provides crypto wallet and multi-layer chain network, VC funded by Sequoia.",
  },
  {
    period: "2021",
    role: "Growth Marketer",
    company: "Werk",
    url: "https://www.linkedin.com/company/usewerk/",
    logo: "/images/exp-werk.png",
    description:
      "Werk is a venture backed SaaS company that builds project management and team collaboration tools for modern teams.",
  },
  {
    period: "2020",
    role: "Jr. Marketer",
    company: "NMQ Digital",
    url: "https://nmqdigital.com/",
    logo: "/images/exp-nmq.jpg",
    description:
      "NMQ is a global digital marketing agency in 6+ different country heads and serving to giants like Phillips, Mc Donalds.",
  },
];

const podcasts = [
  {
    title: 'Ahmet Kırtok ile "Yeni Nesil Şirket Kültürü: Open Startup"',
    episodeId: "5Kpi30q3S4MGXgYuORMvR3",
  },
  {
    title:
      'Barış Yılmaz ile Iyzico\'da "Marka Bilinirliği ve Growth Süreçleri"',
    episodeId: "580W24x4KEPzFsdedoUbyN",
  },
  {
    title: 'Batuhan Apaydın ile "İçerik Pazarlama"',
    episodeId: "3lC0xcFDdbpbg5yW0dIEJh",
  },
  {
    title: 'Taylan Yıldız ile "Google\'da Veri Odaklı Pazarlama"',
    episodeId: "72K9gBCITN2gDyr2luSVMz",
  },
];

export default function AboutPage() {
  const posts = getPublishedPosts();

  return (
    <div className="flex flex-col gap-12">
      <header className="flex flex-col gap-5">
        <Image
          src="/images/avatar.png"
          alt="Eyüp Poyraz"
          width={80}
          height={80}
          className="size-20 rounded-full border border-border"
        />
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          About me.
        </h1>
      </header>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          From Aegeans heart, I am Eyup, an engineer and product marketer at
          tech industry with blending product, marketing and data.
        </p>
        <p>
          With over a half decade in the field, I masterfully combine building
          growth engine hubs for digital products and execute them throughout
          business goals including revenue growth and user centric approaches.
        </p>
      </div>

      <Image
        src="/images/about-banner.jpg"
        alt="Eyüp Poyraz"
        width={1280}
        height={720}
        className="w-full rounded-2xl border border-border"
      />

      <section className="flex flex-col gap-6">
        <h2 className="font-display text-2xl font-semibold tracking-tight">
          Experience
        </h2>
        <div className="flex flex-col gap-4">
          {experience.map((job) => (
            <div
              key={job.company}
              className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5"
            >
              <Image
                src={job.logo}
                alt={job.company}
                width={48}
                height={48}
                className="size-12 shrink-0 rounded-lg border border-border object-cover"
              />
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-muted">
                  {job.period}
                </span>
                <h3 className="text-base font-semibold text-foreground">
                  {job.role}
                </h3>
                <a
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-fit text-sm font-medium text-accent hover:underline"
                >
                  {job.company}
                </a>
                <p className="text-sm leading-relaxed text-muted">
                  {job.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="font-display text-2xl font-semibold tracking-tight">
          Podcasts
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {podcasts.map((podcast) => (
            <div
              key={podcast.episodeId}
              className="overflow-hidden rounded-xl border border-border"
            >
              <iframe
                src={`https://open.spotify.com/embed/episode/${podcast.episodeId}?utm_source=generator`}
                title={podcast.title}
                width="100%"
                height={152}
                loading="lazy"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                style={{ border: 0 }}
                className="block"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            Notebook
          </h2>
          <p className="text-sm text-muted">
            Sharing my thoughts and knowledge about product &amp; marketing
          </p>
        </div>
        <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
          {posts.map((post) => (
            <Link
              key={post.permalink}
              href={post.permalink}
              className="group flex items-center gap-3"
            >
              {post.cover && (
                <Image
                  src={post.cover}
                  alt=""
                  width={44}
                  height={44}
                  className="size-11 shrink-0 rounded-lg border border-border object-cover"
                />
              )}
              <div className="flex flex-col">
                <span className="text-sm font-semibold leading-snug text-foreground transition group-hover:text-accent">
                  {post.title}
                </span>
                <span className="text-xs text-muted">{post.category}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="border-t border-border pt-8">
        <NewsletterSignup />
      </div>

      <Footer />
    </div>
  );
}
