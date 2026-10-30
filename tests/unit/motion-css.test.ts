import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(resolve(process.cwd(), "app/globals.css"), "utf8");

/** Returns the text of the {...} block that starts at the first "{" at or after `from`. */
function blockAfter(source: string, from: number): string {
  const open = source.indexOf("{", from);
  let depth = 0;
  for (let i = open; i < source.length; i++) {
    if (source[i] === "{") depth++;
    if (source[i] === "}" && --depth === 0) return source.slice(open + 1, i);
  }
  throw new Error("unbalanced braces");
}

describe("motion rules in globals.css", () => {
  it("keyframes only touch opacity and transform, so nothing animates layout", () => {
    const names = [...css.matchAll(/@keyframes\s+([\w-]+)/g)];
    expect(names.length).toBeGreaterThan(0);
    for (const match of names) {
      const body = blockAfter(css, match.index!);
      const properties = [...body.matchAll(/([a-z-]+)\s*:/g)].map((m) => m[1]);
      expect(new Set(properties), `@keyframes ${match[1]}`).toEqual(new Set(properties.filter((p) => p === "opacity" || p === "transform")));
    }
  });

  it("only starts animations inside a prefers-reduced-motion: no-preference block", () => {
    const start = css.indexOf("@media (prefers-reduced-motion: no-preference)");
    expect(start).toBeGreaterThan(-1);
    const motion = blockAfter(css, start);
    const outside = css.replace(motion, "");
    // Outside that block, "animation:" appears only in the reduce override that switches it off.
    const declarations = [...outside.matchAll(/animation\s*:\s*([^;]+);/g)].map((m) => m[1]!.trim());
    for (const value of declarations) expect(value).toMatch(/^none/);
  });

  it("scroll-driven reveals are feature-gated, so unsupported browsers show the content as is", () => {
    const motion = blockAfter(css, css.indexOf("@media (prefers-reduced-motion: no-preference)"));
    const supports = motion.indexOf("@supports (animation-timeline: view())");
    expect(supports).toBeGreaterThan(-1);
    expect(blockAfter(motion, supports)).toContain(".reveal");
  });

  it("has a reduce block that turns animation off", () => {
    const start = css.indexOf("@media (prefers-reduced-motion: reduce)");
    expect(start).toBeGreaterThan(-1);
    expect(blockAfter(css, start)).toMatch(/animation:\s*none\s*!important/);
  });

  it("never hides content by default: no rule sets opacity: 0 outside a keyframe", () => {
    const withoutKeyframes = css.replace(/@keyframes\s+[\w-]+\s*\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}/g, "");
    expect(withoutKeyframes).not.toMatch(/opacity\s*:\s*0\s*[;}]/);
  });
});
