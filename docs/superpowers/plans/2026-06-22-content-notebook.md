# poyraz.co Content + Notebook Implementation Plan (Phase 2)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up the Velite markdown content layer and build the Notebook (blog) section: list page, detail pages, home preview, and a newsletter signup UI, driven by a small number of sample MDX posts.

**Architecture:** Velite compiles MDX files under `content/notebook/` into a typed data layer at build time (output `.velite/`, imported via a `#content` path alias). Notebook pages statically render from that data: a list page, a `generateStaticParams` detail route, and a home-page preview. MDX bodies render through a small `MDXContent` component using `react/jsx-runtime`. This phase ships 2 sample posts, not the real content migration (that is Phase 5).

**Tech Stack:** Next.js 16 (App Router), TypeScript, Tailwind CSS v4, Velite, @tailwindcss/typography, Playwright.

## Global Constraints

- Foundation (Phase 1) is already merged to `main`: Next 16, Tailwind v4, TS strict, next-themes, sidebar/footer/layout shell, Playwright suite. Build on it; do not rebuild it.
- Content lives under `content/notebook/*.mdx`. Velite output goes to `.velite/` (gitignored) and is imported via a tsconfig path alias `#content`.
- All notebook pages are statically generated. Detail pages use `generateStaticParams`.
- Render model stays static; no server runtime.
- This phase uses 2 sample posts only. No scraping or real-content migration.
- Newsletter signup is UI only: a form with a client-side submitted state and NO backend call. No provider integration in this phase.
- Package manager npm. Import alias `@/*` → `src/*`. Site copy English.
- **Velite risk gate:** Velite must build under Next 16 + Turbopack. Task 1 verifies this early. If `velite build` or the Next build fails specifically due to Velite/Turbopack incompatibility that cannot be resolved by the documented `next.config` approach, STOP and report BLOCKED with the error — the fallback is `gray-matter` + `next-mdx-remote`, which is a plan change to decide with the controller, not to improvise.
- Sample post frontmatter shape (use exactly, both sample files):
  ```
  ---
  title: <string>
  date: <YYYY-MM-DD>
  slug: <kebab-slug>
  category: Article | Case Study
  excerpt: <one sentence>
  ---
  ```

## File Structure

| File                                   | Responsibility                                               |
| -------------------------------------- | ------------------------------------------------------------ |
| `velite.config.ts`                     | Create. Notebook collection schema, output config            |
| `next.config.ts`                       | Modify. Trigger `velite build` on dev/build (Turbopack-safe) |
| `tsconfig.json`                        | Modify. Add `#content` path alias → `./.velite`              |
| `.gitignore`                           | Modify. Ignore `.velite/`                                    |
| `content/notebook/*.mdx`               | Create. 2 sample posts                                       |
| `src/components/mdx-content.tsx`       | Create. Renders Velite-compiled MDX code                     |
| `src/components/post-card.tsx`         | Create. List/preview card for a post                         |
| `src/components/newsletter-signup.tsx` | Create. Signup form UI, placeholder submit                   |
| `src/lib/posts.ts`                     | Create. Sorted/published post helpers                        |
| `src/app/notebook/page.tsx`            | Modify. Replace placeholder with the post list + signup      |
| `src/app/notebook/[slug]/page.tsx`     | Create. Post detail with generateStaticParams                |
| `src/app/page.tsx`                     | Modify. Fill the home "Notebook" section with a preview      |
| `src/app/globals.css`                  | Modify. Enable typography plugin for prose                   |

---

## Task 1: Velite content layer + notebook collection + sample posts

**Files:**

- Create: `velite.config.ts`, `content/notebook/how-to-use-chatgpt-as-a-marketer.mdx`, `content/notebook/launching-a-product.mdx`
- Modify: `next.config.ts`, `tsconfig.json`, `.gitignore`

**Interfaces:**

- Produces: a `#content` module exporting `notebook` (array of posts), each with `title`, `date`, `slug`, `category`, `excerpt`, `code` (compiled MDX string), and `permalink`.

- [ ] **Step 1: Install Velite**

```bash
cd ~/Documents/repos/poyraz-co
npm install -D velite
```

- [ ] **Step 2: Create `velite.config.ts`**

```ts
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

export default defineConfig({
  root: "content",
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    name: "[name]-[hash:6].[ext]",
    clean: true,
  },
  collections: { notebook },
});
```

- [ ] **Step 3: Wire Velite into `next.config.ts` (Turbopack-safe)**

