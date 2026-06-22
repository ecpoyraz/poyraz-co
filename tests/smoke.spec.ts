import { test, expect } from "@playwright/test";

test("home page loads and shows the name", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /Eyüp Poyraz/ }),
  ).toBeVisible();
});

test("html background reflects light theme by default", async ({ page }) => {
  await page.goto("/");
  const bg = await page.evaluate(
    () => getComputedStyle(document.body).backgroundColor,
  );
  // #ffffff
  expect(bg).toBe("rgb(255, 255, 255)");
});

test("body uses the Inter font family", async ({ page }) => {
  await page.goto("/");
  const family = await page.evaluate(
    () => getComputedStyle(document.body).fontFamily,
  );
  expect(family.toLowerCase()).toContain("inter");
});

test("theme toggle switches html to dark", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).not.toHaveClass(/dark/);
  await page.getByLabel("Toggle theme").click();
  await expect(page.locator("html")).toHaveClass(/dark/);
});

test("sidebar shows grouped nav links", async ({ page }) => {
  await page.goto("/");
  const sidebar = page.locator("aside");
  await expect(sidebar.getByRole("link", { name: "Projects" })).toHaveAttribute(
    "href",
    "/projects",
  );
  await expect(sidebar.getByRole("link", { name: "Notebook" })).toHaveAttribute(
    "href",
    "/notebook",
  );
  await expect(sidebar.getByText("Resources")).toBeVisible();
});

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

test("notebook list shows post titles", async ({ page }) => {
  await page.goto("/notebook");
  await expect(
    page.getByRole("link", { name: /How To Use ChatGPT As A Marketer/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Launching New Product/ }),
  ).toBeVisible();
});

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

test("home notebook preview shows a recent post", async ({ page }) => {
  await page.goto("/");
  const main = page.locator("main");
  await expect(
    main.getByRole("link", { name: /Launching New Product/ }),
  ).toBeVisible();
});

test("newsletter signup shows thank-you after submit", async ({ page }) => {
  await page.goto("/notebook");
  await page.getByLabel("Email address").fill("test@example.com");
  await page.getByRole("button", { name: "Submit" }).click();
  await expect(page.getByText("Thanks for subscribing.")).toBeVisible();
});

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
    page.getByRole("heading", { level: 2, name: "Param Overview" }),
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

test("bookmarks page renders grid", async ({ page }) => {
  await page.goto("/bookmarks");
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.locator("main a").first()).toBeVisible();
});

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
