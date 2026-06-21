# poyraz.co Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a deployable Next.js shell for poyraz.co with the sidebar layout, light/dark theming, fonts, and a placeholder home page.

**Architecture:** Next.js 15 App Router, fully static. A fixed left sidebar plus a right content area form the root layout. Theming uses Tailwind CSS v4 design tokens with a class-based dark variant driven by next-themes. This phase ships no real content; it establishes the visual shell and the test harness that later phases build on.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS v4, next-themes, next/font, Playwright (e2e/smoke tests).

## Global Constraints

- Node 18.18+ (Next.js 15 requirement). Prefer Node 20+.
- TypeScript strict mode on.
- Tailwind CSS v4 (the version create-next-app installs). Theme tokens via `@theme inline`, dark mode via `@custom-variant dark`.
- All routes statically generated. No server runtime in this phase.
- Package manager: npm.
- Import alias: `@/*` resolves to `src/*`.
- Site copy is English.
- The repo already exists at `~/Documents/repos/poyraz-co` with `.git/` and `docs/`. Do not destroy either when scaffolding.
- Brand tokens (use exactly):
  - Light: background `#ffffff`, foreground `#0a0a0a`, muted `#6b7280`, border `#ececec`, card `#ffffff`, accent `#2563eb`.
  - Dark: background `#0a0a0a`, foreground `#ededed`, muted `#9ca3af`, border `#262626`, card `#111111`, accent `#3b82f6`.
