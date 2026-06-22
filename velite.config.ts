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
      cover: s.image().optional(),
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
      cover: s.image().optional(),
      order: s.number().default(0),
      draft: s.boolean().default(false),
      code: s.mdx(),
    })
    .transform((data) => ({ ...data, permalink: `/projects/${data.slug}` })),
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
  collections: { notebook, projects },
});
