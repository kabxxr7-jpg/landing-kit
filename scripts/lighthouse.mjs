// Runs Lighthouse against the production build, on both pages, mobile and desktop, several times each,
// and writes lighthouse/*.json (the median run per page and device) and LIGHTHOUSE.md.
//
//   npm run build
//   npm run lighthouse
//
// Environment:
//   RUNS=3        runs per page and device (the median run, by performance score, is the one reported)
//   PORT=4020     port for the production server this script starts
//   BASE_URL=...  measure an already running server instead of starting one
//   ONLY=home:mobile,case-study:desktop   run just those page:device pairs (does not rewrite the other rows' files, but LIGHTHOUSE.md only lists what ran)
//   CHROME_PATH   Chrome to drive (defaults to the macOS install)
//
// Honest by construction: a run that fails (for example NO_FCP) is counted and listed, never dropped.
import { execFile, spawn } from "node:child_process";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const run = promisify(execFile);
const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const outDir = path.join(root, "lighthouse");
const tmpDir = path.join(outDir, ".runs");

const RUNS = Number(process.env.RUNS ?? 3);
const PORT = Number(process.env.PORT ?? 4020);
const BASE_URL = process.env.BASE_URL ?? `http://localhost:${PORT}`;
const CHROME_PATH = process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const MAX_ATTEMPTS_PER_RUN = 3;

const ONLY = process.env.ONLY ? new Set(process.env.ONLY.split(",")) : null;
const PAGES = [
  { id: "home", path: "/" },
  { id: "case-study", path: "/case-study" },
];
const DEVICES = ["mobile", "desktop"];
const CATEGORIES = ["performance", "accessibility", "best-practices", "seo"];

const median = (values) => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];

async function waitForServer(url, timeoutMs = 60_000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 400));
  }
  throw new Error(`server at ${url} did not come up within ${timeoutMs}ms`);
}

async function lighthouseOnce(url, device, file) {
  const args = [
    "lighthouse",
    url,
    "--output=json",
    `--output-path=${file}`,
    "--chrome-flags=--headless=new --no-sandbox",
    "--quiet",
  ];
  if (device === "desktop") args.push("--preset=desktop");
  await run("npx", args, { cwd: root, env: { ...process.env, CHROME_PATH }, maxBuffer: 64 * 1024 * 1024 });
  return JSON.parse(readFileSync(file, "utf8"));
}

function summarise(lhr) {
  const scores = Object.fromEntries(CATEGORIES.map((c) => [c, Math.round((lhr.categories[c]?.score ?? 0) * 100)]));
  const audit = (id) => lhr.audits[id];
  return {
    scores,
    metrics: {
      fcp: audit("first-contentful-paint")?.numericValue,
      lcp: audit("largest-contentful-paint")?.numericValue,
      tbt: audit("total-blocking-time")?.numericValue,
      cls: audit("cumulative-layout-shift")?.numericValue,
      speedIndex: audit("speed-index")?.numericValue,
    },
    transferKiB: Math.round((audit("total-byte-weight")?.numericValue ?? 0) / 1024),
    runtimeError: lhr.runtimeError?.code ?? null,
  };
}

const failedAudits = (lhr) =>
  Object.values(lhr.audits)
    .filter((a) => a.score !== null && a.score < 1 && a.scoreDisplayMode !== "informative" && a.scoreDisplayMode !== "notApplicable" && a.scoreDisplayMode !== "manual")
    .map((a) => `${a.id}=${a.score}`);

let server;
if (!process.env.BASE_URL) {
  server = spawn("npx", ["next", "start", "-p", String(PORT)], { cwd: root, stdio: "ignore" });
}
rmSync(tmpDir, { recursive: true, force: true });
mkdirSync(tmpDir, { recursive: true });

const results = [];
let lighthouseVersion = "";
try {
  await waitForServer(BASE_URL);
  for (const page of PAGES) {
    for (const device of DEVICES) {
      if (ONLY && !ONLY.has(`${page.id}:${device}`)) continue;
      const runs = [];
      let failedAttempts = 0;
      const failures = [];
      for (let i = 1; i <= RUNS; i++) {
        let done = false;
        for (let attempt = 1; attempt <= MAX_ATTEMPTS_PER_RUN && !done; attempt++) {
          const file = path.join(tmpDir, `${page.id}-${device}-${i}-${attempt}.json`);
          try {
            const lhr = await lighthouseOnce(BASE_URL + page.path, device, file);
            lighthouseVersion = lhr.lighthouseVersion;
            if (lhr.runtimeError) {
              failedAttempts++;
              failures.push(`run ${i} attempt ${attempt}: ${lhr.runtimeError.code}`);
              continue;
            }
            runs.push({ file, lhr, ...summarise(lhr) });
            done = true;
          } catch (error) {
            failedAttempts++;
            // Lighthouse exits non-zero on a runtime error but still writes the report; read the reason from it.
            let reason = "";
            try {
              reason = JSON.parse(readFileSync(file, "utf8")).runtimeError?.code ?? "";
            } catch {
              /* no report was written */
            }
            const stderr = String(error.stderr ?? "").trim().split("\n").filter(Boolean).slice(-1)[0] ?? "";
            failures.push(`run ${i} attempt ${attempt}: ${reason || stderr || `exit code ${error.code ?? "unknown"}${error.signal ? `, signal ${error.signal}` : ""}`}`.slice(0, 240));
          }
        }
      }
      if (runs.length === 0) {
        results.push({ page, device, runs: [], failedAttempts, failures });
        console.log(`${page.id} ${device}: all attempts failed`);
        continue;
      }
      const perfs = runs.map((r) => r.scores.performance);
      const target = median(perfs);
      const chosen = runs.find((r) => r.scores.performance === target) ?? runs[0];
      writeFileSync(path.join(outDir, `${page.id}-${device}.json`), JSON.stringify(chosen.lhr));
      const row = {
        page,
        device,
        reported: { scores: chosen.scores, metrics: chosen.metrics, transferKiB: chosen.transferKiB },
        allRuns: runs.map((r) => r.scores),
        failedAttempts,
        failures,
        notPerfect: failedAudits(chosen.lhr),
      };
      results.push(row);
      console.log(`${page.id} ${device}: ${JSON.stringify(row.reported.scores)} (runs: ${runs.length}, failed attempts: ${failedAttempts})`);
    }
  }
} finally {
  server?.kill();
  rmSync(tmpDir, { recursive: true, force: true });
}