Add, above the existing `nextConfig`, this block (uses the documented async-import trigger that works with Turbopack):

```ts
const isDev = process.argv.indexOf("dev") !== -1;
const isBuild = process.argv.indexOf("build") !== -1;
if (!process.env.VELITE_STARTED && (isDev || isBuild)) {
  process.env.VELITE_STARTED = "1";
  import("velite").then((m) => m.build({ watch: isDev, clean: !isDev }));
}
```

Keep the rest of `next.config.ts` as-is.

- [ ] **Step 4: Add the `#content` path alias to `tsconfig.json`**

In `compilerOptions.paths`, add alongside the existing `@/*`:

```json
"#content": ["./.velite"]
```

- [ ] **Step 5: Ignore the generated output**

Append to `.gitignore`:

```
/.velite
```

- [ ] **Step 6: Create the two sample posts**

`content/notebook/how-to-use-chatgpt-as-a-marketer.mdx`:

```mdx
---
title: How To Use ChatGPT As A Marketer
date: 2024-09-01
slug: how-to-use-chatgpt-as-a-marketer
category: Article
excerpt: Practical ways a marketer can put ChatGPT to work across research, copy, and analysis.
---

ChatGPT is a natural language tool that can speed up a marketer's day-to-day work.

## Research

Use it to summarize long reports and surface the questions you have not asked yet.

## Copy

Draft first versions fast, then edit for voice. The model gets you to the second draft, not the final one.
```

`content/notebook/launching-a-product.mdx`:

```mdx
---
title: Launching A New Product
date: 2024-06-15
slug: launching-a-product
category: Case Study
excerpt: How we changed product-market fit and our go-to-market strategy to launch a B2B SaaS tool.
---

This is a short case study on launching a B2B SaaS product by changing our positioning.

## The problem

Our first positioning did not match how buyers described their pain.

## The change

We rewrote the go-to-market around a single workflow and the activation rate moved.
```

- [ ] **Step 7: Build to verify Velite runs under Next 16**

Run: `npm run build`
Expected: build succeeds AND a `.velite/` directory is generated containing the notebook data. Verify:

```bash
ls .velite && node -e "import('./.velite/index.js').then(m => console.log(m.notebook.map(p => p.slug)))"
```

Expected output includes the two slugs. If the Next build fails specifically because of Velite/Turbopack, STOP and report BLOCKED with the exact error (see Global Constraints risk gate).

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: add Velite content layer and notebook collection with sample posts"
```

---

## Task 2: MDXContent renderer

**Files:**

- Create: `src/components/mdx-content.tsx`

**Interfaces:**

- Consumes: a Velite-compiled MDX `code` string.
- Produces: `<MDXContent code={string} components?={Record<string, React.ComponentType>} />` that renders the MDX as React.

- [ ] **Step 1: Create `src/components/mdx-content.tsx`**

```tsx
import * as runtime from "react/jsx-runtime";

const sharedComponents: Record<string, React.ComponentType> = {};

function useMDXComponent(code: string) {
  const fn = new Function(code);
  return fn({ ...runtime }).default;
}

