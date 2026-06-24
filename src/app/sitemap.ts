import type { MetadataRoute } from "next";
import { notebook, projects, stack } from "#content";

const base = "https://poyraz.co";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/projects",
    "/services",
    "/about",
    "/bookmarks",
    "/notebook",
    "/stack",
    "/contact",
  ];
  const collections = [
    ...notebook.filter((p) => !p.draft).map((p) => p.permalink),
    ...projects.filter((p) => !p.draft).map((p) => p.permalink),
    ...stack.filter((t) => !t.draft).map((t) => t.permalink),
  ];
  return [...staticRoutes, ...collections].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));
}
