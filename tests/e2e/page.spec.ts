import { expect, test } from "@playwright/test";

const PAGES = ["/", "/case-study"];

for (const path of PAGES) {
  test.describe(`structure of ${path}`, () => {
    test("has the landmarks, one h1, and a heading outline with no skipped levels", async ({ page }) => {
      await page.goto(path);
      // A <header> inside an <article> is not the page banner, so count the landmark roles, not the tags.
      await expect(page.getByRole("banner")).toHaveCount(1);
      await expect(page.getByRole("main")).toHaveCount(1);
      await expect(page.getByRole("contentinfo")).toHaveCount(1);
      await expect(page.getByRole("navigation", { name: "Main" })).toHaveCount(1);
      await expect(page.locator("h1")).toHaveCount(1);

      const levels = await page.$$eval("h1, h2, h3, h4", (els) => els.map((el) => Number(el.tagName[1])));
      for (let i = 1; i < levels.length; i++) {
        expect(levels[i]! - levels[i - 1]!, `heading ${i} follows level ${levels[i - 1]} with level ${levels[i]}`).toBeLessThanOrEqual(1);
      }
    });

    test("has a title, description, canonical, Open Graph and Twitter tags", async ({ page }) => {
      await page.goto(path);
      await expect(page).toHaveTitle(/Tidepool|Fjordline/);
      const meta = (selector: string) => page.locator(selector).first().getAttribute("content");
      expect((await meta('meta[name="description"]'))?.length).toBeGreaterThan(50);
      expect(await page.locator('link[rel="canonical"]').getAttribute("href")).toMatch(/^https:\/\/tidepool\.example/);
      expect(await meta('meta[property="og:title"]')).toBeTruthy();
      expect(await meta('meta[property="og:image"]')).toMatch(/opengraph-image/);
      expect(await meta('meta[name="twitter:card"]')).toBe("summary_large_image");
      expect(await page.locator("html").getAttribute("lang")).toBe("en");
    });

    test("every image has alt text and explicit dimensions", async ({ page }) => {
      await page.goto(path);
      const images = await page.$$eval("img", (els) =>
        els.map((el) => ({ src: el.currentSrc || el.src, alt: el.getAttribute("alt"), w: el.getAttribute("width"), h: el.getAttribute("height") })),
      );
      expect(images.length).toBeGreaterThan(0);
      for (const image of images) {
        expect(image.alt, image.src).toBeTruthy();
        expect(image.w, image.src).toBeTruthy();
        expect(image.h, image.src).toBeTruthy();
      }
    });

    test("loads without console errors, page errors or failed requests", async ({ page }) => {
      const problems: string[] = [];
      page.on("console", (msg) => msg.type() === "error" && problems.push(`console: ${msg.text()}`));
      page.on("pageerror", (err) => problems.push(`pageerror: ${err.message}`));
      page.on("requestfailed", (req) => problems.push(`failed: ${req.url()}`));
      page.on("response", (res) => res.status() >= 400 && problems.push(`${res.status()}: ${res.url()}`));
      await page.goto(path, { waitUntil: "networkidle" });
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 500) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 40));
        }
      });
      expect(problems).toEqual([]);
    });

    for (const width of [320, 375, 768, 1280]) {
      test(`does not scroll sideways at ${width}px wide`, async ({ page }) => {
        await page.setViewportSize({ width, height: 800 });
        await page.goto(path);
        const { scrollWidth, clientWidth } = await page.evaluate(() => ({
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
        }));
        expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
      });
    }
  });
}

test("serves robots.txt and a sitemap that lists both pages", async ({ request }) => {
  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  expect(await robots.text()).toContain("Sitemap: https://tidepool.example/sitemap.xml");

  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  const xml = await sitemap.text();
  expect(xml).toContain("<loc>https://tidepool.example</loc>");
  expect(xml).toContain("<loc>https://tidepool.example/case-study</loc>");
});

test("serves a generated Open Graph image and an icon", async ({ request }) => {
  for (const url of ["/opengraph-image", "/case-study/opengraph-image"]) {
    const res = await request.get(url);
    expect(res.status(), url).toBe(200);
    expect(res.headers()["content-type"]).toBe("image/png");
  }
  expect((await request.get("/icon.svg")).status()).toBe(200);
});

test("unknown URLs get a real 404 page that links back", async ({ page }) => {
  const response = await page.goto("/nothing-lives-here");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("moved, or never existed");
  await expect(page.getByRole("link", { name: "Back to the home page" })).toBeVisible();
});

test("sends the security headers", async ({ request }) => {
  const headers = (await request.get("/")).headers();
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["x-frame-options"]).toBe("DENY");
  expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(headers["x-powered-by"]).toBeUndefined();
});

test("the hero image is served as AVIF or WebP, not the original PNG", async ({ page }) => {
  const responses: { url: string; type: string }[] = [];
  page.on("response", (res) => {
    if (res.url().includes("/_next/image")) responses.push({ url: res.url(), type: res.headers()["content-type"] ?? "" });
  });
  await page.goto("/", { waitUntil: "networkidle" });
  expect(responses.length).toBeGreaterThan(0);
  for (const item of responses) expect(item.type, item.url).toMatch(/image\/(avif|webp)/);
});
