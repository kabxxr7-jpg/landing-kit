import { expect, test } from "@playwright/test";

const ALLOWED = new Set(["opacity", "transform", "offset", "computedOffset", "easing", "composite"]);

async function animationReport(page: import("@playwright/test").Page) {
  return page.evaluate(() => {
    const animations = document.getAnimations().filter((a) => a.effect instanceof KeyframeEffect);
    const properties = new Set<string>();
    for (const animation of animations) {
      for (const frame of (animation.effect as KeyframeEffect).getKeyframes()) {
        for (const key of Object.keys(frame)) properties.add(key);
      }
    }
    return {
      count: animations.length,
      properties: [...properties],
      names: animations.map((a) => (a as CSSAnimation).animationName).filter(Boolean),
    };
  });
}

test.describe("with no motion preference", () => {
  test.use({ reducedMotion: "no-preference" });

  test("the hero art and the section reveals animate", async ({ page }) => {
    await page.goto("/");
    const heroAnimation = await page.locator(".hero-art").evaluate((el) => getComputedStyle(el).animationName);
    expect(heroAnimation).toBe("drift-in");
    const revealAnimation = await page.locator(".reveal").first().evaluate((el) => getComputedStyle(el).animationName);
    expect(revealAnimation).toBe("reveal");
  });

  test("every running animation changes only opacity and transform", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => window.scrollTo(0, 1200));
    const report = await animationReport(page);
    expect(report.count).toBeGreaterThan(0);
    const extra = report.properties.filter((p) => !ALLOWED.has(p));
    expect(extra, `unexpected animated properties: ${extra.join(", ")}`).toEqual([]);
  });

  test("the hero text is never animated, so the first paint is not delayed", async ({ page }) => {
    await page.goto("/");
    for (const selector of ["h1", ".eyebrow", "h1 + p"]) {
      const name = await page.locator(selector).first().evaluate((el) => getComputedStyle(el).animationName);
      expect(name, selector).toBe("none");
    }
    const opacity = await page.locator("h1").evaluate((el) => getComputedStyle(el).opacity);
    expect(opacity).toBe("1");
  });

  test("a section that scrolls into view ends fully opaque", async ({ page }) => {
    await page.goto("/");
    await page.locator("#pricing").scrollIntoViewIfNeeded();
    await page.evaluate(() => document.getElementById("pricing")!.scrollIntoView({ behavior: "instant", block: "start" }));
    await expect
      .poll(() => page.locator("#pricing .reveal").first().evaluate((el) => getComputedStyle(el).opacity), { timeout: 5000 })
      .toBe("1");
  });

  test("page layout does not shift while animating", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const cls = await page.evaluate(
      () =>
        new Promise<number>((resolve) => {
          let total = 0;
          new PerformanceObserver((list) => {
            for (const entry of list.getEntries() as unknown as { value: number; hadRecentInput: boolean }[]) {
              if (!entry.hadRecentInput) total += entry.value;
            }
          }).observe({ type: "layout-shift", buffered: true });
          const step = async () => {
            for (let y = 0; y < document.body.scrollHeight; y += 400) {
              window.scrollTo(0, y);
              await new Promise((r) => setTimeout(r, 50));
            }
            setTimeout(() => resolve(total), 300);
          };
          void step();
        }),
    );
    expect(cls).toBeLessThan(0.01);
  });
});

test.describe("with reduced motion requested", () => {
  test.use({ reducedMotion: "reduce" });

  test("no element has an animation", async ({ page }) => {
    await page.goto("/");
    const running = await page.evaluate(() => document.getAnimations().filter((a) => a.playState === "running").length);
    expect(running).toBe(0);
    const names = await page.$$eval(".reveal, .hero-art", (els) => els.map((el) => getComputedStyle(el).animationName));
    expect(names.length).toBeGreaterThan(5);
    expect(new Set(names)).toEqual(new Set(["none"]));
  });

  test("everything is fully visible without scrolling to it", async ({ page }) => {
    await page.goto("/");
    const opacities = await page.$$eval(".reveal", (els) => els.map((el) => getComputedStyle(el).opacity));
    expect(new Set(opacities)).toEqual(new Set(["1"]));
    await expect(page.getByRole("heading", { name: "Questions, answered" })).toBeVisible();
  });

  test("smooth scrolling is off", async ({ page }) => {
    await page.goto("/");
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe("auto");
  });

  test("buttons do not animate their transitions", async ({ page }) => {
    await page.goto("/");
    const duration = await page.locator(".btn").first().evaluate((el) => getComputedStyle(el).transitionDuration);
    for (const part of duration.split(",")) expect(parseFloat(part)).toBeLessThan(0.001);
  });
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false, reducedMotion: "no-preference" });

  test("all the content is in the page and nothing waits on a script to appear", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    // The reveals are CSS-only, so they still resolve with scripting off once scrolled to.
    for (const name of ["Simple plans that grow with the team", "Questions, answered", "Give your team its afternoons back"]) {
      await page.getByRole("heading", { name }).scrollIntoViewIfNeeded();
      await expect(page.getByRole("heading", { name })).toBeVisible();
    }
    const plans = await page.locator("#pricing article").count();
    expect(plans).toBe(3);
  });
});
