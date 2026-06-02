import { test, expect, describe } from "bun:test";
import { render, screen } from "@testing-library/react";
import App from "./App";

// App already composes its own provider stack (AppProviders), so it is rendered
// with plain RTL `render` rather than renderWithProviders. This is a smoke test:
// the whole page tree (NavBar / InputSection / SpriteEditor / ExportSection /
// Footer / ...) must mount without throwing.

describe("App", () => {
  test("mounts the full page tree without throwing", () => {
    expect(() => render(<App />)).not.toThrow();
  });

  test("renders a main landmark", () => {
    render(<App />);
    expect(screen.getByRole("main")).toBeTruthy();
  });

  test("renders at least one banner/navigation landmark", () => {
    render(<App />);
    // NavBar + Footer render. There should be at least one button in the tree.
    expect(screen.getAllByRole("button").length).toBeGreaterThan(0);
  });
});
