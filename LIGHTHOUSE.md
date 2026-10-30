# Lighthouse results

Measured 2026-10-31 with Lighthouse 13.6.0 against the deployed site https://landing-kit-flame.vercel.app (Vercel production), Chrome headless, run from one machine.
These are lab numbers measured over the public internet from one machine, not field data from real visitors. Lighthouse varies run to run, so each cell is the median run of 5. One of the five mobile runs of `/` scored 70 in Performance (the other four scored 100); the median is reported and the outlier is listed under "Every run". An earlier run on a local production build (same day) scored 100 in every one of 20 runs.

Command (this is what `npm run lighthouse` runs for each row):

```bash
CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" npx lighthouse https://landing-kit-flame.vercel.app<path> --output=json --output-path=lighthouse/<page>-<device>.json --chrome-flags="--headless=new --no-sandbox" --quiet [--preset=desktop]
```

| Page | Device | Performance | Accessibility | Best practices | SEO | LCP | TBT | CLS | Transfer |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `/` | mobile | 100 | 100 | 100 | 100 | 0.99 s | 28 ms | 0.000 | 231 KiB |
| `/` | desktop | 100 | 100 | 100 | 100 | 0.43 s | 0 ms | 0.000 | 227 KiB |
| `/case-study` | mobile | 100 | 100 | 100 | 100 | 0.93 s | 13 ms | 0.000 | 213 KiB |
| `/case-study` | desktop | 100 | 100 | 100 | 100 | 0.28 s | 0 ms | 0.000 | 213 KiB |

## Every run

| Page | Device | Performance | Accessibility | Best practices | SEO | Failed attempts |
| --- | --- | --- | --- | --- | --- | ---: |
| `/` | mobile | 70 / 100 / 100 / 100 / 100 | 100 / 100 / 100 / 100 / 100 | 100 / 100 / 100 / 100 / 100 | 100 / 100 / 100 / 100 / 100 | 0 |
| `/` | desktop | 100 / 100 / 100 / 100 / 100 | 100 / 100 / 100 / 100 / 100 | 100 / 100 / 100 / 100 / 100 | 100 / 100 / 100 / 100 / 100 | 0 |
| `/case-study` | mobile | 100 / 100 / 100 / 100 / 100 | 100 / 100 / 100 / 100 / 100 | 100 / 100 / 100 / 100 / 100 | 100 / 100 / 100 / 100 / 100 | 0 |
| `/case-study` | desktop | 100 / 100 / 100 / 100 / 100 | 100 / 100 / 100 / 100 / 100 | 100 / 100 / 100 / 100 / 100 | 100 / 100 / 100 / 100 / 100 | 0 |

## Audits that did not score 1 in the reported run

These are diagnostics and insights. Lighthouse gives them zero weight in the category scores (the five weighted metrics are FCP, LCP, TBT, CLS and Speed Index), so they cannot change a score. They are listed rather than hidden. The unused and legacy JavaScript items are the framework's own runtime chunk, which this page cannot drop.

- `/` mobile: max-potential-fid=0.98, unused-javascript=0.5, legacy-javascript-insight=0.5, network-dependency-tree-insight=0, render-blocking-insight=0
- `/` desktop: unused-javascript=0.5, legacy-javascript-insight=0.5, network-dependency-tree-insight=0, render-blocking-insight=0.5
- `/case-study` mobile: max-potential-fid=0.99, unused-javascript=0.5, legacy-javascript-insight=0.5, network-dependency-tree-insight=0, render-blocking-insight=0
- `/case-study` desktop: unused-javascript=0.5, legacy-javascript-insight=0.5, network-dependency-tree-insight=0, render-blocking-insight=0.5

The full JSON report for each reported run is in `lighthouse/` (open one at https://googlechrome.github.io/lighthouse/viewer/).
