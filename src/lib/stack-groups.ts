export type StackGroup = { title: string; slugs: string[] };

export const GROUPS: StackGroup[] = [
  {
    title: "Design & Build",
    slugs: ["n8n", "chatgpt", "framer", "lovable", "figma"],
  },
  {
    title: "Data & Analytics",
    slugs: ["mixpanel", "looker-studio", "adjust"],
  },
  {
    title: "CRM & Engagement",
    slugs: ["intercom", "hubspot", "insider"],
  },
  {
    title: "Work Management",
    slugs: ["notion", "arc"],
  },
];

// Other tools in the same group, used for the "Similar Apps" section.
export function similarSlugs(slug: string): string[] {
  const group = GROUPS.find((g) => g.slugs.includes(slug));
  if (!group) return [];
  return group.slugs.filter((s) => s !== slug);
}
