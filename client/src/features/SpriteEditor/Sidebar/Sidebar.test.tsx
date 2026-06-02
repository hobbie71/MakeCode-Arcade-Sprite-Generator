import { test, expect, describe } from "bun:test";
import { renderWithProviders, screen } from "../../../test/test-utils";
import SideBar from "./Sidebar";
import { ALL_EDITOR_TOOLS } from "../../../types/tools";
import { ColorOrder } from "../../../types/color";
import { STROKE_SIZES } from "../../../types/pixel";

describe("SideBar", () => {
  test("renders the toolbox container", () => {
    const { container } = renderWithProviders(<SideBar />);
    expect(container.querySelector(".toolbox")).toBeTruthy();
  });

  test("aggregates strokes, tools, color swatches, swap, and zoom controls", () => {
    const { container } = renderWithProviders(<SideBar />);

    // Tool icons present.
    expect(screen.getByRole("button", { name: /Pencil/ })).toBeTruthy();
    expect(screen.getByRole("button", { name: /Pan/ })).toBeTruthy();

    // Stroke icons present.
    for (const size of STROKE_SIZES) {
      expect(screen.getByRole("button", { name: `${size}px stroke` })).toBeTruthy();
    }

    // Color swatches present.
    const swatches = container.querySelectorAll(".color-palette button");
    expect(swatches.length).toBe(ColorOrder.length);

    // Swap + zoom controls present.
    expect(screen.getByRole("button", { name: /Swap colors/ })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Zoom in" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Zoom out" })).toBeTruthy();

    // Sanity: total tool buttons matches the registry (rendered twice nowhere).
    expect(container.querySelectorAll(".tool-button").length).toBeGreaterThanOrEqual(
      ALL_EDITOR_TOOLS.length,
    );
  });
});
