export type NavLink = { label: string; href: string; external?: boolean };
export type NavGroup = { title?: string; links: NavLink[] };

export const HEADER_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Services", href: "/services" },
  { label: "Notebook", href: "/notebook" },
  { label: "About", href: "/about" },
];

export const NAV_GROUPS: NavGroup[] = [
  {
    links: [
      { label: "Home", href: "/" },
      { label: "Projects", href: "/projects" },
      { label: "Services", href: "/services" },
      { label: "About", href: "/about" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Bookmarks", href: "/bookmarks" },
      { label: "Notebook", href: "/notebook" },
      { label: "Stack", href: "/stack" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "X", href: "https://x.com/eyuppoyraz", external: true },
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/eyuppoyraz/",
        external: true,
      },
    ],
  },
];
