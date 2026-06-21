import { test, expect } from "@playwright/test";

test("home page loads and shows the name", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Eyüp Poyraz")).toBeVisible();
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
