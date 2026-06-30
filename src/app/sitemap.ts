import type { MetadataRoute } from "next";
import { notebook, projects } from "#content";

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
  ];
  return [...staticRoutes, ...collections].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));
}
