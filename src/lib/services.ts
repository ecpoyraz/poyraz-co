export type Service = {
  title: string;
  desc: string;
  bullets: string[];
  cta: string;
  href: string;
};

export const SERVICES: Service[] = [
  {
    title: "Discovery Call",
    desc: "A free intro call to see if we are a fit.",
    bullets: [
      "Understand your product and goals",
      "Where I would focus first",
      "Clear next steps, no pressure",
    ],
    cta: "Book free call",
    href: "/contact",
  },
  {
    title: "Consultancy",
    desc: "Strategic guidance to unblock and accelerate growth.",
    bullets: [
      "Full growth audit",
      "90-day action plan",
      "KPI and tooling setup",
    ],
    cta: "Work with me",
    href: "/contact",
  },
  {
    title: "Kickstarter",
    desc: "Hands-on execution, not just advice.",
    bullets: [
      "Weekly growth experiments",
      "Campaigns and automations built",
      "Tracked, reported, iterated",
    ],
    cta: "Launch with me",
    href: "/contact",
  },
];
