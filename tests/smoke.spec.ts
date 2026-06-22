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
