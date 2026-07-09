import type { MetadataRoute } from "next";
import { notebook, projects } from "#content";
import { SITE_URL } from "@/lib/site";

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
  // Only notebook entries carry real content dates (frontmatter date/updated).
  // Static routes and projects omit lastModified rather than emitting a
  // meaningless build timestamp.
  return [
    ...staticRoutes.map((path) => ({ url: `${SITE_URL}${path}` })),
    ...notebook
      .filter((p) => !p.draft)
      .map((p) => ({
        url: `${SITE_URL}${p.permalink}`,
        lastModified: new Date(p.updated ?? p.date),
      })),
    ...projects
      .filter((p) => !p.draft)
      .map((p) => ({ url: `${SITE_URL}${p.permalink}` })),
  ];
}
