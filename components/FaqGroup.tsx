"use client";

import { useRef, type KeyboardEvent, type ReactNode } from "react";

/**
 * Keyboard layer for a group of native <details> elements.
 *
 * The browser already does the hard part with no JavaScript: Tab reaches each <summary>, and Enter
 * or Space opens and closes it. This adds the arrow-key pattern from the WAI-ARIA accordion
 * example: Up and Down move between questions, Home and End jump to the first and last.
 * Without JavaScript the accordion still works, only without those shortcuts.
 */
export function FaqGroup({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement;
    if (target.tagName !== "SUMMARY" || event.altKey || event.ctrlKey || event.metaKey) return;

    const summaries = Array.from(ref.current?.querySelectorAll<HTMLElement>("summary") ?? []);
    const current = summaries.indexOf(target);
    if (current === -1) return;

    let next: number;
    switch (event.key) {
      case "ArrowDown":
        next = (current + 1) % summaries.length;
        break;
      case "ArrowUp":
        next = (current - 1 + summaries.length) % summaries.length;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = summaries.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    summaries[next]?.focus();
  }

  return (
    <div ref={ref} onKeyDown={onKeyDown} className={className}>
      {children}
    </div>
  );
}
