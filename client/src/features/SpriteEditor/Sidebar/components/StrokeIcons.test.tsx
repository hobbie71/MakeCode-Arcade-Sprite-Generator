import { test, expect, describe } from "bun:test";
import { renderWithProviders, screen } from "../../../../test/test-utils";
import StrokeIcons from "./StrokeIcons";
import { STROKE_SIZES } from "../../../../types/pixel";

describe("StrokeIcons", () => {
  test("renders one icon per configured stroke size", () => {
    const { container } = renderWithProviders(<StrokeIcons />);
    expect(container.querySelectorAll("button").length).toBe(STROKE_SIZES.length);
  });

  test("labels each stroke icon with its size", () => {
    renderWithProviders(<StrokeIcons />);
    for (const size of STROKE_SIZES) {
      expect(screen.getByRole("button", { name: `${size}px stroke` })).toBeTruthy();
    }
  });
});
