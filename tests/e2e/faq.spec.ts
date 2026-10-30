import { expect, test, type Page } from "@playwright/test";

const QUESTIONS = [
  "How does Tidepool pick a time?",
  "Which calendars does it work with?",
  "Do guests need an account to book?",
  "Is there a free plan?",
  "How are time zones handled?",
  "What happens to my calendar data?",
];

const summary = (page: Page, index: number) => page.locator("#faq summary").nth(index);
const isOpen = (page: Page, index: number) => page.locator("#faq details").nth(index).evaluate((el) => (el as HTMLDetailsElement).open);

test.describe("FAQ accordion", () => {
  test("lists every question as a keyboard-reachable disclosure", async ({ page }) => {
    await page.goto("/#faq");
    await expect(page.locator("#faq summary")).toHaveText(QUESTIONS);
  });

  test("Tab reaches a question and shows a visible focus ring", async ({ page }) => {
    await page.goto("/");
    await summary(page, 0).focus();
    await page.keyboard.press("Tab");
    await expect(summary(page, 1)).toBeFocused();
    const outline = await summary(page, 1).evaluate((el) => {
      const style = getComputedStyle(el);
      return { width: style.outlineWidth, style: style.outlineStyle };
    });
    expect(outline.style).not.toBe("none");
    expect(parseFloat(outline.width)).toBeGreaterThanOrEqual(2);
  });

  test("Enter and Space open and close the focused question", async ({ page }) => {
    await page.goto("/");
    await summary(page, 2).focus();
    expect(await isOpen(page, 2)).toBe(false);
    await page.keyboard.press("Enter");
    expect(await isOpen(page, 2)).toBe(true);
    await expect(page.getByText("Guests open your link")).toBeVisible();
    await page.keyboard.press("Space");
    expect(await isOpen(page, 2)).toBe(false);
    await expect(page.getByText("Guests open your link")).toBeHidden();
  });

  test("opening one question closes the others", async ({ page }) => {
    await page.goto("/");
    expect(await isOpen(page, 0)).toBe(true);
    await summary(page, 3).focus();
    await page.keyboard.press("Enter");
    expect(await isOpen(page, 3)).toBe(true);
    expect(await isOpen(page, 0)).toBe(false);
    expect(await page.locator("#faq details[open]").count()).toBe(1);
  });

  test("Arrow keys, Home and End move between questions without opening them", async ({ page }) => {
    await page.goto("/");
    await summary(page, 1).focus();
    await page.keyboard.press("ArrowDown");
    await expect(summary(page, 2)).toBeFocused();
    await page.keyboard.press("ArrowUp");
    await page.keyboard.press("ArrowUp");
    await expect(summary(page, 0)).toBeFocused();
    await page.keyboard.press("ArrowUp");
    await expect(summary(page, 5)).toBeFocused();
    await page.keyboard.press("Home");
    await expect(summary(page, 0)).toBeFocused();
    await page.keyboard.press("End");
    await expect(summary(page, 5)).toBeFocused();
    expect(await isOpen(page, 5)).toBe(false);
  });

  test("arrow keys do not scroll the page while moving between questions", async ({ page }) => {
    await page.goto("/#faq");
    // Jumping to #faq scrolls smoothly; let it finish so only the key press can move the page.
    const scrollY = () => page.evaluate(() => Math.round(window.scrollY));
    await expect.poll(async () => { const a = await scrollY(); await page.waitForTimeout(150); return a === (await scrollY()); }, { timeout: 8000 }).toBe(true);
    await summary(page, 0).focus({ timeout: 5000 });
    await page.waitForTimeout(150);
    const before = await scrollY();
    await page.keyboard.press("ArrowDown");
    await page.waitForTimeout(300);
    const after = await scrollY();
    expect(Math.abs(after - before)).toBeLessThan(5);
  });

  test("the open state is exposed to assistive technology", async ({ page }) => {
    await page.goto("/");
    // Read Chrome's real accessibility tree: each question is a disclosure control with an expanded flag.
    const cdp = await page.context().newCDPSession(page);
    const read = async () => {
      const { nodes } = (await cdp.send("Accessibility.getFullAXTree")) as {
        nodes: { role?: { value: string }; name?: { value: string }; properties?: { name: string; value: { value: unknown } }[] }[];
      };
      return QUESTIONS.map((question) => {
        const node = nodes.find((n) => n.name?.value === question && n.role?.value !== "StaticText");
        const expanded = node?.properties?.find((p) => p.name === "expanded")?.value.value;
        return { question, role: node?.role?.value, expanded };
      });
    };
    let state = await read();
    // `name` on <details> makes Chrome report the grouped variant of the disclosure role.
    const role = /^DisclosureTriangle(Grouped)?$/;
    expect(state[0]?.role).toMatch(role);
    expect(state[0]?.expanded).toBe(true);
    for (const item of state.slice(1)) {
      expect(item.role).toMatch(role);
      expect(item.expanded).toBe(false);
    }

    await summary(page, 2).focus();
    await page.keyboard.press("Enter");
    state = await read();
    expect(state[2]?.expanded).toBe(true);
    expect(state[0]?.expanded).toBe(false);
  });
});

test.describe("FAQ accordion without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("still opens and closes by click, and every answer stays in the markup", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#faq details")).toHaveCount(6);
    await summary(page, 4).click();
    expect(await isOpen(page, 4)).toBe(true);
    await expect(page.getByText("Every slot is stored in UTC")).toBeVisible();
    await summary(page, 4).click();
    expect(await isOpen(page, 4)).toBe(false);
  });
});
