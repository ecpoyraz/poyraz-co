import type { Metadata } from "next";
import { getPublishedPosts } from "@/lib/posts";
import { projects } from "#content";
import { published } from "@/lib/collections";
import { ProjectsRail } from "@/components/projects-rail";
import { MediaCard } from "@/components/media-card";
import { IndexList, IndexRow } from "@/components/index-list";
import { TagPill, toneFor } from "@/components/tag-pill";
import { SectionHeader } from "@/components/section-header";
import { AnimationLab } from "@/components/lab/animation-lab";
import { ScrollReveal } from "@/components/scroll-reveal";
import { AnimatedCta } from "@/components/animated-cta";
import { HomeIntro } from "@/components/home-intro";

const PROJECT_DESCRIPTIONS: Record<string, string> = {
  "clover-finance-crypto-wallet": "A non-custodial crypto wallet and DeFi platform.",
  "contentrain-headless-cms": "A Git-based headless CMS for developer teams.",
  "masa-social-event-app": "A social app for discovering nearby events.",
  "numerspace-calculator-platform": "A bilingual platform for financial and everyday calculators.",
  "param-fintech-mobile-app": "An embedded finance and digital banking platform.",
  "peerbie-ai-productivity-tool": "An AI-powered team productivity and collaboration app.",
  "werk-team-productivity-platform": "An all-in-one team productivity and communication platform.",
};

export const metadata: Metadata = {
  title: { absolute: "A full stack marketer | Eyüp Poyraz" },
  description:
    "Hi, it's Eyüp. I blend product marketing, growth, content, analytics, and a little code to help tech products find traction and scale.",
  alternates: { canonical: "/" },
  openGraph: { url: "/" },
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export default function Home() {
  const posts = getPublishedPosts();
  const allProjects = published([...projects]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://poyraz.co/#person",
        name: "Eyüp Poyraz",
        url: "https://poyraz.co",
        jobTitle: "Product and Growth Marketer",
        sameAs: [
          "https://x.com/eyuppoyraz",
          "https://www.linkedin.com/in/eyuppoyraz/",
        ],
      },
      {
        "@type": "WebSite",
        "@id": "https://poyraz.co/#website",
        url: "https://poyraz.co",
        name: "Eyüp Poyraz",
        publisher: { "@id": "https://poyraz.co/#person" },
      },
    ],
  };

  return (
    <div className="flex w-full flex-col gap-20 md:mx-[calc(50%-min(39vw,50rem))] md:w-[min(78vw,100rem)] md:gap-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div>
        {/* Intro — static first viewport */}
        <HomeIntro />

        {/* The story — pinned, scroll-driven sections; starts at section two */}
        <AnimationLab />
      </div>

      {/* CTA — normal flow, revealed like the projects section */}
      <ScrollReveal>
        <AnimatedCta />
      </ScrollReveal>

      {/* Projects — full-bleed rail + index list */}
      <ScrollReveal>
        <SectionHeader
          title="Proven results from previous projects"
          className="mb-8"
        />
        <div className="ml-[calc(50%-50vw)] w-screen">
          <div className="px-5 md:px-10">
            <div className="mx-auto w-full md:max-w-[min(78vw,100rem)]">
              <ProjectsRail>
                {allProjects.slice(0, 6).map((project) => (
                  <div
                    key={project.slug}
                    className="w-[86vw] shrink-0 snap-start sm:w-[60vw] md:w-[calc((100%-2.5rem)/2)] lg:w-[calc((100%-2.5rem)/2.5)]"
                  >
                    <MediaCard
                      href={project.permalink}
                      title={project.title}
                      cover={project.cover}
                      description={PROJECT_DESCRIPTIONS[project.slug]}
                    />
                  </div>
                ))}
              </ProjectsRail>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Notebook — index list */}
      <ScrollReveal>
        <SectionHeader title="Notebook" className="mb-8" />
        <IndexList>
          {posts.slice(0, 6).map((post) => (
            <IndexRow
              key={post.slug}
              href={post.permalink}
              title={post.title}
              meta={formatDate(post.date)}
              tags={
                <TagPill tone={toneFor(post.category)}>{post.category}</TagPill>
              }
            />
          ))}
          <IndexRow href="/notebook" title="Read all →" />
        </IndexList>
      </ScrollReveal>
    </div>
  );
}
