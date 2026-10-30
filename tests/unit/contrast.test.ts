import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(resolve(process.cwd(), "app/globals.css"), "utf8");

function tokens(block: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const match of block.matchAll(/--([a-z0-9-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)) out[match[1]!] = match[2]!.toLowerCase();
  return out;
}

// The file has exactly two :root blocks, light first and then the dark one inside the media query.
const blocks = [...css.matchAll(/:root\s*\{([^}]*)\}/g)].map((m) => m[1]!);
const light = tokens(blocks[0] ?? "");
const dark = tokens(blocks[1] ?? "");

function luminance(hex: string): number {
  const channels = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const [r, g, b] = channels.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

// [foreground token, background token, minimum ratio, where it is used]
const PAIRS: [string, string, number, string][] = [
  ["ink", "bg", 7, "body text"],
  ["ink", "surface", 7, "text on cards"],
  ["ink", "surface-2", 7, "text on alternate sections"],
  ["muted", "bg", 4.5, "secondary text"],
  ["muted", "surface", 4.5, "secondary text on cards"],
  ["muted", "surface-2", 4.5, "secondary text on alternate sections"],
  ["brand", "bg", 4.5, "links and eyebrows"],
  ["brand", "surface", 4.5, "brand text on cards"],
  ["brand", "surface-2", 4.5, "brand text on alternate sections"],
  ["brand", "brand-soft", 4.5, "icons on the soft tint"],
  ["on-brand", "brand", 4.5, "primary button and call-to-action band"],
  ["on-brand", "brand-hover", 4.5, "primary button on hover"],
  ["brand", "on-brand", 4.5, "inverse button on the band"],
  ["focus", "bg", 3, "focus ring against the page"],
  ["focus", "surface", 3, "focus ring against cards"],
  ["focus", "surface-2", 3, "focus ring against alternate sections"],
  ["accent", "bg", 4.5, "accent text"],
  ["line", "bg", 1.3, "hairline borders stay visible but quiet"],
];

describe.each([
  ["light", light],
  ["dark", dark],
] as const)("%s theme tokens", (_name, theme) => {
  it("defines every token the pairs use", () => {
    for (const [fg, bg] of PAIRS) {
      expect(theme[fg], `--${fg}`).toBeTruthy();
      expect(theme[bg], `--${bg}`).toBeTruthy();
    }
  });

  it.each(PAIRS)("%s on %s is at least %s:1 (%s)", (fg, bg, min) => {
    const ratio = contrast(theme[fg]!, theme[bg]!);
    expect(ratio, `--${fg} on --${bg} is ${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(min);
  });
});

describe("token files", () => {
  it("has one light block and one dark block with the same token names", () => {
    expect(blocks).toHaveLength(2);
    expect(Object.keys(dark).sort()).toEqual(Object.keys(light).sort());
  });
});
