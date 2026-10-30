# landing-kit

A responsive, accessible marketing landing page in Next.js and Tailwind CSS, with a long-form case-study page, built as a starting point for "turn this design into a fast landing page" jobs. Everything on it is for a fictional product (Tidepool, a scheduling tool), so there is nothing to confuse with a real client.

**Status:** a proof project. It was tested on one machine (macOS, Chrome only) and measured on a local production build, not on a deployed URL. See "Limits" for what was and was not checked.

## Measured results

Lighthouse 13.6.0, local production build, median of five runs for each page and device, 2026-10-31. Full table, every run, the command, and the reports are in [LIGHTHOUSE.md](LIGHTHOUSE.md) and [lighthouse/](lighthouse/).

| Page | Device | Performance | Accessibility | Best practices | SEO | LCP | TBT | CLS |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `/` | mobile | 100 | 100 | 100 | 100 | 0.77 s | 28 ms | 0 |
| `/` | desktop | 100 | 100 | 100 | 100 | 0.49 s | 0 ms | 0 |
| `/case-study` | mobile | 100 | 100 | 100 | 100 | 0.76 s | 13 ms | 0 |
| `/case-study` | desktop | 100 | 100 | 100 | 100 | 0.22 s | 0 ms | 0 |

Checks that run in this repo: 63 unit tests (Vitest), 58 browser tests (Playwright, real Chrome, including axe accessibility scans in light and dark), ESLint and `tsc --noEmit` with strict settings, all clean at the time of the last run.

## Run it

Needs Node 20.9 or newer (developed and tested on Node 25.2.1) and, for the browser tests and Lighthouse, Google Chrome installed. No browser download is needed.

```bash
npm install
npm run build        # needs internet once: next/font downloads and self-hosts the font at build time
npm start            # http://localhost:3000
```

```bash
npm run dev          # development server
npm run check        # lint, typecheck and unit tests
npm run test:e2e     # browser tests against the production build (run `npm run build` first)
npm run lighthouse   # starts its own server; 2 pages x 2 devices x 3 runs each (RUNS=5 for more); rewrites LIGHTHOUSE.md
npm run images       # re-renders the PNGs in public/images from design-src/*.html
npm run screenshots  # full-page screenshots of a running build, light and dark, desktop and mobile
```

## What is on the page

- **Header** with a responsive nav: inline links on wide screens, a disclosure menu on phones (closes on Escape, on choosing a link, and when the window grows). Skip link, sticky header, labelled landmarks.
- **Hero**, a placeholder **logo strip** (text, no real marks), three **feature blocks**, a **pricing table** (three plans), a **testimonials** row, an **FAQ** accordion and a closing call to action. Footer with real links only.
- **`/case-study`**: breadcrumb, fact sheet, sticky table of contents, long-form text at a readable measure, stat cards, a chart image, a data table with proper headers, and a pull quote.
- **Per-page metadata**, canonical URLs, Open Graph and Twitter tags, a generated Open Graph image for each page, `sitemap.xml`, `robots.txt`, an SVG icon, and a real 404 page.
- **Light and dark** from `prefers-color-scheme`, from one set of tokens.
- **Images** through `next/image` with explicit dimensions and `sizes`, served as AVIF or WebP. The hero image is loaded eagerly at high priority; the rest are lazy.
- **Font** through `next/font`: one variable font, Latin subset, size-matched fallback, no runtime request to a font service.

## How it is built

```
app/            routes, metadata, sitemap, robots, 404, Open Graph images, global CSS and tokens
components/     one file per section; only SiteNav and FaqGroup are client components
lib/            site constants and all the page copy as typed data
design-src/     HTML sources for the two PNGs (rendered by scripts/render-images.mjs)
scripts/        image rendering, Lighthouse runner, screenshots
tests/unit/     Vitest: keyboard logic, nav state, colour contrast, motion rules, content and routes
tests/e2e/      Playwright: structure, nav, FAQ, motion, theme, axe, headers, image formats
```

