import Link from "next/link";
import { LogoMark } from "./icons";
import { SITE_NAME } from "@/lib/site";

const COLUMNS = [
  {
    heading: "Product",
    links: [
      { href: "/#features", label: "Features" },
      { href: "/#pricing", label: "Pricing" },
      { href: "/#faq", label: "FAQ" },
    ],
  },
  {
    heading: "Read",
    links: [{ href: "/case-study", label: "Case study" }],
  },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface-2">
      <div className="container-page grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="flex items-center gap-2.5 text-xl font-extrabold tracking-tight">
            <LogoMark />
            {SITE_NAME}
          </p>
          <p className="mt-3 max-w-xs text-muted">Scheduling that stays out of your inbox.</p>
        </div>
        {COLUMNS.map((column) => (
          <nav key={column.heading} aria-label={column.heading}>
            <h2 className="text-sm font-extrabold uppercase tracking-widest text-muted">{column.heading}</h2>
            <ul className="mt-3 space-y-1">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="inline-block py-1 text-ink hover:text-brand">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-line">
        <p className="container-page py-5 text-sm text-muted">
          &copy; 2026 {SITE_NAME}. A fictional product, built as a portfolio example. Names, quotes and figures are invented.
        </p>
      </div>
    </footer>
  );
}
