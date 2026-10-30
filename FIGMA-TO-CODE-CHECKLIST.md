# Figma to code checklist

The order I work in when turning a design into a page, and what I check at each step. It is written for a landing page in Next.js and Tailwind, but the order holds for any stack. Tick the boxes per job; skip a step only on purpose, and note why.

## 0. Before writing any code

Ask these once, up front. Each one costs a day if it is discovered late.

- [ ] Which frames are the source of truth? Mobile, tablet and desktop, or desktop only? Which frame wins if two disagree?
- [ ] Is the design final, or still moving? If it is moving, agree how changes after sign-off are handled.
- [ ] Fonts: which, which weights, licensed for the web? Which are loaded from a font service and which are self-hosted?
- [ ] Copy: final text, or placeholder? Who supplies the real text, and by when?
- [ ] Assets: can I export images, icons and logos from the file, or do they come as files? SVG for marks and icons, original-size PNG or JPG for photos.
- [ ] States the design does not show: hover, focus, error, empty, loading, long text, a very long name, a missing image.
- [ ] Motion: is any shown in the design or a prototype? If not, what is the client expecting?
- [ ] Browsers and devices that must work. If the answer is "all of them", ask for the top three by traffic.
- [ ] What "done" means: a repo, a pull request, a deployed preview, a Lighthouse score? Where does it run?
- [ ] What is out of scope: forms that submit, CMS, analytics, translations, cookie banner, animation beyond the above.

## 1. Tokens before components

Read the whole file first, then write the tokens. Components come after.

- [ ] **Colour.** List every fill and text colour in the file. Name them by job, not by hue (`ink`, `muted`, `surface`, `brand`, not `teal-600`). Merge near-duplicates and tell the client when two "different" greys are really one.
- [ ] **Contrast.** Check every text-on-background pair against WCAG AA (4.5:1 body, 3:1 large text and UI). If a pair fails, say so now and propose the nearest passing value. Better still, put the pairs in a test (see `tests/unit/contrast.test.ts`) so a later edit cannot quietly break one.
- [ ] **Type scale.** Sizes, weights, line heights, letter spacing. Convert Figma's pixel line height to a unitless ratio. Decide which sizes are fluid (`clamp()`) and which are fixed.
- [ ] **Spacing scale.** Find the base unit (usually 4 or 8). Note any value that is off the scale; it is either a mistake in the design or a deliberate exception, and both are worth asking about.
- [ ] **Radius, border, shadow, blur.** A handful of named values, not a value per component.
- [ ] **Dark mode.** If the design has one, take its tokens from the file. If it does not and the client wants one, treat it as extra scope and agree it separately.
- [ ] Tokens live in one place (CSS custom properties, mapped into the Tailwind theme) and nothing downstream hard-codes a hex value.

## 2. Typography

- [ ] Load only the weights and subset the design uses (`next/font`, Latin subset unless the content needs more).
- [ ] Set a fallback with matching metrics so the swap does not move the layout.
- [ ] Check the heading scale at 320px, 768px and 1440px with the real strings, not "Lorem ipsum". Long headings are where designs break.
- [ ] Balance headings (`text-wrap: balance`) and avoid orphans in body text (`text-wrap: pretty`).
- [ ] Body text is at least 16px on mobile, and the line length stays under about 75 characters.

## 3. Layout and breakpoints

- [ ] Build mobile first. Add breakpoints where the layout breaks, not where a device sits.
- [ ] The design shows two or three widths. The page will be opened at every width in between, and at 320px and 1920px. Resize slowly and look at each in-between width.
- [ ] One container component: max width, side gutter (16px on phones), centred.
- [ ] No horizontal scroll at any width. Wide tables and code scroll inside their own box.
- [ ] Sticky headers: set `scroll-margin-top` so anchor links do not land underneath them.
- [ ] Safe areas on notched phones if anything is pinned to an edge.

## 4. Build order

1. [ ] Page shell: document, fonts, tokens, header, footer, skip link, main landmark.
2. [ ] Sections from top to bottom. The hero first, because it carries the largest paint.
3. [ ] Pull a shared component out only on its second real use (button, card, section heading). Not before.
4. [ ] Content lives in typed data (`lib/content.ts`), not in the markup. Swapping the copy should never mean touching layout code.
5. [ ] Inner pages after the home page, reusing what the home page already established.

## 5. Components and states

For every interactive element, build and look at each state, not only the one in the file.

- [ ] Default, hover, **focus-visible**, active, disabled, loading, error.
- [ ] Keyboard: reachable with Tab, in a sensible order, operable with Enter and Space, closable with Escape where it opens something.
- [ ] Touch targets at least 44px tall (24px is the WCAG minimum).
- [ ] Focus ring is visible on every background it can sit on, and has at least 3:1 contrast against it.
- [ ] Use the native element before building one: a link for navigation, a button for actions, `<details>` for a disclosure, a real `<table>` for tabular data.
- [ ] Empty and long-text cases: a name that is 60 characters long, a list with zero items.