const NOTE = "These are diagnostics and insights. Lighthouse gives them zero weight in the category scores (the five weighted metrics are FCP, LCP, TBT, CLS and Speed Index), so they cannot change a score. They are listed rather than hidden. The unused and legacy JavaScript items are the framework's own runtime chunk, which this page cannot drop.";
const date = new Date().toLocaleDateString("en-CA"); // local date, YYYY-MM-DD
const ms = (n) => (n === undefined ? "n/a" : `${(n / 1000).toFixed(2)} s`);
const lines = [];
lines.push("# Lighthouse results", "");
const isLocal = /^https?:\/\/(localhost|127\.0\.0\.1)/.test(BASE_URL);
lines.push(isLocal ? `Measured ${date} with Lighthouse ${lighthouseVersion} on a local production build (\`next build\` then \`next start\`), Chrome headless, one machine.` : `Measured ${date} with Lighthouse ${lighthouseVersion} against the deployed site ${BASE_URL} (Vercel production), Chrome headless, run from one machine.`);
lines.push((isLocal ? "These are lab numbers from a localhost server, not field data and not a deployed URL." : "These are lab numbers measured over the public internet from one machine, not field data from real visitors.") + " Lighthouse varies run to run, so each cell is the median run of " + RUNS + ".", "");
lines.push("Command (this is what `npm run lighthouse` runs for each row):", "");
lines.push("```bash");
lines.push(`CHROME_PATH="${CHROME_PATH}" npx lighthouse ${BASE_URL}<path> --output=json --output-path=lighthouse/<page>-<device>.json --chrome-flags="--headless=new --no-sandbox" --quiet [--preset=desktop]`);
lines.push("```", "");
lines.push("| Page | Device | Performance | Accessibility | Best practices | SEO | LCP | TBT | CLS | Transfer |");
lines.push("| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |");
for (const r of results) {
  if (!r.reported) {
    lines.push(`| \`${r.page.path}\` | ${r.device} | failed | failed | failed | failed | | | | |`);
    continue;
  }
  const s = r.reported.scores;
  const m = r.reported.metrics;
  lines.push(
    `| \`${r.page.path}\` | ${r.device} | ${s.performance} | ${s.accessibility} | ${s["best-practices"]} | ${s.seo} | ${ms(m.lcp)} | ${Math.round(m.tbt ?? 0)} ms | ${(m.cls ?? 0).toFixed(3)} | ${r.reported.transferKiB} KiB |`,
  );
}
lines.push("", "## Every run", "");
lines.push("| Page | Device | Performance | Accessibility | Best practices | SEO | Failed attempts |");
lines.push("| --- | --- | --- | --- | --- | --- | ---: |");
for (const r of results) {
  const col = (key) => (r.allRuns ? r.allRuns.map((x) => x[key]).join(" / ") : "none");
  lines.push(`| \`${r.page.path}\` | ${r.device} | ${col("performance")} | ${col("accessibility")} | ${col("best-practices")} | ${col("seo")} | ${r.failedAttempts} |`);
}
const failureLines = results.flatMap((r) => r.failures.map((f) => `- \`${r.page.path}\` ${r.device}, ${f}`));
if (failureLines.length) lines.push("", "## Failed attempts", "", ...failureLines);
const imperfect = results.filter((r) => r.notPerfect?.length);
if (imperfect.length) {
  lines.push("", "## Audits that did not score 1 in the reported run", "", NOTE, "");
  for (const r of imperfect) lines.push(`- \`${r.page.path}\` ${r.device}: ${r.notPerfect.join(", ")}`);
}
lines.push("", "The full JSON report for each reported run is in `lighthouse/` (open one at https://googlechrome.github.io/lighthouse/viewer/).", "");
writeFileSync(path.join(root, "LIGHTHOUSE.md"), lines.join("\n"));
writeFileSync(path.join(outDir, "summary.json"), JSON.stringify({ date, lighthouseVersion, runs: RUNS, results: results.map(({ page, device, reported, allRuns, failedAttempts, failures, notPerfect }) => ({ page: page.path, device, reported, allRuns, failedAttempts, failures, notPerfect })) }, null, 2));
console.log("wrote LIGHTHOUSE.md");
