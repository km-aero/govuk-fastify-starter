/**
 * Contact Form End-to-End Tests
 * ==============================
 * Tests the complete contact form submission flow including:
 * - Form field display and validation
 * - Error handling for invalid inputs
 * - Successful form submission with database persistence
 * - Confirmation page content and navigation
 *
 * Note: Tests in this file run serially (not in parallel) to prevent
 * database connection pool exhaustion when multiple form submissions
 * occur simultaneously across different browser projects.
 */

import { test, expect } from "@playwright/test";

test.describe("Contact Form", () => {
  // ─────────────────────────────────────────────────────────────────────────
  // Test Configuration
  // ─────────────────────────────────────────────────────────────────────────
  // Run tests serially within each browser project.
  // This prevents 12+ simultaneous database writes (3 submission tests × 4 browsers)
  // which would exhaust the connection pool and cause flaky timeouts.
  test.describe.configure({ mode: "serial" });

  test.beforeEach(async ({ page }) => {
    await page.goto("/example-form");
  });

  test("displays the contact form page", async ({ page }) => {
    await expect(page).toHaveTitle(/Contact us/);
    await expect(page.locator("h1")).toContainText("Contact us");
  });

  test("has back link to homepage", async ({ page }) => {
    const backLink = page.locator(".govuk-back-link");
    await expect(backLink).toHaveAttribute("href", "/");
  });

  test("displays all form fields", async ({ page }) => {
    await expect(page.locator("#fullName")).toBeVisible();
    await expect(page.locator("#email")).toBeVisible();
    await expect(page.locator("#subject")).toBeVisible();
    await expect(page.locator("#message")).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test("shows validation errors for empty form submission", async ({
    page,
  }) => {
    // Click submit without filling the form
    await page.click('button[type="submit"]');

    // Wait for error summary to appear
    const errorSummary = page.locator(".govuk-error-summary");
    await expect(errorSummary).toBeVisible();

    // Check that error messages are displayed
    await expect(errorSummary).toContainText("There is a problem");
  });

  test("shows validation error for invalid email", async ({ page }) => {
    // Fill in the form with invalid email
    await page.fill("#fullName", "Test User");
    await page.fill("#email", "not-an-email");
    await page.selectOption("#subject", "help");
    await page.fill(
      "#message",
      "This is a test message with enough characters.",
    );

    // Submit the form
    await page.click('button[type="submit"]');

    // Check for email error
    await expect(page.locator(".govuk-error-summary")).toContainText("email");
  });

  test("successfully submits form with valid data", async ({ page }) => {
    // Fill in the form with valid data
    await page.fill("#fullName", "Test User");
    await page.fill("#email", "test@example.gov.uk");
    await page.selectOption("#subject", "help");
    await page.fill(
      "#message",
      "This is a test message for the end-to-end test.",
    );

    // Submit the form
    await page.click('button[type="submit"]');

    // Wait for redirect to confirmation page
    await page.waitForURL(/\/example-form\/confirmation/);

    // Check for success panel
    const panel = page.locator(".govuk-panel--confirmation");
    await expect(panel).toBeVisible();
    await expect(panel).toContainText("Form submitted");

    // Check for reference number
    await expect(page.locator(".govuk-panel__body")).toContainText(
      "Your reference number",
    );
  });

  test("confirmation page shows submitted email", async ({ page }) => {
    const testEmail = "e2e-test@example.gov.uk";

    // Fill and submit form
    await page.fill("#fullName", "E2E Test User");
    await page.fill("#email", testEmail);
    await page.selectOption("#subject", "feedback");
    await page.fill("#message", "Testing the confirmation page display.");

    await page.click('button[type="submit"]');
    await page.waitForURL(/\/example-form\/confirmation/);

    // Check email is displayed
    await expect(page.locator("main")).toContainText(testEmail);
  });

  test("confirmation page has links to homepage and new form", async ({
    page,
  }) => {
    // Submit a valid form
    await page.fill("#fullName", "Test User");
    await page.fill("#email", "test@example.gov.uk");
    await page.selectOption("#subject", "help");
    await page.fill("#message", "Testing confirmation page links.");

    await page.click('button[type="submit"]');
    await page.waitForURL(/\/example-form\/confirmation/);

    // Check for links - use specific text to avoid matching multiple elements
    await expect(
      page.getByRole("link", { name: "Return to homepage" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Submit another form" }),
    ).toBeVisible();
  });
});
