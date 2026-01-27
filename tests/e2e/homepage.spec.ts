/**
 * Homepage E2E Tests
 * ===================
 * End-to-end tests for the homepage.
 */

import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("has correct title", async ({ page }) => {
    await page.goto("/");

    // Title should match Fastify app
    await expect(page).toHaveTitle("Home - GOV.UK Fastify Starter - GOV.UK");
  });

  test("displays GOV.UK header with crown logo", async ({ page }) => {
    await page.goto("/");

    // Check header is present
    const header = page.locator(".govuk-header");
    await expect(header).toBeVisible();

    // Check GOV.UK logo is present (SVG with aria-label)
    await expect(page.locator(".govuk-header__logotype")).toHaveAttribute(
      "aria-label",
      "GOV.UK"
    );

    // Check service name is present
    await expect(page.locator(".govuk-header__service-name")).toContainText(
      "GOV.UK Fastify Starter"
    );
  });

  test("displays phase banner", async ({ page }) => {
    await page.goto("/");

    const phaseBanner = page.locator(".govuk-phase-banner");
    await expect(phaseBanner).toBeVisible();
    await expect(phaseBanner.locator(".govuk-tag")).toContainText("Beta");
  });

  test("displays main heading", async ({ page }) => {
    await page.goto("/");

    const heading = page.locator("h1");
    await expect(heading).toContainText("GOV.UK Fastify Starter");
  });

  test("has skip link for accessibility", async ({ page }) => {
    await page.goto("/");

    const skipLink = page.locator(".govuk-skip-link");
    await expect(skipLink).toHaveAttribute("href", "#main-content");
  });

  test("has working navigation to example form", async ({ page }) => {
    await page.goto("/");

    // Click the start button
    await page.click(".govuk-button--start");

    // Should navigate to example form
    await expect(page).toHaveURL("/example-form");
    await expect(page.locator("h1")).toContainText("Contact us");
  });

  test("displays footer with crown copyright", async ({ page }) => {
    await page.goto("/");

    const footer = page.locator(".govuk-footer");
    await expect(footer).toBeVisible();
    await expect(footer.locator(".govuk-footer__copyright-logo")).toContainText(
      "Crown copyright"
    );
  });
});
