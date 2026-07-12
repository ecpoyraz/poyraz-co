# poyraz.co Rebuild — Design Spec

Date: 2026-06-22
Owner: Eyüp Poyraz
Status: Approved (design), pending implementation plan

## 1. Summary

Rebuild the existing Framer-based personal site at poyraz.co as a code-owned, statically generated Next.js site. Keep the visual identity and information architecture of the current site, add modern touches (dark mode, refined spacing, light animation), and manage all content as markdown so it can be authored and updated with AI assistance.

The current site is a clean, minimal marketing-and-portfolio site for a product marketer. It has a fixed left sidebar navigation and a content area with Hero, Projects, Notebook, Bookmarks, Tech Stack, and CTA sections.

## 2. Goals

All four goals were selected by the owner and the stack is chosen to satisfy every one:

1. Full control and ownership — own the code, customize without Framer limits.
2. AI-managed content — articles, projects, bookmarks, and stack entries live as markdown files; adding content is a single file plus a commit.
3. Low cost — free hosting on Vercel, no Framer subscription.
4. Performance and SEO — static generation, minimal client JavaScript, fast and well-indexed.

## 3. Non-Goals (out of scope for v1)

- CMS dashboard or admin UI. Content is edited as files in the repo.
- Authentication, user accounts, or any logged-in experience.
- A working newsletter backend. The signup form is wired to a provider later; v1 ships the UI and a placeholder handler.
- A working contact-form backend beyond a simple email or form provider integration. Decide provider during implementation.
- Migrating Framer analytics. Add analytics fresh if wanted.

## 4. Tech Stack

| Layer     | Choice                                     | Rationale                                                                                                                                        |
| --------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Framework | Next.js 15, App Router, TypeScript         | Owner preference, room for future dynamic features                                                                                               |
| Styling   | Tailwind CSS                               | Fast iteration, first-class dark mode, easy design refinements                                                                                   |
| Content   | Velite (MDX-backed, type-safe collections) | Turns markdown into typed data at build time, ideal for AI-authored content; fallback is gray-matter + next-mdx-remote if Velite causes friction |
| Theme     | next-themes                                | Light/dark toggle with no flash                                                                                                                  |
| Fonts     | Inter + Inter Display (next/font)          | Matches the existing site identity                                                                                                               |
| Hosting   | Vercel, static generation                  | Free, auto-build on push, custom domain support                                                                                                  |

Render model: all pages are statically generated at build time. No server runtime required for v1.

## 5. Architecture and Folder Structure

Content is separated from code. The `content/` tree is the AI-managed layer; adding a notebook post means adding one MDX file there.

```
poyraz-co/
├── content/                  markdown content, AI-managed layer
│   ├── notebook/             blog posts and case studies (.mdx)
│   ├── projects/             Param, Peerbie, future case studies (.mdx)
│   ├── bookmarks/            curated links (single data file or per-item .md)
│   └── stack/                tool detail pages (.mdx)
├── src/
│   ├── app/                  App Router routes
│   │   ├── layout.tsx        root layout: sidebar + content shell, theme provider
│   │   ├── page.tsx          home
│   │   ├── projects/
│   │   ├── notebook/
│   │   ├── stack/
│   │   ├── bookmarks/
│   │   ├── services/
│   │   ├── about/
│   │   └── contact/
│   ├── components/           Sidebar, ThemeToggle, Card variants, Section, Footer, MDX components
│   └── lib/                  helpers (date formatting, content queries)
├── public/                   images, og image, favicon
├── velite.config.ts          content collection schemas
├── tailwind.config.ts
└── next.config.ts
```

## 6. Routes and Pages

Routes mirror the current poyraz.co exactly:

