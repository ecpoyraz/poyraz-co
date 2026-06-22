# poyraz.co Collections Implementation Plan (Phase 3)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the Projects, Stack, and Bookmarks content collections, reusing the Velite + MDXContent pattern proven in Phase 2, with list/detail pages and home-page previews.

**Architecture:** Three new Velite collections under `content/`. Projects and Stack each get a list page, a static `[slug]` detail page (MDX body via the existing MDXContent), and a home preview. Bookmarks is a flat grid (no detail page, external links). A small generic `published()` helper replaces the notebook-specific one so all collections share draft-filtering and sorting.

**Tech Stack:** Next.js 16, Tailwind v4, Velite, @tailwindcss/typography, Playwright. All built on the Phase 1 shell and Phase 2 content layer.

## Global Constraints

- Phases 1-2 are merged to `main`: shell + theming + Velite content layer + notebook (list/detail/preview/newsletter). Build on them.
- New collections live under `content/projects/*.mdx`, `content/stack/*.mdx`, `content/bookmarks/*.md`. Bookmarks have frontmatter only (no MDX body). All imported from `#content`.
- Reuse the existing `MDXContent` component for project/stack detail bodies. Do not reimplement MDX rendering.
- All pages statically generated; detail pages use `generateStaticParams`. Next 16: `params` is a Promise, await it.
- This phase uses a few SAMPLE entries per collection (2 projects, 3 stack tools, 3 bookmarks). No real-content migration (Phase 5).
- A generic `published<T>()` helper (filter `!draft`, sort by `date`/`order`) replaces `getPublishedPosts`; notebook is migrated to it so there is one helper, not four.
- npm. `@/*` and `#content` aliases. TypeScript strict. Site copy English.
- Lint gate: `npm run lint` must stay at 0 errors (Next 16 `next build` does NOT run ESLint, so run lint explicitly before each commit).
- Home page placeholder sections to fill: Projects (top of page) and Tech Stack and Bookmarks. Leave none as empty headings after this phase.

## File Structure

| File                               | Responsibility                                                   |
| ---------------------------------- | ---------------------------------------------------------------- |
| `velite.config.ts`                 | Modify. Add `projects`, `stack`, `bookmarks` collections         |
| `content/projects/*.mdx`           | Create. 2 sample case studies                                    |
| `content/stack/*.mdx`              | Create. 3 sample tools                                           |
| `content/bookmarks/*.md`           | Create. 3 sample bookmarks (frontmatter only)                    |
| `src/lib/collections.ts`           | Create. Generic `published()` + collection accessors             |
| `src/lib/posts.ts`                 | Modify. Re-export from collections (or delete, updating imports) |
| `src/components/project-card.tsx`  | Create                                                           |
| `src/components/stack-card.tsx`    | Create                                                           |
| `src/components/bookmark-card.tsx` | Create                                                           |
| `src/app/projects/page.tsx`        | Modify. List                                                     |
| `src/app/projects/[slug]/page.tsx` | Create. Detail                                                   |
| `src/app/stack/page.tsx`           | Modify. List/grid                                                |
| `src/app/stack/[slug]/page.tsx`    | Create. Detail                                                   |
| `src/app/bookmarks/page.tsx`       | Modify. Grid                                                     |
| `src/app/page.tsx`                 | Modify. Fill Projects, Tech Stack, Bookmarks previews            |
| `tests/smoke.spec.ts`              | Modify. New tests                                                |

---

## Task 1: Projects collection + generic helper + list/detail/preview

**Files:**

- Modify: `velite.config.ts`, `src/app/page.tsx`, `src/lib/posts.ts`
- Create: `src/lib/collections.ts`, `content/projects/param-embedded-finance.mdx`, `content/projects/peerbie-ai-productivity.mdx`, `src/components/project-card.tsx`, `src/app/projects/[slug]/page.tsx`
- Modify: `src/app/projects/page.tsx`

**Interfaces:**

- Produces: `published(items)` generic helper; `projects` from `#content` with `title, slug, category, summary, cover?, order, code, permalink`; `/projects` list, `/projects/[slug]` detail, and a home Projects preview.

