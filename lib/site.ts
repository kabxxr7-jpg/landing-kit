/** Fictional product, so the production URL is a reserved `.example` domain. Override with SITE_URL when deploying. */
export const SITE_URL = (process.env.SITE_URL ?? "https://tidepool.example").replace(/\/$/, "");

export const SITE_NAME = "Tidepool";

export const SITE_DESCRIPTION =
  "Tidepool reads everyone's calendars, finds the time that costs the least focus, and books it. Fewer scheduling emails for teams of any size.";

export const NAV_LINKS = [
  { href: "/#features", label: "Features" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#faq", label: "FAQ" },
  { href: "/case-study", label: "Case study" },
] as const;

export type NavLink = (typeof NAV_LINKS)[number];

/** Pages that exist, for the sitemap. Add a route here when you add a page. */
export const PAGES = [
  { path: "/", priority: 1 },
  { path: "/case-study", priority: 0.7 },
] as const;
