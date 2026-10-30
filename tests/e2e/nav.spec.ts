import { expect, test } from "@playwright/test";

test.describe("desktop navigation", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("shows the links inline and no menu button", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Main" });
    for (const name of ["Features", "Pricing", "FAQ", "Case study"]) {
      await expect(nav.getByRole("link", { name })).toBeVisible();
    }
    await expect(nav.getByRole("button")).toBeHidden();
  });

  test("a section link scrolls the section into view, clear of the sticky header", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Pricing" }).click();
    await expect(page).toHaveURL(/#pricing$/);
    await expect(page.getByRole("heading", { name: "Simple plans that grow with the team" })).toBeInViewport();
    // Smooth scrolling finishes asynchronously: wait until the section has stopped moving.
    const top = () => page.evaluate(() => Math.round(document.getElementById("pricing")!.getBoundingClientRect().top));
    await expect.poll(async () => { const a = await top(); await page.waitForTimeout(120); return a === (await top()); }, { timeout: 8000 }).toBe(true);
    const headerBottom = await page.getByRole("banner").evaluate((el) => el.getBoundingClientRect().bottom);
    const sectionTop = await top();
    // scroll-margin-top leaves the section's top edge just below the sticky header, never under it.
    expect(sectionTop).toBeGreaterThanOrEqual(headerBottom - 1);
    expect(sectionTop).toBeLessThanOrEqual(headerBottom + 40);
  });

  test("the Case study link opens the case study page", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Case study" }).click();
    await expect(page).toHaveURL(/\/case-study$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Fjordline Studio");
  });

  test("the header stays pinned while scrolling", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => window.scrollTo(0, 2000));
    await expect(page.getByRole("banner")).toBeInViewport({ ratio: 1 });
  });
});

test.describe("mobile navigation", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("hides the links behind a menu button that reports its state", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Main" });
    const button = nav.getByRole("button", { name: "Open menu" });
    await expect(button).toBeVisible();
    await expect(button).toHaveAttribute("aria-expanded", "false");
    await expect(nav.getByRole("link", { name: "Pricing" })).toBeHidden();

    await button.click();
    await expect(nav.getByRole("button", { name: "Close menu" })).toHaveAttribute("aria-expanded", "true");
    await expect(nav.getByRole("link", { name: "Pricing" })).toBeVisible();
  });

  test("Escape closes the menu and puts focus back on the button", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Main" });
    await nav.getByRole("button", { name: "Open menu" }).click();
    await page.keyboard.press("Tab");
    await expect(nav.getByRole("link", { name: "Features" })).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(nav.getByRole("link", { name: "Features" })).toBeHidden();
    await expect(nav.getByRole("button", { name: "Open menu" })).toBeFocused();
  });

  test("choosing a link closes the menu and goes there", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Main" });
    await nav.getByRole("button", { name: "Open menu" }).click();
    await nav.getByRole("link", { name: "FAQ" }).click();
    await expect(page).toHaveURL(/#faq$/);
    await expect(nav.getByRole("link", { name: "FAQ" })).toBeHidden();
    await expect(page.getByRole("heading", { name: "Questions, answered" })).toBeInViewport();
  });

  test("growing the window past the breakpoint closes the open menu and shows the inline links", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Main" });
    await nav.getByRole("button", { name: "Open menu" }).click();
    await page.setViewportSize({ width: 1100, height: 800 });
    await expect(nav.getByRole("button")).toBeHidden();
    await expect(nav.getByRole("link", { name: "Pricing" })).toBeVisible();
    await page.setViewportSize({ width: 375, height: 812 });
    await expect(nav.getByRole("button", { name: "Open menu" })).toHaveAttribute("aria-expanded", "false");
  });
});

test.describe("skip link", () => {
  test("is the first tab stop, appears on focus, and moves focus to the main content", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to main content" });
    await expect(skip).toBeFocused();
    await expect(skip).toBeInViewport();
    await page.keyboard.press("Enter");
    await expect(page.locator("main")).toBeFocused();
  });
});