- [ ] **Step 1: Add the projects collection to `velite.config.ts`**

Add a `projects` collection alongside `notebook` (keep notebook unchanged):

```ts
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
```

And register it: `collections: { notebook, projects }`.

- [ ] **Step 2: Create the generic helper `src/lib/collections.ts`**

```ts
export type Sortable = { draft?: boolean; date?: string; order?: number };

export function published<T extends Sortable>(items: T[]): T[] {
  return items
    .filter((i) => !i.draft)
    .sort((a, b) => {
      if (
        a.order !== undefined &&
        b.order !== undefined &&
        a.order !== b.order
      ) {
        return a.order - b.order;
      }
      return +new Date(b.date ?? 0) - +new Date(a.date ?? 0);
    });
}
```

- [ ] **Step 3: Migrate `src/lib/posts.ts` to the generic helper**

```ts
import { notebook } from "#content";
import { published } from "@/lib/collections";

export type Post = (typeof notebook)[number];

export function getPublishedPosts(): Post[] {
  return published([...notebook]);
}
```

- [ ] **Step 4: Create the two sample projects**

`content/projects/param-embedded-finance.mdx`:

```mdx
---
title: Param - Embedded Finance
slug: param-embedded-finance
category: Fintech
summary: Turkey's first licensed e-money institution, serving 10M+ users across an embedded finance ecosystem.
order: 1
---

## Overview

Param is an embedded finance platform. This is a sample case study body.

## Role

Growth and product marketing across acquisition and activation.
```

`content/projects/peerbie-ai-productivity.mdx`:

```mdx
---
title: Peerbie - AI Productivity Tool
slug: peerbie-ai-productivity
category: B2B SaaS
summary: An AI-powered workOS blending project management, communication, and AI workflows.
order: 2
---

## Overview

Peerbie is a B2B SaaS productivity tool. This is a sample case study body.

## Role

Go-to-market and positioning for the product launch.
```

- [ ] **Step 5: Create `src/components/project-card.tsx`**

```tsx
import Link from "next/link";
import type { projects } from "#content";

export function ProjectCard({
  project,
}: {
  project: (typeof projects)[number];
}) {
  return (
    <Link
      href={project.permalink}
      className="flex flex-col gap-1 rounded-md border border-border p-4 hover:opacity-80"
    >
      <span className="text-xs uppercase tracking-wide text-muted">
        {project.category}
      </span>
      <span className="font-display text-lg font-semibold text-foreground">
        {project.title}
      </span>
      <span className="text-sm text-muted">{project.summary}</span>
    </Link>
  );
}
```

- [ ] **Step 6: Write the failing tests (append to `tests/smoke.spec.ts`)**

```ts
test("projects list shows project titles", async ({ page }) => {
  await page.goto("/projects");
  await expect(
    page.getByRole("link", { name: /Param - Embedded Finance/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Peerbie - AI Productivity Tool/ }),
  ).toBeVisible();
});

test("project detail renders body", async ({ page }) => {
  await page.goto("/projects/param-embedded-finance");
  await expect(
    page.getByRole("heading", { level: 1, name: /Param - Embedded Finance/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 2, name: "Overview" }),
  ).toBeVisible();
});

test("home projects preview shows a project", async ({ page }) => {
  await page.goto("/");
  await expect(
    page
      .locator("main")
      .getByRole("link", { name: /Param - Embedded Finance/ }),
  ).toBeVisible();
});
```

- [ ] **Step 7: Run the tests to verify they fail**

Run: `npx playwright test tests/smoke.spec.ts -g "project"`
Expected: FAIL (no projects pages/content yet).

- [ ] **Step 8: Replace `src/app/projects/page.tsx`**

