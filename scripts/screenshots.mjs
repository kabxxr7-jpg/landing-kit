// Full-page screenshots of the production build, for eyeballing a layout change.
//   npm run build && npm start   (in one terminal)
//   BASE_URL=http://localhost:3000 npm run screenshots
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const base = process.env.BASE_URL ?? "http://localhost:3000";
const out = process.env.OUT_DIR ?? "screenshots";
mkdirSync(out, { recursive: true });

const views = [
  { name: "desktop", viewport: { width: 1280, height: 900 } },
  { name: "mobile", viewport: { width: 375, height: 812 } },
];
const pages = [
  { name: "home", path: "/" },
  { name: "case-study", path: "/case-study" },
];

const browser = await chromium.launch({ channel: "chrome" });
try {
  for (const scheme of ["light", "dark"]) {
    for (const view of views) {
      const context = await browser.newContext({ viewport: view.viewport, colorScheme: scheme, reducedMotion: "reduce" });
      const page = await context.newPage();
      for (const target of pages) {
        await page.goto(base + target.path, { waitUntil: "networkidle" });
        // Lazy images need a scroll to load before a full-page capture.
        await page.evaluate(async () => {
          for (let y = 0; y < document.body.scrollHeight; y += 600) {
            window.scrollTo(0, y);
            await new Promise((r) => setTimeout(r, 60));
          }
          window.scrollTo(0, 0);
        });
        await page.waitForTimeout(300);
        const file = `${out}/${target.name}-${view.name}-${scheme}.png`;
        await page.screenshot({ path: file, fullPage: true });
        console.log(file);
      }
      await context.close();
    }
  }
} finally {
  await browser.close();
}
