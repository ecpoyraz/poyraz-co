import type { Metadata } from "next";
import Image from "next/image";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { getPublishedPosts } from "@/lib/posts";
import { IndexList, IndexRow } from "@/components/index-list";
import { TagPill, toneFor } from "@/components/tag-pill";
import { Reveal } from "@/components/reveal";

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
    <div className="flex flex-col gap-16 md:gap-20">
      <Reveal as="header" className="pt-6 md:pt-14">
        <p className="label-mono mb-4 text-muted">About</p>
        <h1 className="max-w-4xl font-display text-4xl font-semibold leading-[1.02] tracking-[-0.03em] sm:text-5xl md:text-6xl">
          Engineer and product marketer blending product, marketing and data.
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-muted md:text-lg">
          From Aegean&apos;s heart. With over a half decade in the field, I
          build growth engines for digital products and execute them toward
          revenue growth with a user centric approach.
        </p>
      </Reveal>

      <Reveal>
        <Image
          src="/images/about-banner.jpg"
          alt="Eyüp Poyraz"
          width={1280}
          height={720}
          className="w-full rounded-xl"
        />
      </Reveal>

      <Reveal as="section">
        <p className="label-mono mb-8 text-muted">Experience</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {experience.map((job) => (
            <div key={job.company} className="rounded-xl bg-card p-7">
              <div className="mb-5 flex items-center justify-between gap-4">
                <Image
                  src={job.logo}
                  alt={job.company}
                  width={48}
                  height={48}
                  className="size-12 shrink-0 rounded-xl object-cover"
                />
                <span className="label-mono text-muted">{job.period}</span>
              </div>
              <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">
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
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {job.description}
              </p>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal as="section">
        <p className="label-mono mb-8 text-muted">Podcasts</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {podcasts.map((podcast) => (
            <div
              key={podcast.episodeId}
              className="overflow-hidden rounded-xl"
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
      </Reveal>

      <Reveal as="section">
        <p className="label-mono mb-8 text-muted">Notebook</p>
        <IndexList>
          {posts.slice(0, 6).map((post) => (
            <IndexRow
              key={post.permalink}
              href={post.permalink}
              title={post.title}
              tags={
                <TagPill tone={toneFor(post.category)}>{post.category}</TagPill>
              }
            />
          ))}
          <IndexRow href="/notebook" title="Read all →" />
        </IndexList>
      </Reveal>

      <Reveal className="rounded-xl bg-card p-8 md:p-10">
        <div className="mx-auto max-w-2xl">
          <NewsletterSignup />
        </div>
      </Reveal>
    </div>
  );
}