```tsx
import { projects } from "#content";
import { published } from "@/lib/collections";
import { ProjectCard } from "@/components/project-card";

export default function ProjectsPage() {
  const items = published([...projects]);
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          Projects
        </h1>
        <p className="mt-2 text-muted">
          Selected work across fintech and SaaS.
        </p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 9: Create `src/app/projects/[slug]/page.tsx`**

```tsx
import { notFound } from "next/navigation";
import { projects } from "#content";
import { MDXContent } from "@/components/mdx-content";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();
  return (
    <article className="flex flex-col gap-6">
      <header>
        <span className="text-xs uppercase tracking-wide text-muted">
          {project.category}
        </span>
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          {project.title}
        </h1>
        <p className="mt-2 text-muted">{project.summary}</p>
      </header>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <MDXContent code={project.code} />
      </div>
    </article>
  );
}
```

- [ ] **Step 10: Fill the home Projects section in `src/app/page.tsx`**

Add imports (`import { projects } from '#content'`, `published`, `ProjectCard`). Replace the existing `<section><h2 ...>Projects</h2></section>` with:

```tsx
<section>
  <h2 className="font-display text-2xl font-semibold">Projects</h2>
  <div className="mt-4 grid gap-4 sm:grid-cols-2">
    {published([...projects])
      .slice(0, 2)
      .map((project) => (
        <ProjectCard key={project.slug} project={project} />
      ))}
  </div>