- Fonts: Inter (body), Inter Tight (headings, stands in for the site's Inter Display).

---

## File Structure

| File                                | Responsibility                                                                    |
| ----------------------------------- | --------------------------------------------------------------------------------- |
| `src/app/layout.tsx`                | Root layout: html shell, fonts, ThemeProvider, Sidebar, main content slot, Footer |
| `src/app/page.tsx`                  | Home page with placeholder sections                                               |
| `src/app/globals.css`               | Tailwind import, design tokens, dark variant, base styles                         |
| `src/components/theme-provider.tsx` | Client wrapper around next-themes ThemeProvider                                   |
| `src/components/theme-toggle.tsx`   | Light/dark toggle button                                                          |
| `src/components/sidebar.tsx`        | Fixed sidebar nav with grouped links, mobile drawer                               |
| `src/components/footer.tsx`         | Bottom footer with grouped links                                                  |
| `src/lib/nav.ts`                    | Single source of truth for nav link data                                          |
| `tests/smoke.spec.ts`               | Playwright smoke tests for shell, nav, theme                                      |
| `playwright.config.ts`              | Playwright config (dev server, baseURL)                                           |

---

## Task 1: Scaffold Next.js into the existing repo + Playwright harness

**Files:**

- Create: entire Next.js scaffold under `~/Documents/repos/poyraz-co`
- Create: `playwright.config.ts`
- Create: `tests/smoke.spec.ts`

**Interfaces:**

- Produces: a running dev server on `http://localhost:3000`, `npm run dev`/`npm run build` scripts, and `npx playwright test` wired to start the dev server.

- [ ] **Step 1: Scaffold into a temp dir, then merge to preserve `.git/` and `docs/`**

```bash
cd ~/Documents/repos
npx create-next-app@latest poyraz-co-tmp \
  --ts --tailwind --eslint --app --src-dir \
  --import-alias "@/*" --use-npm --no-git --yes
# merge generated files into the existing repo, keep our .git/ and docs/
rsync -a --exclude='.git' poyraz-co-tmp/ poyraz-co/
rm -rf poyraz-co-tmp
```

- [ ] **Step 2: Verify the app boots and builds**

```bash
cd ~/Documents/repos/poyraz-co
npm run build
```

Expected: build completes with a route list including `/`. If it fails, stop and fix before continuing.

- [ ] **Step 3: Install Playwright**

```bash
cd ~/Documents/repos/poyraz-co
npm install -D @playwright/test
npx playwright install chromium
```

- [ ] **Step 4: Write `playwright.config.ts`**

```typescript
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  use: { baseURL: "http://localhost:3000" },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
```

- [ ] **Step 5: Write the failing smoke test `tests/smoke.spec.ts`**

```typescript
import { test, expect } from "@playwright/test";

test("home page loads and shows the name", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Eyüp Poyraz")).toBeVisible();
});
```

- [ ] **Step 6: Run it to verify it fails**

Run: `npx playwright test tests/smoke.spec.ts`
Expected: FAIL. The default create-next-app page does not contain "Eyüp Poyraz".

- [ ] **Step 7: Replace `src/app/page.tsx` with a minimal placeholder that satisfies the test**

```tsx
export default function Home() {
  return (
    <div>
      <h1>Hi, This is Eyüp Poyraz.</h1>
      <p>
        Explore my work as a marketer with a track record of scaling tech
        products to maximize user value.
      </p>
    </div>
  );
}
```

- [ ] **Step 8: Run the smoke test to verify it passes**

Run: `npx playwright test tests/smoke.spec.ts`
Expected: PASS.

- [ ] **Step 9: Add `.gitignore` entries for test artifacts**

Append to `.gitignore`:

```
/test-results/
/playwright-report/
/playwright/.cache/
```

- [ ] **Step 10: Commit**

```bash
cd ~/Documents/repos/poyraz-co
git add -A
git commit -m "feat: scaffold Next.js app with Playwright smoke test"
```

---

## Task 2: Design tokens and Tailwind v4 theme

**Files:**

- Modify: `src/app/globals.css` (replace contents)

**Interfaces:**

- Produces: CSS utility classes `bg-background`, `text-foreground`, `text-muted`, `border-border`, `bg-card`, `text-accent` and a `.dark` class that flips all tokens.

- [ ] **Step 1: Write the failing test (append to `tests/smoke.spec.ts`)**

```typescript
test("html background reflects light theme by default", async ({ page }) => {
  await page.goto("/");
  const bg = await page.evaluate(
    () => getComputedStyle(document.body).backgroundColor,
  );
  // #ffffff
  expect(bg).toBe("rgb(255, 255, 255)");
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx playwright test tests/smoke.spec.ts -g "light theme"`
Expected: FAIL (body has no explicit background yet).

- [ ] **Step 3: Replace `src/app/globals.css`**

```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

:root {
  --background: #ffffff;
  --foreground: #0a0a0a;
  --muted: #6b7280;
  --border: #ececec;
  --card: #ffffff;
  --accent: #2563eb;
}

.dark {
  --background: #0a0a0a;
  --foreground: #ededed;
  --muted: #9ca3af;
  --border: #262626;
  --card: #111111;
  --accent: #3b82f6;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-muted: var(--muted);
  --color-border: var(--border);
  --color-card: var(--card);
  --color-accent: var(--accent);
  --font-sans: var(--font-inter);
  --font-display: var(--font-inter-tight);
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: var(--font-sans), sans-serif;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx playwright test tests/smoke.spec.ts -g "light theme"`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/globals.css tests/smoke.spec.ts
git commit -m "feat: add light/dark design tokens with Tailwind v4"
```

---

## Task 3: Fonts (Inter + Inter Tight)

**Files:**

- Modify: `src/app/layout.tsx`

**Interfaces:**

- Consumes: `--font-sans` and `--font-display` token names from Task 2.
- Produces: CSS variables `--font-inter` and `--font-inter-tight` set on `<html>` so the tokens resolve.

- [ ] **Step 1: Replace `src/app/layout.tsx` font wiring**

```tsx
import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
});

