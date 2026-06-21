import { test, expect } from "@playwright/test";

test("home page loads and shows the name", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Eyüp Poyraz")).toBeVisible();
});