## 6. Assets

- [ ] Icons and marks: inline SVG, `aria-hidden` when decorative. No icon font.
- [ ] Photos and screenshots: export at the largest size they will display at, at 2x. Let `next/image` produce AVIF and WebP and the responsive sizes.
- [ ] Every `<Image>` gets explicit `width` and `height` (no layout shift) and a `sizes` that matches the real layout, not the default `100vw`.
- [ ] Identify the largest image or text block in the first screen. That is the LCP element. If it is an image, load it eagerly with `fetchPriority="high"`; every other image is lazy.
- [ ] Alt text says what the image shows or does, or is empty if it is purely decoration. Never "image of".
- [ ] Logos from the client: ask for SVG. Do not reuse third-party marks the client has no right to show.

## 7. Animation

- [ ] Ask what the motion is for. If the answer is "it looks modern", keep it small.
- [ ] Animate `transform` and `opacity` only. Anything else forces layout and causes jank.
- [ ] Never delay the first paint with an animation: do not fade in the headline or the main image.
- [ ] Never hide content until JavaScript runs. A reveal that starts hidden must be driven by CSS the browser can run alone, and must show everything when it is not supported.
- [ ] `prefers-reduced-motion: reduce` turns animation and smooth scrolling off. Test it in the browser's emulation, not by reading the CSS.
- [ ] No auto-playing motion that lasts more than 5 seconds without a pause control.

## 8. Content, structure and SEO

- [ ] One `h1`. Headings never skip a level. Read only the headings and check the page still makes sense.
- [ ] Landmarks: one `header`, `nav` (labelled), `main`, `footer`; each section labelled by its heading.
- [ ] Per-page `title` and `description`, canonical URL, Open Graph and Twitter tags, and an Open Graph image.
- [ ] `sitemap.xml`, `robots.txt`, favicon, and a real 404 page.
- [ ] Every link goes somewhere real. No `href="#"`.
- [ ] `lang` on the `html` element, and `color-scheme` / `theme-color` if there is a dark mode.

## 9. Accessibility pass

Automated checks catch about a third of problems. Do both halves.

- [ ] Automated: axe on every page, in light and dark, with reduced motion on so nothing is mid-animation.
- [ ] Keyboard only: put the mouse away and use the whole page. Can you see where you are at every step? Does Tab ever get trapped or skip something?
- [ ] Zoom to 200% and 400% (equivalent to a 320px window). Nothing is cut off or overlaps.
- [ ] Screen reader smoke test (VoiceOver on macOS): landmarks, headings list, the menu, the accordion, the form.
- [ ] Colour is never the only signal. Links in body text are underlined or otherwise distinguishable.
- [ ] Form fields have visible labels, errors are announced, and required fields are marked in text.

## 10. Performance pass

- [ ] Measure the **production build**, never the dev server.
- [ ] Lighthouse on mobile and desktop for each page, several runs, median reported. Save the reports.
- [ ] Read the diagnosis, not just the score. For a slow LCP, find the LCP element and its breakdown (time to first byte, load delay, load time, render delay).
- [ ] Layout shift is zero: every image has dimensions, fonts have matched fallbacks, nothing is injected above existing content.
- [ ] JavaScript: how much ships, and why. Client components only where something is interactive; everything else stays on the server.
- [ ] Re-measure after every fix. Keep only changes that moved a number.

## 11. Compare against the design

- [ ] Export each frame from Figma at 1x and put it next to the built page at the same width. Flip between them or overlay at 50% opacity.
- [ ] Check at every frame width: spacing, alignment, type size, line breaks, colour, radius, shadow.
- [ ] Write down every deliberate difference and the reason (an accessibility fix, a real-content problem, a browser limit). Send the list with the delivery so the client sees choices rather than mistakes.
- [ ] Do not chase sub-pixel differences caused by font rendering.

## 12. Handover

- [ ] README: how to install, run, build, test, and deploy, in the order a stranger would need them.
- [ ] Tests and checks the client can re-run, with their results written down (dates, commands, numbers).
- [ ] An honest list of what was and was not tested (devices, browsers, assistive technology).
- [ ] What is still placeholder: copy, images, links, third-party keys.
- [ ] How change requests work from here: what is a fix, what is new scope.

## Gotchas that come up again and again

- A design built at 1440px with no mobile frame. Ask for one, or agree the mobile layout in writing before building it.
- Text in the design that fits only because it is short. Test every string at 150% length.
- A "simple" hover effect that has no touch or keyboard equivalent.
- Background images that carry meaning. Use an `<img>` with alt text, not a CSS background.
- A hero image or video that becomes the slowest thing on the page. Decide early what loads first.
- Designs that use a font the client has not licensed for the web.
- Pixel-perfect requests at every width. Agree a tolerance first.