export const metadata: Metadata = {
  title: "Eyüp Can Poyraz",
  description: "Marketer scaling tech products to maximize user value.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${interTight.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 2: Write the failing test (append to `tests/smoke.spec.ts`)**

```typescript
test("body uses the Inter font family", async ({ page }) => {
  await page.goto("/");
  const family = await page.evaluate(
    () => getComputedStyle(document.body).fontFamily,
  );
  expect(family.toLowerCase()).toContain("inter");
});
```

- [ ] **Step 3: Run it to verify it passes**

Run: `npx playwright test tests/smoke.spec.ts -g "Inter font"`
Expected: PASS (font variable now resolves on body).

- [ ] **Step 4: Commit**

```bash
git add src/app/layout.tsx tests/smoke.spec.ts
git commit -m "feat: load Inter and Inter Tight fonts"
```

---

## Task 4: Theme provider and toggle

**Files:**

- Create: `src/components/theme-provider.tsx`
- Create: `src/components/theme-toggle.tsx`
- Modify: `src/app/layout.tsx`

**Interfaces:**

- Consumes: next-themes.
- Produces: `<ThemeProvider>` (default export-friendly named export `ThemeProvider`) wrapping the app, and `<ThemeToggle />` that toggles the `.dark` class on `<html>`.

- [ ] **Step 1: Install next-themes**

```bash
npm install next-themes
```

- [ ] **Step 2: Create `src/components/theme-provider.tsx`**

```tsx
"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

export function ThemeProvider(
  props: ComponentProps<typeof NextThemesProvider>,
) {
  return <NextThemesProvider {...props} />;
}
```

- [ ] **Step 3: Create `src/components/theme-toggle.tsx`**

```tsx
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <button aria-label="Toggle theme" className="h-8 w-8" />;
  const next = resolvedTheme === "dark" ? "light" : "dark";
  return (
    <button
      aria-label="Toggle theme"
      onClick={() => setTheme(next)}
      className="h-8 w-8 rounded-md border border-border text-foreground"
    >
      {resolvedTheme === "dark" ? "☀" : "☾"}
    </button>
  );
}
```

- [ ] **Step 4: Wire ThemeProvider into `src/app/layout.tsx`**

Add `import { ThemeProvider } from '@/components/theme-provider'`, set `suppressHydrationWarning` on `<html>`, and wrap children:

```tsx
return (
  <html
    lang="en"
    suppressHydrationWarning
    className={`${inter.variable} ${interTight.variable}`}
  >
    <body>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        {children}
      </ThemeProvider>
    </body>
  </html>
);
```

- [ ] **Step 5: Temporarily render the toggle on the home page**

Add `import { ThemeToggle } from '@/components/theme-toggle'` to `src/app/page.tsx` and render `<ThemeToggle />` inside the returned markup.

- [ ] **Step 6: Write the failing test (append to `tests/smoke.spec.ts`)**

```typescript
test("theme toggle switches html to dark", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).not.toHaveClass(/dark/);
  await page.getByLabel("Toggle theme").click();
  await expect(page.locator("html")).toHaveClass(/dark/);
});
```

- [ ] **Step 7: Run it to verify it passes**

Run: `npx playwright test tests/smoke.spec.ts -g "theme toggle"`
Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: add next-themes provider and theme toggle"
```

---

## Task 5: Sidebar navigation

**Files:**

- Create: `src/lib/nav.ts`
- Create: `src/components/sidebar.tsx`

**Interfaces:**

- Consumes: design tokens, ThemeToggle.
- Produces: `NAV_GROUPS` data export, `<Sidebar />` rendering grouped nav links with `href`s matching the spec routes.

- [ ] **Step 1: Create `src/lib/nav.ts`**

```typescript
export type NavLink = { label: string; href: string; external?: boolean };
export type NavGroup = { title?: string; links: NavLink[] };

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
```

- [ ] **Step 2: Create `src/components/sidebar.tsx`**

```tsx
import Link from "next/link";
import { NAV_GROUPS } from "@/lib/nav";
import { ThemeToggle } from "@/components/theme-toggle";

export function Sidebar() {
  return (
    <aside className="flex h-full w-full flex-col gap-6 p-6 text-sm">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="font-display text-base font-semibold text-foreground"
        >
          Eyüp Poyraz
        </Link>
        <ThemeToggle />
      </div>
      <nav className="flex flex-col gap-5">
        {NAV_GROUPS.map((group, i) => (
          <div key={i} className="flex flex-col gap-1">
            {group.title && (
              <span className="mb-1 text-xs uppercase tracking-wide text-muted">
                {group.title}
              </span>
            )}
            {group.links.map((link) =>
              link.external ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted hover:text-foreground"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-muted hover:text-foreground"
                >
                  {link.label}
                </Link>
              ),
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}
```

- [ ] **Step 3: Render Sidebar on the home page temporarily and write the failing test**

Add `import { Sidebar } from '@/components/sidebar'` to `src/app/page.tsx`, render `<Sidebar />`. Append test:

```typescript
test("sidebar shows grouped nav links", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: "Projects" })).toHaveAttribute(
    "href",
    "/projects",
  );
  await expect(page.getByRole("link", { name: "Notebook" })).toHaveAttribute(
    "href",
    "/notebook",
  );
  await expect(page.getByText("Resources")).toBeVisible();
});
```

- [ ] **Step 4: Run it to verify it passes**

Run: `npx playwright test tests/smoke.spec.ts -g "grouped nav"`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add sidebar navigation with grouped links"
```

---

## Task 6: Root layout shell with mobile drawer

**Files:**

- Create: `src/components/footer.tsx`
- Create: `src/components/mobile-nav.tsx`
- Modify: `src/app/layout.tsx`
- Modify: `src/app/page.tsx` (remove the temporary Sidebar/ThemeToggle renders)

**Interfaces:**

- Consumes: `<Sidebar />`, `<Footer />`, `NAV_GROUPS`.
- Produces: a two-column shell. On `md+` the sidebar is fixed at the left; below `md` a top bar with a drawer toggles the same nav.

- [ ] **Step 1: Create `src/components/footer.tsx`**

```tsx
import Link from "next/link";
import { NAV_GROUPS } from "@/lib/nav";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border pt-8 text-sm text-muted">
      <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
        {NAV_GROUPS.map((group, i) => (
          <div key={i} className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-wide text-muted">
              {group.title ?? "Index"}
            </span>
            {group.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>
        ))}
      </div>
      <p className="mt-8">poyraz.co</p>
    </footer>
  );
}
```

- [ ] **Step 2: Create `src/components/mobile-nav.tsx`**

```tsx
"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  return (
    <div className="md:hidden">
      <button
        aria-label="Open menu"
        onClick={() => setOpen(true)}
        className="p-4 text-foreground"
      >
        Menu
      </button>
      {open && (
        <div className="fixed inset-0 z-50 bg-background">
          <button
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 text-foreground"
          >
            Close
          </button>
          <Sidebar />
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Rewrite `src/app/layout.tsx` to compose the shell**

```tsx
import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Sidebar } from "@/components/sidebar";
import { Footer } from "@/components/footer";
import { MobileNav } from "@/components/mobile-nav";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
});

