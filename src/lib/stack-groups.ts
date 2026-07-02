export type StackGroup = {
  title: string;
  description: string;
  slugs: string[];
};

export const GROUPS: StackGroup[] = [
  {
    title: "AI & Build",
    description: "How I actually ship things now.",
    slugs: ["claude-code", "codex", "n8n"],
  },
  {
    title: "Growth & Analytics",
    description: "Measuring what matters and acting on it.",
    slugs: ["mixpanel", "microsoft-clarity", "looker-studio", "adjust"],
  },
  {
    title: "CRM & Outreach",
    description: "Reaching, converting, and keeping users.",
    slugs: ["insider", "intercom", "hubspot", "apollo"],
  },
  {
    title: "Design & Creative",
    description: "Making it look and feel right, fast.",
    slugs: ["figma", "fal-ai"],
  },
  {
    title: "Knowledge & Work",
    description: "Where thinking and planning live.",
    slugs: ["notion", "obsidian", "arc", "granola", "wispr-flow"],
  },
];
