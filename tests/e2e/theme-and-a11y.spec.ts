import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const PAGES = ["/", "/case-study"];

test.describe("colour scheme", () => {
  const read = (page: import("@playwright/test").Page) =>
    page.evaluate(() => ({
      bg: getComputedStyle(document.body).backgroundColor,
      color: getComputedStyle(document.body).color,
      scheme: getComputedStyle(document.documentElement).colorScheme,
    }));

  test.describe("light", () => {
    test.use({ colorScheme: "light" });
    test("uses the light tokens", async ({ page }) => {
      await page.goto("/");
      expect(await read(page)).toMatchObject({ bg: "rgb(246, 250, 249)", color: "rgb(10, 31, 36)" });
    });
  });

  test.describe("dark", () => {
    test.use({ colorScheme: "dark" });
    test("uses the dark tokens", async ({ page }) => {
      await page.goto("/");
      expect(await read(page)).toMatchObject({ bg: "rgb(6, 22, 26)", color: "rgb(233, 244, 245)" });
    });
  });
});

for (const scheme of ["light", "dark"] as const) {
  for (const path of PAGES) {
    test(`axe finds no violations on ${path} (${scheme})`, async ({ browser }) => {
      // Reduced motion so every scroll-revealed section is fully painted when axe measures contrast.
      const context = await browser.newContext({ colorScheme: scheme, reducedMotion: "reduce" });
      const page = await context.newPage();
      await page.goto(path, { waitUntil: "networkidle" });
      const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"]).analyze();
      const summary = results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(" | ")}`);
      expect(summary).toEqual([]);
      await context.close();
    });
  }
}

test.describe("case study page", () => {
  test("has a table of contents whose links all land on a heading", async ({ page }) => {
    await page.goto("/case-study");
    const toc = page.getByRole("navigation", { name: "On this page" });
    const hrefs = await toc.getByRole("link").evaluateAll((links) => links.map((a) => a.getAttribute("href")!));
    expect(hrefs.length).toBeGreaterThanOrEqual(6);
    for (const href of hrefs) {
      const id = href.slice(1);
      const tag = await page.evaluate((target) => document.getElementById(target)?.tagName, id);
      expect(tag, href).toMatch(/^H[1-6]$/);
    }
  });

  test("labels the example as fictional and marks the current breadcrumb", async ({ page }) => {
    await page.goto("/case-study");
    await expect(page.getByRole("note")).toContainText("Fictional example");
    await expect(page.getByRole("navigation", { name: "Breadcrumb" }).locator('[aria-current="page"]')).toHaveText("Case study");
  });

  test("the results table has column and row headers and a caption", async ({ page }) => {
    await page.goto("/case-study");
    const table = page.getByRole("table");
    await expect(table.getByRole("columnheader")).toHaveText(["Measure", "Before", "After", "Change"]);
    expect(await table.getByRole("rowheader").count()).toBe(4);
    expect(await table.locator("caption").count()).toBe(1);
  });

  test("the sticky table of contents stays in view on a wide screen", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/case-study#results");
    await expect(page.getByRole("navigation", { name: "On this page" })).toBeInViewport();
  });
});
