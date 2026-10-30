// Renders the HTML sources in design-src/ to the PNGs in public/images/.
// Next's image optimizer then serves those PNGs as AVIF or WebP.
//
//   npm run images
//
// Uses the Chrome already installed on the machine (Playwright's "chrome" channel), so no browser download.
import { chromium } from "@playwright/test";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

const jobs = [
  { src: "design-src/hero-app.html", out: "public/images/hero-app.png", width: 1600, height: 1200 },
  { src: "design-src/case-study-chart.html", out: "public/images/case-study-chart.png", width: 1600, height: 960 },
];

const browser = await chromium.launch({ channel: "chrome" });
try {
  for (const job of jobs) {
    const page = await browser.newPage({ viewport: { width: job.width, height: job.height }, deviceScaleFactor: 1 });
    await page.goto(pathToFileURL(path.join(root, job.src)).href);
    await page.screenshot({ path: path.join(root, job.out), type: "png" });
    await page.close();
    console.log(`rendered ${job.out}`);
  }
} finally {
  await browser.close();
}
