// Infrastructure guard: proves the client test environment itself works —
// happy-dom is registered, RTL can render into the DOM, and the full provider
// stack mounts. If this file fails, no other client test can be trusted.
import { test, expect, describe } from "bun:test";
import { renderWithProviders, screen } from "./test-utils";

describe("client test infrastructure", () => {
  test("happy-dom registers a document/window", () => {
    expect(typeof document).toBe("object");
    expect(typeof window).toBe("object");
    const el = document.createElement("div");
    expect(el.tagName).toBe("DIV");
  });

  test("React Testing Library renders a component", () => {
    renderWithProviders(<button type="button">click me</button>);
    expect(screen.getByRole("button", { name: "click me" })).toBeTruthy();
  });

  test("the full provider stack mounts without throwing", () => {
    renderWithProviders(<span data-testid="child">ok</span>);
    expect(screen.getByTestId("child").textContent).toBe("ok");
  });
});
