import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FaqGroup } from "@/components/FaqGroup";

function setup() {
  render(
    <FaqGroup>
      <details name="faq">
        <summary>First question</summary>
        <p>First answer</p>
      </details>
      <details name="faq">
        <summary>Second question</summary>
        <p>Second answer</p>
      </details>
      <details name="faq">
        <summary>Third question</summary>
        <p>Third answer</p>
      </details>
      <button type="button">Not a question</button>
    </FaqGroup>,
  );
  const [first, second, third] = ["First question", "Second question", "Third question"].map((name) => screen.getByText(name));
  return { first: first!, second: second!, third: third!, other: screen.getByText("Not a question") };
}

describe("FaqGroup keyboard shortcuts", () => {
  it("ArrowDown moves focus to the next question and wraps from the last to the first", () => {
    const { first, second, third } = setup();
    first.focus();
    fireEvent.keyDown(first, { key: "ArrowDown" });
    expect(document.activeElement).toBe(second);
    fireEvent.keyDown(second, { key: "ArrowDown" });
    expect(document.activeElement).toBe(third);
    fireEvent.keyDown(third, { key: "ArrowDown" });
    expect(document.activeElement).toBe(first);
  });

  it("ArrowUp moves to the previous question and wraps from the first to the last", () => {
    const { first, second, third } = setup();
    first.focus();
    fireEvent.keyDown(first, { key: "ArrowUp" });
    expect(document.activeElement).toBe(third);
    fireEvent.keyDown(third, { key: "ArrowUp" });
    expect(document.activeElement).toBe(second);
  });

  it("Home and End jump to the first and last question", () => {
    const { first, second, third } = setup();
    second.focus();
    fireEvent.keyDown(second, { key: "End" });
    expect(document.activeElement).toBe(third);
    fireEvent.keyDown(third, { key: "Home" });
    expect(document.activeElement).toBe(first);
  });

  it("prevents the page from scrolling when it handles an arrow key", () => {
    const { first } = setup();
    first.focus();
    const handled = fireEvent.keyDown(first, { key: "ArrowDown" });
    // fireEvent returns false when preventDefault() was called.
    expect(handled).toBe(false);
  });

  it("leaves Enter and Space alone, so the browser's own open/close behaviour runs", () => {
    const { first } = setup();
    first.focus();
    expect(fireEvent.keyDown(first, { key: "Enter" })).toBe(true);
    expect(fireEvent.keyDown(first, { key: " " })).toBe(true);
    expect(document.activeElement).toBe(first);
  });

  it("ignores keys pressed on elements that are not a question", () => {
    const { first, other } = setup();
    other.focus();
    expect(fireEvent.keyDown(other, { key: "ArrowDown" })).toBe(true);
    expect(document.activeElement).toBe(other);
    expect(document.activeElement).not.toBe(first);
  });

  it("ignores arrow keys combined with a modifier, which belong to the browser or screen reader", () => {
    const { first, second } = setup();
    first.focus();
    expect(fireEvent.keyDown(first, { key: "ArrowDown", altKey: true })).toBe(true);
    expect(document.activeElement).toBe(first);
    expect(document.activeElement).not.toBe(second);
  });
});