</section>
```

- [ ] **Step 11: Run the project tests, full suite, lint, build**

```bash
npx playwright test tests/smoke.spec.ts -g "project"
npx playwright test
npm run lint
npm run build
```

Expected: project tests pass, full suite green, lint 0 errors, build static with both `/projects/[slug]` prerendered.

- [ ] **Step 12: Commit**

```bash
git add -A
git commit -m "feat: add projects collection with list, detail, and home preview"
```

---

## Task 2: Stack collection + list/detail/preview

**Files:**

- Modify: `velite.config.ts`, `src/app/page.tsx`, `src/app/stack/page.tsx`
- Create: `content/stack/*.mdx` (3), `src/components/stack-card.tsx`, `src/app/stack/[slug]/page.tsx`

**Interfaces:**

- Consumes: `published`, `MDXContent`.
- Produces: `stack` from `#content` with `name, slug, category, url, description, logo?, code, permalink`; `/stack` grid, `/stack/[slug]` detail, home Tech Stack preview.

- [ ] **Step 1: Add the stack collection to `velite.config.ts`**

```ts
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
      logo: s.image().optional(),
      draft: s.boolean().default(false),
      code: s.mdx(),
    })
    .transform((data) => ({ ...data, permalink: `/stack/${data.slug}` })),
});
```

Register: `collections: { notebook, projects, stack }`.

- [ ] **Step 2: Create three sample tools**

Create `content/stack/notion.mdx`, `content/stack/mixpanel.mdx`, `content/stack/figma.mdx`. Each follows this shape (vary the values):

`content/stack/notion.mdx`:

```mdx
---
name: Notion
slug: notion
category: Work Management
url: https://notion.so
description: Work management and documentation hub.
---

## How I use it

Sample body: docs, project tracking, and knowledge base.
```

`content/stack/mixpanel.mdx`:

```mdx
---
name: Mixpanel
slug: mixpanel
category: Product Analytics
url: https://mixpanel.com
description: Product analytics for funnels and retention.
---

## How I use it

Sample body: event tracking and funnel analysis.
```

`content/stack/figma.mdx`:

```mdx
---
name: Figma
slug: figma
category: Design
url: https://figma.com
description: Design and prototyping tool.
---

## How I use it

Sample body: wireframes and design handoff.
```

- [ ] **Step 3: Create `src/components/stack-card.tsx`**

```tsx
import Link from "next/link";
import type { stack } from "#content";

export function StackCard({ tool }: { tool: (typeof stack)[number] }) {
  return (
    <Link
      href={tool.permalink}
      className="flex flex-col gap-1 rounded-md border border-border p-4 hover:opacity-80"
    >
      <span className="font-display text-base font-semibold text-foreground">
        {tool.name}
      </span>
      <span className="text-xs uppercase tracking-wide text-muted">
        {tool.category}
      </span>
      <span className="text-sm text-muted">{tool.description}</span>
    </Link>
  );
}
```

- [ ] **Step 4: Write the failing tests (append to `tests/smoke.spec.ts`)**

```ts
test("stack list shows tools", async ({ page }) => {
  await page.goto("/stack");
  await expect(page.getByRole("link", { name: /Notion/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /Mixpanel/ })).toBeVisible();
});

test("stack detail renders body", async ({ page }) => {
  await page.goto("/stack/notion");
  await expect(
    page.getByRole("heading", { level: 1, name: "Notion" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 2, name: "How I use it" }),
  ).toBeVisible();
});
```

- [ ] **Step 5: Run to verify they fail**

Run: `npx playwright test tests/smoke.spec.ts -g "stack"`
Expected: FAIL.

- [ ] **Step 6: Replace `src/app/stack/page.tsx`**

```tsx
import { stack } from "#content";
import { published } from "@/lib/collections";
import { StackCard } from "@/components/stack-card";

export default function StackPage() {
  const tools = published([...stack]);
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          Stack
        </h1>
        <p className="mt-2 text-muted">Tools I use on a regular basis.</p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2">
        {tools.map((tool) => (
          <StackCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 7: Create `src/app/stack/[slug]/page.tsx`**

```tsx
import { notFound } from "next/navigation";
import { stack } from "#content";
import { MDXContent } from "@/components/mdx-content";

export function generateStaticParams() {
  return stack.map((tool) => ({ slug: tool.slug }));
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = stack.find((t) => t.slug === slug);
  if (!tool) notFound();
  return (
    <article className="flex flex-col gap-6">
      <header>
        <span className="text-xs uppercase tracking-wide text-muted">
          {tool.category}
        </span>
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          {tool.name}
        </h1>
        <a
          href={tool.url}
          target="_blank"
          rel="noreferrer"
          className="mt-2 text-sm text-accent hover:underline"
        >
          Visit website
        </a>
      </header>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <MDXContent code={tool.code} />
      </div>
    </article>
  );
}
```

- [ ] **Step 8: Fill the home Tech Stack section in `src/app/page.tsx`**

Add imports (`import { stack } from '#content'`, `StackCard`). Replace the `<section><h2 ...>Tech Stack</h2></section>` with:

```tsx
<section>
  <h2 className="font-display text-2xl font-semibold">Tech Stack</h2>
  <div className="mt-4 grid gap-4 sm:grid-cols-2">
    {published([...stack])
      .slice(0, 4)
      .map((tool) => (
        <StackCard key={tool.slug} tool={tool} />
      ))}
  </div>
</section>
```

- [ ] **Step 9: Run stack tests, full suite, lint, build**

```bash
npx playwright test tests/smoke.spec.ts -g "stack"
npx playwright test
npm run lint
npm run build
```

Expected: all green; `/stack/[slug]` prerendered for all three tools.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: add stack collection with list, detail, and home preview"
```

---

## Task 3: Bookmarks collection + grid + preview

**Files:**

- Modify: `velite.config.ts`, `src/app/page.tsx`, `src/app/bookmarks/page.tsx`
- Create: `content/bookmarks/*.md` (3), `src/components/bookmark-card.tsx`

**Interfaces:**

- Consumes: `published`.
- Produces: `bookmarks` from `#content` with `title, url, tags, image?, date`; `/bookmarks` grid; home Bookmarks preview. No detail page (external links).

- [ ] **Step 1: Add the bookmarks collection to `velite.config.ts`**

```ts
const bookmarks = defineCollection({
  name: "Bookmark",
  pattern: "bookmarks/*.md",
  schema: s.object({
    title: s.string(),
    url: s.string().url(),
    tags: s.array(s.string()).default([]),
    image: s.image().optional(),
    date: s.isodate(),
    draft: s.boolean().default(false),
  }),
});
```

Register: `collections: { notebook, projects, stack, bookmarks }`.

- [ ] **Step 2: Create three sample bookmarks (frontmatter only, body empty)**

`content/bookmarks/ga4-mcp-claude.md`:

```md
---
title: How To Integrate GA4 MCP + Claude
url: https://example.com/ga4-mcp-claude
tags: [Data, AI]
date: 2024-10-01
---
```

`content/bookmarks/how-anthropic-uses-ai.md`:

```md
---
title: How Anthropic Uses AI
url: https://www.anthropic.com
tags: [Guideline, AI]
date: 2024-09-15
---
```

`content/bookmarks/onboard-users-mobile.md`:

```md
---
title: How To Onboard Users In Mobile Apps
url: https://example.com/onboarding
tags: [Onboarding, Mobile]
date: 2024-08-20
---
```

- [ ] **Step 3: Create `src/components/bookmark-card.tsx`**

```tsx
import type { bookmarks } from "#content";

export function BookmarkCard({
  bookmark,
}: {
  bookmark: (typeof bookmarks)[number];
}) {
  return (
    <a
      href={bookmark.url}
      target="_blank"
      rel="noreferrer"
      className="flex flex-col gap-2 rounded-md border border-border p-4 hover:opacity-80"
    >
      <span className="font-display text-base font-semibold text-foreground">
        {bookmark.title}
      </span>
      <div className="flex flex-wrap gap-2">
        {bookmark.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs uppercase tracking-wide text-muted"
          >
            {tag}
          </span>
        ))}
      </div>
    </a>
  );
}
```

- [ ] **Step 4: Write the failing tests (append to `tests/smoke.spec.ts`)**

```ts
test("bookmarks grid shows bookmarks", async ({ page }) => {
  await page.goto("/bookmarks");
  await expect(
    page.getByRole("link", { name: /How Anthropic Uses AI/ }),
  ).toBeVisible();
});

test("home bookmarks preview shows a bookmark", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.locator("main").getByRole("link", { name: /How Anthropic Uses AI/ }),
  ).toBeVisible();
});
```

- [ ] **Step 5: Run to verify they fail**

Run: `npx playwright test tests/smoke.spec.ts -g "bookmark"`
Expected: FAIL.

- [ ] **Step 6: Replace `src/app/bookmarks/page.tsx`**

```tsx
import { bookmarks } from "#content";
import { published } from "@/lib/collections";
import { BookmarkCard } from "@/components/bookmark-card";

export default function BookmarksPage() {
  const items = published([...bookmarks]);
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          Bookmarks
        </h1>
        <p className="mt-2 text-muted">Things worth saving.</p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((bookmark) => (
          <BookmarkCard key={bookmark.url} bookmark={bookmark} />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 7: Fill the home Bookmarks section in `src/app/page.tsx`**

Add imports (`import { bookmarks } from '#content'`, `BookmarkCard`). Replace the `<section><h2 ...>Bookmarks</h2></section>` with:

```tsx
<section>
  <h2 className="font-display text-2xl font-semibold">Bookmarks</h2>
  <div className="mt-4 grid gap-4 sm:grid-cols-2">
    {published([...bookmarks])
      .slice(0, 4)
      .map((bookmark) => (
        <BookmarkCard key={bookmark.url} bookmark={bookmark} />
      ))}
  </div>
</section>
```

- [ ] **Step 8: Run bookmark tests, full suite, lint, build**

```bash
npx playwright test tests/smoke.spec.ts -g "bookmark"
npx playwright test
npm run lint
npm run build
```

Expected: all green; build static. No home section is an empty heading anymore.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: add bookmarks collection with grid and home preview"
```

---

## Self-Review Notes

- Spec coverage: delivers spec section 6 (projects, stack, bookmarks routes) and section 8 (their content models). Reuses the Phase 2 MDXContent and Velite pipeline.
- The generic `published()` helper replaces `getPublishedPosts`'s internals while keeping `getPublishedPosts` as a thin wrapper, so Phase 2 tests keep passing.
- Type consistency: `published`, `ProjectCard`, `StackCard`, `BookmarkCard`, `projects`/`stack`/`bookmarks` from `#content`.
- Lint is run before every commit (Next 16 build skips ESLint).
- `generateStaticParams` for projects/stack uses the raw collection (same accepted tradeoff as notebook; no drafts in samples).

## Done When

- `/projects`, `/projects/[slug]`, `/stack`, `/stack/[slug]`, `/bookmarks` all render from their collections; project/stack detail bodies render MDX.
- The home page shows Projects, Tech Stack, and Bookmarks previews (no empty placeholder sections remain).
- `npm run build` is static with all detail slugs prerendered; `npm run lint` is 0 errors; full Playwright suite green.
