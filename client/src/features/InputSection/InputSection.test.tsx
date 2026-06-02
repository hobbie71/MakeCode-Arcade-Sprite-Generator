import { test, expect, describe, mock } from "bun:test";
import { renderWithProviders, screen, fireEvent } from "../../test/test-utils";
import InputSection from "./InputSection";

describe("InputSection", () => {
  test("renders the generation heading for the default (Sprite) asset", () => {
    renderWithProviders(<InputSection />);
    // Heading reads "Generate {selectedAsset}" — defaults to "sprite".
    const heading = screen.getByRole("heading", { name: /Generate sprite/ });
    expect(heading).toBeTruthy();
    expect(heading.textContent).toContain("sprite");
  });

  test("renders the asset tabs, palette selection and generation method sections", () => {
    renderWithProviders(<InputSection />);
    // AssetOptionsSelection: Sprite tab present.
    expect(screen.getByRole("button", { name: "Sprite" })).toBeTruthy();
    // PaletteSelection.
    expect(screen.getByText("Palette:")).toBeTruthy();
    // GenerationMethodSection heading.
    expect(screen.getByText("Generation Method")).toBeTruthy();
  });

  test("does not render a close button by default", () => {
    renderWithProviders(<InputSection />);
    // X_Button renders with the hardcoded aria-label "Close menu".
    expect(screen.queryByLabelText("Close menu")).toBeNull();
  });

  test("renders a close button and wires onClose when showCloseButton is set", () => {
    const onClose = mock();
    renderWithProviders(
      <InputSection showCloseButton onClose={onClose} />,
    );
    const closeBtn = screen.getByLabelText("Close menu");
    expect(closeBtn).toBeTruthy();
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("omits the close button when showCloseButton is true but no onClose is provided", () => {
    renderWithProviders(<InputSection showCloseButton />);
    expect(screen.queryByLabelText("Close menu")).toBeNull();
  });
});
