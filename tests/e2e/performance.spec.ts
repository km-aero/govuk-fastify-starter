import { test, expect } from "@playwright/test";

test.describe("Performance", () => {
  test("main stylesheet should be preloaded", async ({ page }) => {
    await page.goto("/");

    // Check for the preload link
    const preloadLink = page.locator('link[rel="preload"][href="/stylesheets/main.css"]');
    await expect(preloadLink).toHaveCount(1);
    await expect(preloadLink).toHaveAttribute('as', 'style');
  });
});