export function MDXContent({
  code,
  components,
}: {
  code: string;
  components?: Record<string, React.ComponentType>;
}) {
  const Component = useMDXComponent(code);
  return <Component components={{ ...sharedComponents, ...components }} />;
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors. (This component is exercised by Task 4's page test; it has no standalone test because it requires compiled MDX input, which the detail page provides.)

- [ ] **Step 3: Commit**

```bash
git add src/components/mdx-content.tsx
git commit -m "feat: add MDXContent renderer for Velite MDX"
```

---

## Task 3: Post helpers + Notebook list page

**Files:**

- Create: `src/lib/posts.ts`, `src/components/post-card.tsx`
- Modify: `src/app/notebook/page.tsx`

**Interfaces:**

- Consumes: `notebook` from `#content`.
- Produces: `getPublishedPosts()` returning non-draft posts sorted newest-first; `<PostCard post={Post} />`; a `/notebook` page listing all published posts.

- [ ] **Step 1: Create `src/lib/posts.ts`**

```ts
import { notebook } from "#content";

export type Post = (typeof notebook)[number];

export function getPublishedPosts(): Post[] {
  return notebook
    .filter((p) => !p.draft)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));
}
```

- [ ] **Step 2: Create `src/components/post-card.tsx`**

```tsx
import Link from "next/link";
import type { Post } from "@/lib/posts";

export function PostCard({ post }: { post: Post }) {
  return (
    <Link
      href={post.permalink}
      className="flex flex-col gap-1 border-b border-border py-4 hover:opacity-80"
    >
      <span className="text-xs uppercase tracking-wide text-muted">
        {post.category}
      </span>
      <span className="font-display text-lg font-semibold text-foreground">
        {post.title}
      </span>
      <span className="text-sm text-muted">{post.excerpt}</span>
    </Link>
  );
}
```

- [ ] **Step 3: Write the failing test (append to `tests/smoke.spec.ts`)**

```ts
test("notebook list shows post titles", async ({ page }) => {
  await page.goto("/notebook");
  await expect(
    page.getByRole("link", { name: /How To Use ChatGPT As A Marketer/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Launching A New Product/ }),
  ).toBeVisible();
});
```

- [ ] **Step 4: Run it to verify it fails**

Run: `npx playwright test tests/smoke.spec.ts -g "notebook list"`
Expected: FAIL (current /notebook is the placeholder h1 only).

- [ ] **Step 5: Replace `src/app/notebook/page.tsx`**

```tsx
import { getPublishedPosts } from "@/lib/posts";
import { PostCard } from "@/components/post-card";

export default function NotebookPage() {
  const posts = getPublishedPosts();
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          Notebook
        </h1>
        <p className="mt-2 text-muted">
          Thoughts and notes on product and marketing.
        </p>
      </header>
      <div className="flex flex-col">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Run the test to verify it passes**

Run: `npx playwright test tests/smoke.spec.ts -g "notebook list"`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add notebook list page with post cards"
```

---

## Task 4: Notebook detail page + prose typography

**Files:**

- Modify: `src/app/globals.css` (enable typography plugin)
- Create: `src/app/notebook/[slug]/page.tsx`

**Interfaces:**

- Consumes: `getPublishedPosts`, `notebook` from `#content`, `MDXContent`.
- Produces: a statically generated `/notebook/[slug]` page rendering the post title and MDX body in a `prose` container.

- [ ] **Step 1: Install the typography plugin**

```bash
npm install -D @tailwindcss/typography
```

- [ ] **Step 2: Enable it in `src/app/globals.css`**

Add directly after the `@import "tailwindcss";` line:

```css
@plugin "@tailwindcss/typography";
```

- [ ] **Step 3: Write the failing test (append to `tests/smoke.spec.ts`)**

```ts
test("notebook detail renders post body", async ({ page }) => {
  await page.goto("/notebook/how-to-use-chatgpt-as-a-marketer");
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /How To Use ChatGPT As A Marketer/,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 2, name: "Research" }),
  ).toBeVisible();
});
```

- [ ] **Step 4: Run it to verify it fails**

Run: `npx playwright test tests/smoke.spec.ts -g "notebook detail"`
Expected: FAIL (route does not exist yet, 404).

- [ ] **Step 5: Create `src/app/notebook/[slug]/page.tsx`**

```tsx
import { notFound } from "next/navigation";
import { notebook } from "#content";
import { MDXContent } from "@/components/mdx-content";

export function generateStaticParams() {
  return notebook.map((post) => ({ slug: post.slug }));
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = notebook.find((p) => p.slug === slug);
  if (!post) notFound();
  return (
    <article className="flex flex-col gap-6">
      <header>
        <span className="text-xs uppercase tracking-wide text-muted">
          {post.category}
        </span>
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          {post.title}
        </h1>
      </header>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <MDXContent code={post.code} />
      </div>
    </article>
  );
}
```

Note: in Next 16, `params` is a Promise and must be awaited.

- [ ] **Step 6: Run the test to verify it passes**

Run: `npx playwright test tests/smoke.spec.ts -g "notebook detail"`
Expected: PASS.

- [ ] **Step 7: Verify static generation**

Run: `npm run build`
Expected: build lists `/notebook/[slug]` prerendered for both sample slugs (look for the two paths in the route output).

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: add notebook detail page with MDX rendering and prose styling"
```

---

## Task 5: Home page notebook preview

**Files:**

- Modify: `src/app/page.tsx`

**Interfaces:**

- Consumes: `getPublishedPosts`, `PostCard`.
- Produces: the home "Notebook" section showing the latest 3 posts instead of an empty heading.

- [ ] **Step 1: Write the failing test (append to `tests/smoke.spec.ts`)**

```ts
test("home notebook preview shows a recent post", async ({ page }) => {
  await page.goto("/");
  const main = page.locator("main");
  await expect(
    main.getByRole("link", { name: /Launching A New Product/ }),
  ).toBeVisible();
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx playwright test tests/smoke.spec.ts -g "home notebook preview"`
Expected: FAIL (home Notebook section is an empty heading).

- [ ] **Step 3: Update the Notebook section in `src/app/page.tsx`**

Add the imports at the top:

```tsx
import { getPublishedPosts } from "@/lib/posts";
import { PostCard } from "@/components/post-card";
```

Make the component read posts and replace the existing `<section><h2 ...>Notebook</h2></section>` with:

```tsx
<section>
  <h2 className="font-display text-2xl font-semibold">Notebook</h2>
  <div className="mt-4 flex flex-col">
    {getPublishedPosts()
      .slice(0, 3)
      .map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
  </div>
</section>
```

Leave the other home sections (Projects, Bookmarks, Tech Stack) as their placeholder headings for now.

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx playwright test tests/smoke.spec.ts -g "home notebook preview"`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: show latest notebook posts on the home page"
```

---

## Task 6: Newsletter signup UI

**Files:**

- Create: `src/components/newsletter-signup.tsx`
- Modify: `src/app/notebook/page.tsx`

**Interfaces:**

- Produces: `<NewsletterSignup />`, a client component with an email input and submit that shows a thank-you state. No network call.

- [ ] **Step 1: Create `src/components/newsletter-signup.tsx`**

```tsx
"use client";

import { useState } from "react";

export function NewsletterSignup() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <section className="mt-10 border-t border-border pt-6">
      <h2 className="font-display text-lg font-semibold">Join 1K+ readers</h2>
      <p className="mt-1 text-sm text-muted">
        Sent out every two weeks. No spam.
      </p>
      {submitted ? (
        <p className="mt-3 text-sm text-foreground">Thanks for subscribing.</p>
      ) : (
        <form
          className="mt-3 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
        >
          <input
            type="email"
            required
            placeholder="you@email.com"
            aria-label="Email address"
            className="flex-1 rounded-md border border-border bg-transparent px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="rounded-md border border-border px-4 py-2 text-sm text-foreground hover:opacity-80"
          >
            Submit
          </button>
        </form>
      )}
    </section>
  );
}
```

- [ ] **Step 2: Write the failing test (append to `tests/smoke.spec.ts`)**

```ts
test("newsletter signup shows thank-you after submit", async ({ page }) => {
  await page.goto("/notebook");
  await page.getByLabel("Email address").fill("test@example.com");
  await page.getByRole("button", { name: "Submit" }).click();
  await expect(page.getByText("Thanks for subscribing.")).toBeVisible();
});
```

- [ ] **Step 3: Run it to verify it fails**

Run: `npx playwright test tests/smoke.spec.ts -g "newsletter signup"`
Expected: FAIL (no signup form on /notebook yet).

- [ ] **Step 4: Render it on the notebook page**

In `src/app/notebook/page.tsx`, import `NewsletterSignup` and render `<NewsletterSignup />` as the last child of the page's root `div`:

```tsx
import { NewsletterSignup } from "@/components/newsletter-signup";
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx playwright test tests/smoke.spec.ts -g "newsletter signup"`
Expected: PASS.

- [ ] **Step 6: Run the full suite and build**

```bash
npm run build && npx playwright test
```

Expected: all tests pass; build static.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add newsletter signup UI to notebook page"
```

---

## Self-Review Notes

- Spec coverage: delivers spec sections 6 (notebook list + detail routes), 8 (notebook content model), 9 (data flow: MDX → Velite → typed import → static render). Newsletter is UI-only per spec non-goals. Projects/Stack/Bookmarks collections are Phase 3; their home placeholders stay untouched here.
- Velite risk is front-loaded in Task 1 Step 7 with an explicit BLOCKED path to the gray-matter fallback.
- Type names consistent: `Post`, `getPublishedPosts`, `PostCard`, `MDXContent`, `NewsletterSignup`, `notebook` (from `#content`).
- Next 16 specifics honored: `params` awaited as a Promise in the detail page.

## Done When

- `npm run build` generates `.velite/`, both sample posts, and statically prerenders `/notebook` and both `/notebook/[slug]` paths.
- `/notebook` lists posts; each links to a detail page that renders the MDX body with prose styling.
- The home page Notebook section shows recent posts.
- The newsletter form shows a thank-you state on submit.
- Full Playwright suite green (Phase 1 tests plus the new notebook tests).
