import { test, expect, describe } from "bun:test";
import { renderWithProviders, screen } from "../../../test/test-utils";
import AssetOptionsSelection from "./AssetOptionsSelection";
import { ALL_ASSETS_TYPE } from "../../../types/export";

describe("AssetOptionsSelection", () => {
  test("renders a tab button for each catalog asset type", () => {
    renderWithProviders(<AssetOptionsSelection />);
    for (const type of ALL_ASSETS_TYPE) {
      const label = type.charAt(0).toUpperCase() + type.slice(1);
      expect(screen.getByRole("button", { name: label })).toBeTruthy();
    }
  });

  test("renders the same number of tab buttons as catalog entries", () => {
    renderWithProviders(<AssetOptionsSelection />);
    const tabButtons = screen
      .getAllByRole("button")
      .filter((b) => b.className.includes("tab-button"));
    expect(tabButtons.length).toBe(ALL_ASSETS_TYPE.length);
  });

  test("defaults to the Sprite asset and shows the Sprite Size section", () => {
    renderWithProviders(<AssetOptionsSelection />);
    expect(screen.getByText("Sprite Size (px)")).toBeTruthy();
    // Sprite is editable: two number inputs for width/height.
    expect(screen.getAllByRole("spinbutton").length).toBe(2);
  });
});