Decisions worth knowing before you reuse it:

- **The FAQ is native `<details>`.** Tab, Enter and Space work with no JavaScript, and `name="faq"` makes it exclusive in the browser. A small client component adds the arrow-key pattern (Up, Down, Home, End). Without JavaScript the accordion still opens and closes, only without those shortcuts. A test covers both, and checks Chrome's accessibility tree reports the expanded state.
- **Motion is transform and opacity only, and never hides content on its own.** Section reveals use CSS scroll-driven animation inside `@supports (animation-timeline: view())` and `prefers-reduced-motion: no-preference`. A browser without support, or a visitor who asks for reduced motion, gets a static page. There is no JavaScript observer, so nothing waits for a script to appear. The hero text is never animated, so the first paint is not delayed. A unit test fails if a keyframe touches any other property, and a browser test checks running animations on the live page.
- **Colour contrast is tested, not eyeballed.** `tests/unit/contrast.test.ts` reads the tokens out of `globals.css` and checks every text-on-background pair, light and dark, against WCAG AA. Changing a token to a failing value fails the test.
- **The hero carries a proof strip.** It is real content (two headline figures that link to the case study) and it has a measured side effect: on a 412 x 823 phone viewport it keeps the hero screenshot below the first screen, so the largest paint is the headline text. Before it was added, the screenshot was the largest paint, and under Lighthouse's slow-4G simulation it shared the link with the framework's JavaScript: LCP 2.3 s and a mobile score of 98 (a test run with the JavaScript blocked brought LCP down to 1.5 s). See [LIGHTHOUSE.md](LIGHTHOUSE.md) for the final numbers. On taller phones the screenshot may still be the largest paint (not measured); it is a 15 KB AVIF, so that should cost little.
- **No Content-Security-Policy header.** Next injects inline scripts for hydration, so a useful policy needs a nonce per request, which makes every page dynamic. For a static marketing page that trade was not worth it. The other security headers are set in `next.config.ts`.

## Reusing it for a client job

1. Replace `lib/content.ts` and `lib/site.ts` with the client's copy, plans and URL (`SITE_URL` env var for the canonical host).
2. Put the client's tokens into the two `:root` blocks in `app/globals.css`. Run the unit tests; the contrast test tells you if a brand colour fails.
3. Swap the three PNG/SVG images and update `design-src/` if you want to keep rendering them from HTML.
4. Work through [FIGMA-TO-CODE-CHECKLIST.md](FIGMA-TO-CODE-CHECKLIST.md), the order I follow when matching a design.

## Limits

- **Fictional product.** Tidepool, its prices, the testimonials, the logo-strip names and every number on the case-study page are invented. The call-to-action buttons open an email to a reserved `.example` address; there is no sign-up flow, form, CMS, analytics or i18n.
- **Built without a Figma file.** The layout was designed in code, so this repo shows the build, testing and measurement process, not pixel-matching to someone else's design. The checklist describes how that part is done on a real job.
- **The two PNGs are not real product screenshots.** They are rendered from HTML mock-ups in `design-src/`.
- **One machine, one browser engine.** Everything was run on one Mac with Chrome 156 (Chromium) and Node 25.2.1. It was not tested in Safari or Firefox, on a real phone, or with a screen reader beyond Chrome's accessibility tree and axe. Scroll-driven reveals only run where the browser supports them (Chromium, recent Safari); elsewhere the page is simply static.
- **Lab numbers on localhost.** Lighthouse scores come from Lighthouse's simulated mobile throttling against `next start` on the same machine, not a deployed site and not field data from real visitors. They vary run to run (the five-run spread is in LIGHTHOUSE.md), and the machine was busy with other work during some runs. A deployed site over HTTP/2 and a CDN would behave differently, and could be better or worse.
- **Not audited:** keyboard and screen-reader behaviour on iOS, print styles, right-to-left text, very old browsers.
