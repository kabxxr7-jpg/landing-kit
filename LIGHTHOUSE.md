# Lighthouse results

Measured 2026-10-31 with Lighthouse 13.6.0 on a local production build (`next build` then `next start`), Chrome headless, one machine.
These are lab numbers from a localhost server, not field data and not a deployed URL. Lighthouse varies run to run, so each cell is the median run of 5.

Command (this is what `npm run lighthouse` runs for each row):

```bash
CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" npx lighthouse http://localhost:4020<path> --output=json --output-path=lighthouse/<page>-<device>.json --chrome-flags="--headless=new --no-sandbox" --quiet [--preset=desktop]
```

| Page | Device | Performance | Accessibility | Best practices | SEO | LCP | TBT | CLS | Transfer |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `/` | mobile | 100 | 100 | 100 | 100 | 0.77 s | 28 ms | 0.000 | 236 KiB |
| `/` | desktop | 100 | 100 | 100 | 100 | 0.49 s | 0 ms | 0.000 | 231 KiB |
| `/case-study` | mobile | 100 | 100 | 100 | 100 | 0.76 s | 13 ms | 0.000 | 214 KiB |
| `/case-study` | desktop | 100 | 100 | 100 | 100 | 0.22 s | 0 ms | 0.000 | 214 KiB |

## Every run

| Page | Device | Performance | Accessibility | Best practices | SEO | Failed attempts |
| --- | --- | --- | --- | --- | --- | ---: |
| `/` | mobile | 100 / 100 / 100 / 100 / 100 | 100 / 100 / 100 / 100 / 100 | 100 / 100 / 100 / 100 / 100 | 100 / 100 / 100 / 100 / 100 | 0 |
| `/` | desktop | 100 / 100 / 100 / 100 / 100 | 100 / 100 / 100 / 100 / 100 | 100 / 100 / 100 / 100 / 100 | 100 / 100 / 100 / 100 / 100 | 0 |
| `/case-study` | mobile | 100 / 100 / 100 / 100 / 100 | 100 / 100 / 100 / 100 / 100 | 100 / 100 / 100 / 100 / 100 | 100 / 100 / 100 / 100 / 100 | 0 |
| `/case-study` | desktop | 100 / 100 / 100 / 100 / 100 | 100 / 100 / 100 / 100 / 100 | 100 / 100 / 100 / 100 / 100 | 100 / 100 / 100 / 100 / 100 | 0 |

## Audits that did not score 1 in the reported run

These are diagnostics and insights. Lighthouse gives them zero weight in the category scores (the five weighted metrics are FCP, LCP, TBT, CLS and Speed Index), so they cannot change a score. They are listed rather than hidden. The unused and legacy JavaScript items are the framework's own runtime chunk, which this page cannot drop.

- `/` mobile: max-potential-fid=0.94, interactive=0.99, unused-javascript=0.5, legacy-javascript-insight=0.5, network-dependency-tree-insight=0, render-blocking-insight=0.5
- `/` desktop: unused-javascript=0, legacy-javascript-insight=0, network-dependency-tree-insight=0, render-blocking-insight=0.5
- `/case-study` mobile: max-potential-fid=0.99, unused-javascript=0.5, legacy-javascript-insight=0.5, network-dependency-tree-insight=0, render-blocking-insight=0
- `/case-study` desktop: unused-javascript=0.5, legacy-javascript-insight=0.5, network-dependency-tree-insight=0, render-blocking-insight=0.5

The full JSON report for each reported run is in `lighthouse/` (open one at https://googlechrome.github.io/lighthouse/viewer/).
