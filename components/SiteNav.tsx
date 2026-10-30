"use client";

import { useEffect, useId, useRef, useState } from "react";
import { CloseIcon, MenuIcon } from "./icons";
import type { NavLink } from "@/lib/site";

/**
 * The one <nav> on the page. At md and up the links sit in the header row. Below that they live in a
 * disclosure panel opened by a button (aria-expanded + aria-controls), which closes on Escape, on
 * choosing a link, and when the viewport grows past the breakpoint.
 *
 * The links are rendered into the server HTML either way, so crawlers and screen readers see them.
 */
export function SiteNav({ links, cta }: { links: readonly NavLink[]; cta: { href: string; label: string } }) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    const desktop = window.matchMedia("(min-width: 48rem)");
    function onBreakpoint() {
      if (desktop.matches) setOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onBreakpoint);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onBreakpoint);
    };
  }, [open]);

  return (
    <nav aria-label="Main" className="flex items-center">
      {/* The button comes first in the markup so that Tab goes from it straight into the opened panel. */}
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex size-11 items-center justify-center rounded-lg border border-line text-ink hover:border-brand md:hidden"
      >
        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        {open ? <CloseIcon /> : <MenuIcon />}
      </button>

      <ul
        id={panelId}
        className={
          (open ? "flex" : "hidden md:flex") +
          " absolute inset-x-0 top-full flex-col gap-1 border-b border-line bg-bg px-4 py-4 shadow-lg md:static md:flex-row md:items-center md:gap-1 md:border-0 md:bg-transparent md:p-0 md:shadow-none"
        }
      >
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-3 font-semibold text-ink no-underline hover:text-brand md:py-2"
            >
              {link.label}
            </a>
          </li>
        ))}
        <li className="mt-2 md:ml-3 md:mt-0">
          <a href={cta.href} onClick={() => setOpen(false)} className="btn btn-primary w-full min-h-11! px-5! py-2! md:w-auto">
            {cta.label}
          </a>
        </li>
      </ul>
    </nav>
  );
}
