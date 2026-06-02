import { test, expect, describe } from "bun:test";
import { renderWithProviders, screen } from "../../../../test/test-utils";
import ColorIcons from "./ColorIcons";
import { ColorOrder } from "../../../../types/color";

describe("ColorIcons", () => {
  test("renders one swatch button per color in ColorOrder", () => {
    const { container } = renderWithProviders(<ColorIcons />);
    const buttons = container.querySelectorAll("button");
    expect(buttons.length).toBe(ColorOrder.length);
  });

  test("includes the Transparent swatch and named-color swatches", () => {
    renderWithProviders(<ColorIcons />);
    expect(screen.getByRole("button", { name: /Select Transparent/ })).toBeTruthy();
    expect(screen.getByRole("button", { name: /Select Red/ })).toBeTruthy();
    expect(screen.getByRole("button", { name: /Select Black/ })).toBeTruthy();
  });
});