export const metadata: Metadata = {
  title: "Eyüp Can Poyraz",
  description: "Marketer scaling tech products to maximize user value.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${interTight.variable}`}
    >
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <div className="mx-auto flex min-h-screen max-w-6xl flex-col md:flex-row">
            <div className="hidden md:block md:w-64 md:shrink-0 md:border-r md:border-border">
              <div className="sticky top-0">
                <Sidebar />
              </div>
            </div>
            <MobileNav />
            <main className="flex-1 px-6 py-10 md:px-12">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Clean up `src/app/page.tsx` to just content**

```tsx
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="flex flex-col gap-16">
      <section>
        <h1 className="font-display text-4xl font-semibold tracking-tight">
          Hi, This is Eyüp Poyraz.
        </h1>
        <p className="mt-4 max-w-xl text-muted">
          Explore my work as a marketer with a track record of scaling tech
          products to maximize user value.
        </p>
      </section>
      <section>
        <h2 className="font-display text-2xl font-semibold">Projects</h2>
      </section>
      <section>
        <h2 className="font-display text-2xl font-semibold">Notebook</h2>
      </section>
      <section>
        <h2 className="font-display text-2xl font-semibold">Bookmarks</h2>
      </section>
      <section>
        <h2 className="font-display text-2xl font-semibold">Tech Stack</h2>
      </section>
      <Footer />
    </div>
  );
}
```

- [ ] **Step 5: Update the theme-toggle test (the toggle now lives in the sidebar)**

The existing "theme toggle" test still finds the toggle by label inside the sidebar on desktop viewport. Confirm Playwright default viewport (1280x720) shows the desktop sidebar. No change needed; just re-run.

- [ ] **Step 6: Run the full suite**

Run: `npx playwright test`
Expected: all tests PASS.

- [ ] **Step 7: Verify production build**

```bash
npm run build
```

Expected: PASS, `/` listed as static.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: compose root layout shell with sidebar, footer, mobile drawer"
```

---

## Task 7: Placeholder routes for all nav targets

**Files:**

- Create: `src/app/projects/page.tsx`, `src/app/services/page.tsx`, `src/app/about/page.tsx`, `src/app/bookmarks/page.tsx`, `src/app/notebook/page.tsx`, `src/app/stack/page.tsx`, `src/app/contact/page.tsx`

**Interfaces:**

- Produces: a static page at every internal nav route so no link 404s. Each renders an `<h1>` with the page name.

- [ ] **Step 1: Write the failing test (append to `tests/smoke.spec.ts`)**

```typescript
const ROUTES = [
  "/projects",
  "/services",
  "/about",
  "/bookmarks",
  "/notebook",
  "/stack",
  "/contact",
];
for (const route of ROUTES) {
  test(`route ${route} renders without 404`, async ({ page }) => {
    const res = await page.goto(route);
    expect(res?.status()).toBeLessThan(400);
    await expect(page.locator("h1")).toBeVisible();
  });
}
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx playwright test tests/smoke.spec.ts -g "renders without 404"`
Expected: FAIL (routes return 404).

- [ ] **Step 3: Create each placeholder page**

For each route create `src/app/<route>/page.tsx`. Example for projects (`src/app/projects/page.tsx`), repeat with the matching title for each:

```tsx
export default function Page() {
  return (
    <h1 className="font-display text-3xl font-semibold tracking-tight">
      Projects
    </h1>
  );
}
```

Titles per route: Projects, Services, About, Bookmarks, Notebook, Stack, Contact.

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx playwright test tests/smoke.spec.ts -g "renders without 404"`
Expected: PASS.

- [ ] **Step 5: Verify the full build and suite**

```bash
npm run build && npx playwright test
```

Expected: all routes static, all tests PASS.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add placeholder pages for all nav routes"
```

---

## Self-Review Notes

- Spec coverage: this plan delivers spec sections 4 (stack), 5 (folder structure foundations), 6 (all routes exist as static pages), 7 (sidebar layout, light/dark, Inter fonts, refined surfaces). Content collections (spec 8/9), migration (spec 10), and deployment (spec 11) are intentionally deferred to later phases.
- The temporary renders of Sidebar/ThemeToggle on the home page in Tasks 4 and 5 are removed in Task 6 Step 4; later tests locate the toggle inside the layout sidebar.
- Type names are consistent: `NavLink`, `NavGroup`, `NAV_GROUPS`, `Sidebar`, `Footer`, `MobileNav`, `ThemeProvider`, `ThemeToggle` are defined once and reused.
- No placeholders or TBDs in steps; every code step shows complete code.

## Done When

- `npm run build` produces a fully static route list for `/` and all seven nav routes.
- `npx playwright test` passes: shell loads, fonts apply, theme toggles, nav is grouped, no route 404s.
- Light and dark themes both render with the brand tokens.
- Ready to connect to Vercel (deployment performed in the final phase).
