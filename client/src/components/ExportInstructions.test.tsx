import { test, expect, describe, mock } from "bun:test";
import { renderWithProviders, screen, fireEvent } from "../test/test-utils";
import ExportInstructions from "./ExportInstructions";

describe("ExportInstructions", () => {
  test("renders the heading and step instructions", () => {
    renderWithProviders(
      <ExportInstructions closeExportInstructions={mock()} />,
    );
    expect(
      screen.getByText("How To Export to MakeCode Arcade"),
    ).toBeTruthy();
    expect(screen.getByText(/Click inside the Sprite Editor canvas/)).toBeTruthy();
    expect(
      screen.getByText(/Your sprite will appear in the editor/),
    ).toBeTruthy();
  });

  test("renders the guide image", () => {
    const { container } = renderWithProviders(
      <ExportInstructions closeExportInstructions={mock()} />,
    );
    const img = container.querySelector("img");
    expect(img).toBeTruthy();
    expect(img!.getAttribute("alt")).toContain("MakeCode Arcade");
  });

  test("clicking the close button fires closeExportInstructions", () => {
    const close = mock();
    renderWithProviders(
      <ExportInstructions closeExportInstructions={close} />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Close menu" }));
    expect(close).toHaveBeenCalledTimes(1);
  });
});
