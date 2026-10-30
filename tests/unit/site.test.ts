import { describe, expect, it } from "vitest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { FAQS, FEATURES, PLANS, TESTIMONIALS } from "@/lib/content";
import { NAV_LINKS, PAGES, SITE_URL } from "@/lib/site";

describe("content", () => {
  it("has three plans and exactly one featured", () => {
    expect(PLANS).toHaveLength(3);
    expect(PLANS.filter((plan) => plan.featured)).toHaveLength(1);
  });

  it("has three features, three testimonials and unique ids", () => {
    expect(FEATURES).toHaveLength(3);
    expect(TESTIMONIALS).toHaveLength(3);
    for (const list of [PLANS.map((p) => p.id), FEATURES.map((f) => f.id), FAQS.map((f) => f.id)]) {
      expect(new Set(list).size).toBe(list.length);
    }
  });

  it("gives every image real alt text", () => {
    for (const feature of FEATURES) expect(feature.image.alt.length).toBeGreaterThan(20);
  });
});

describe("routes", () => {
  it("lists every page in the sitemap with an absolute URL", () => {
    const urls = sitemap().map((entry) => entry.url);
    expect(urls).toEqual([SITE_URL, `${SITE_URL}/case-study`]);
  });

  it("points robots.txt at the sitemap", () => {
    expect(robots().sitemap).toBe(`${SITE_URL}/sitemap.xml`);
  });

  it("only navigates to pages that exist", () => {
    const known = new Set<string>(PAGES.map((page) => page.path));
    for (const link of NAV_LINKS) {
      const path = link.href.split("#")[0] || "/";
      expect(known.has(path), `${link.href}`).toBe(true);
    }
  });
});