| Route              | Type                          | Content                                                                                |
| ------------------ | ----------------------------- | -------------------------------------------------------------------------------------- |
| `/`                | static                        | Hero, Projects preview, Notebook preview, Bookmarks preview, Stack preview, CTA blocks |
| `/projects`        | static                        | Case study list                                                                        |
| `/projects/[slug]` | static (generateStaticParams) | Case study detail                                                                      |
| `/notebook`        | static                        | Article and case-study list, newsletter signup                                         |
| `/notebook/[slug]` | static (generateStaticParams) | Article detail                                                                         |
| `/stack`           | static                        | Tools grid                                                                             |
| `/stack/[slug]`    | static (generateStaticParams) | Tool detail with description and similar tools                                         |
| `/bookmarks`       | static                        | Curated links grid with category tags                                                  |
| `/services`        | static                        | Consultancy offer and CTA                                                              |
| `/about`           | static                        | Bio and background                                                                     |
| `/contact`         | static                        | Contact form (provider TBD)                                                            |

## 7. Design System

Faithful to poyraz.co with modern refinements ("close but polished").

- Layout: fixed left sidebar (logo and name, primary nav, Resources group, Connect group, search). Content area on the right with generous whitespace. On mobile the sidebar collapses into a top bar with a drawer menu.
- Color: light and dark themes.
  - Light: white background, near-black text, blue accent for links.
  - Dark: deep near-black background, light text, adjusted accent for contrast.
- Typography: Inter for body, Inter Display for headings. Sizes anchored to the current site (h1 ~36px, h2 ~24px, body ~14-16px).
- Surfaces: thin gray card borders, 6-8px border radius, no heavy shadows.
- Motion: light and tasteful — fade-in on scroll, hover transitions on cards and links. Respect prefers-reduced-motion.

## 8. Content Model

Frontmatter schemas validated by Velite (Zod). Exact fields finalized in the implementation plan; the shape below is the intent.

**notebook**

- title (string)
- date (date)
- category (enum: Article | Case Study)
- cover (image, optional)
- excerpt (string)
- draft (boolean, default false)
- body (MDX)

**projects**

- title (string)
- slug (string)
- category (string, e.g. Fintech, B2B SaaS)
- cover (image)
- summary (string)
- metrics (array of label/value, optional)
- order (number, for homepage ordering)
- body (MDX)

**bookmarks**

- title (string)
- url (string)
- tags (array of string)
- image (image, optional)
- addedAt (date)

**stack**

- name (string)
- slug (string)
- category (string, e.g. Automation, Analytics)
- logo (image)
- url (string, external tool link)
- description (string)
- body (MDX, "how I use it")

## 9. Data Flow

1. Author or AI writes/edits an MDX file under `content/`.
2. On build, Velite validates frontmatter against the schemas and emits typed data plus rendered MDX.
3. Page components import the generated collections, sort and filter as needed, and statically render lists and detail pages via `generateStaticParams`.
4. The build output is static HTML/CSS/JS deployed to Vercel.

No runtime database. Content changes ship through git commits and a redeploy.

## 10. Content Migration

Current content is migrated and refreshed ("move and update"):

- Scrape existing pages (about, services, two case studies, notebook articles, stack entries, bookmarks) from poyraz.co during implementation.
- Convert each to the matching MDX schema, downloading referenced images into `public/`.
- Flag any thin or outdated content for the owner to refresh before launch.

## 11. Deployment

- New git repository at `~/Documents/repos/poyraz-co`.
- Connect to Vercel, static build on every push to main.
- Point the poyraz.co domain to Vercel once parity with the Framer site is verified.
- Keep the Framer site live until cutover.

## 12. Success Criteria

- All routes from section 6 render with migrated content.
- Light and dark modes both look correct and match the refined identity.
- Lighthouse performance and SEO scores are high (target 95+ on a static build).
- Adding a new notebook post is demonstrably one MDX file plus a commit.
- Site deploys to a public Vercel URL before domain cutover.

## 13. Open Questions (resolve during planning)

- Contact form provider: simple mailto, Formspree, or Resend-backed route?
- Newsletter provider: which service (Buttondown, ConvertKit, Beehiiv)?
- Search: keep the sidebar search? If yes, client-side index over notebook/stack is enough.
- Bookmarks storage: per-item markdown files or a single structured data file?
