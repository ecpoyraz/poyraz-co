import { defineConfig, defineCollection, s } from "velite";

const notebook = defineCollection({
  name: "Post",
  pattern: "notebook/*.mdx",
  schema: s
    .object({
      title: s.string(),
      date: s.isodate(),
      slug: s.slug("notebook"),
      category: s.enum(["Article", "Case Study"]),
      excerpt: s.string(),
      cover: s.string().optional(),
      draft: s.boolean().default(false),
      code: s.mdx(),
    })
    .transform((data) => ({ ...data, permalink: `/notebook/${data.slug}` })),
});

const projects = defineCollection({
  name: "Project",
  pattern: "projects/*.mdx",
  schema: s
    .object({
      title: s.string(),
      slug: s.slug("projects"),
      category: s.string(),
      summary: s.string(),
      cover: s.string().optional(),
      order: s.number().default(0),
      tags: s.array(s.string()).default([]),
      draft: s.boolean().default(false),
      code: s.mdx(),
    })
    .transform((data) => ({ ...data, permalink: `/projects/${data.slug}` })),
});

const stack = defineCollection({
  name: "Tool",
  pattern: "stack/*.mdx",
  schema: s
    .object({
      name: s.string(),
      slug: s.slug("stack"),
      category: s.string(),
      url: s.string().url(),
      description: s.string(),
      logo: s.string().optional(),
      draft: s.boolean().default(false),
      code: s.mdx(),
    })
    .transform((data) => ({ ...data, permalink: `/stack/${data.slug}` })),
});

const bookmarks = defineCollection({
  name: "Bookmark",
  pattern: "bookmarks/*.md",
  schema: s.object({
    title: s.string(),
    url: s.string().url(),
    tags: s.array(s.string()).default([]),
    image: s.string().optional(),
    date: s.isodate(),
    draft: s.boolean().default(false),
  }),
});

export default defineConfig({
  root: "content",
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    name: "[name]-[hash:6].[ext]",
    clean: true,
  },
  collections: { notebook, projects, stack, bookmarks },
});
