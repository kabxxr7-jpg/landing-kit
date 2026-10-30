import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SiteNav } from "@/components/SiteNav";
import { NAV_LINKS } from "@/lib/site";

function setup() {
  render(<SiteNav links={NAV_LINKS} cta={{ href: "/#pricing", label: "Start free" }} />);
  const button = screen.getByRole("button", { name: /menu/i });
  return { button, nav: screen.getByRole("navigation", { name: "Main" }) };
}

describe("SiteNav", () => {
  it("renders every link into the markup, so crawlers and screen readers always have them", () => {
    setup();
    for (const link of NAV_LINKS) {
      const found = screen.getAllByText(link.label).find((el) => el.getAttribute("href") === link.href);
      expect(found, `${link.label} -> ${link.href}`).toBeTruthy();
    }
  });

  it("starts closed, with the button describing the panel it controls", () => {
    const { button } = setup();
    expect(button.getAttribute("aria-expanded")).toBe("false");
    const controlled = document.getElementById(button.getAttribute("aria-controls") ?? "");
    expect(controlled).toBeTruthy();
    expect(controlled?.tagName).toBe("UL");
    expect(button.textContent).toContain("Open menu");
  });

  it("toggles open and closed from the button, and updates the accessible name", () => {
    const { button } = setup();
    fireEvent.click(button);
    expect(button.getAttribute("aria-expanded")).toBe("true");
    expect(button.textContent).toContain("Close menu");
    fireEvent.click(button);
    expect(button.getAttribute("aria-expanded")).toBe("false");
  });

  it("closes on Escape and returns focus to the button", () => {
    const { button } = setup();
    fireEvent.click(button);
    screen.getByText("Pricing").focus();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(button.getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(button);
  });

  it("closes when a link is chosen", () => {
    const { button } = setup();
    fireEvent.click(button);
    fireEvent.click(screen.getByText("FAQ"));
    expect(button.getAttribute("aria-expanded")).toBe("false");
  });

  it("does not listen for Escape while closed", () => {
    const { button } = setup();
    button.focus();
    const other = document.createElement("input");
    document.body.appendChild(other);
    other.focus();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(document.activeElement).toBe(other);
    other.remove();
  });
});
