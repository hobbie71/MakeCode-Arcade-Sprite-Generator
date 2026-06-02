import { test, expect, describe } from "bun:test";
import { renderWithProviders, screen, within } from "../../../test/test-utils";
import PostProcessingSection from "./PostProcessingSection";
import { ALL_CROP_OPTIONS } from "../../../types/export";

describe("PostProcessingSection", () => {
  test("renders the Image Processing heading", () => {
    renderWithProviders(<PostProcessingSection />);
    expect(screen.getByText("Image Processing")).toBeTruthy();
  });

  test("renders the Remove Background toggle", () => {
    renderWithProviders(<PostProcessingSection />);
    expect(screen.getByText("Remove Background")).toBeTruthy();
    expect(screen.getByRole("switch")).toBeTruthy();
  });

  test("renders the Crop Options dropdown with all crop choices", () => {
    renderWithProviders(<PostProcessingSection />);
    expect(screen.getByText("Crop Options")).toBeTruthy();
    const select = screen.getByRole("combobox") as HTMLSelectElement;
    expect(select.options.length).toBe(ALL_CROP_OPTIONS.length);
    for (const crop of ALL_CROP_OPTIONS) {
      expect(within(select).getByText(crop.name)).toBeTruthy();
    }
  });

  test("renders the Tolerance input when background removal is on (default for Sprite)", () => {
    renderWithProviders(<PostProcessingSection />);
    // The default Sprite asset defaults removeBackground to true, so the
    // Tolerance number input is shown.
    expect(screen.getByText("Tolerance:")).toBeTruthy();
    const tolerance = screen.getByLabelText("Tolerance") as HTMLInputElement;
    expect(tolerance.type).toBe("number");
  });
});
