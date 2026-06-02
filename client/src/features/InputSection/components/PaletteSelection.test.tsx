import { test, expect, describe } from "bun:test";
import { renderWithProviders, screen, within } from "../../../test/test-utils";
import PaletteSelection from "./PaletteSelection";
import { ALL_PALETTES } from "../../../types/color";

describe("PaletteSelection", () => {
  test("renders the Palette label", () => {
    renderWithProviders(<PaletteSelection />);
    expect(screen.getByText("Palette:")).toBeTruthy();
  });

  test("renders one option per palette", () => {
    renderWithProviders(<PaletteSelection />);
    const select = screen.getByRole("combobox") as HTMLSelectElement;
    expect(select.options.length).toBe(ALL_PALETTES.length);
  });

  test("renders the named palette options", () => {
    renderWithProviders(<PaletteSelection />);
    const select = screen.getByRole("combobox");
    for (const pal of ALL_PALETTES) {
      expect(within(select).getByText(pal.name)).toBeTruthy();
    }
  });

  test("selects the currently active palette (defaults to the first)", () => {
    renderWithProviders(<PaletteSelection />);
    const select = screen.getByRole("combobox") as HTMLSelectElement;
    // Default palette is the first entry (index 0).
    expect(select.value).toBe("0");
  });
});
