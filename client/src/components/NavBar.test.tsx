import { test, expect, describe, mock } from "bun:test";
import { renderWithProviders, screen, fireEvent } from "../test/test-utils";
import NavBar from "./NavBar";

describe("NavBar", () => {
  test("renders the title and logo", () => {
    const { container } = renderWithProviders(
      <NavBar
        toggleMobileSidebar={mock()}
        toggleExportInstructions={mock()}
      />,
    );
    expect(
      screen.getByText("MakeCode Arcade AI Sprite Generator"),
    ).toBeTruthy();
    const img = container.querySelector("img");
    expect(img).toBeTruthy();
    expect(img!.getAttribute("alt")).toBe("MakeSpriteCode.com");
  });

  test("clicking 'How to Export' fires toggleExportInstructions", () => {
    const toggleExport = mock();
    renderWithProviders(
      <NavBar
        toggleMobileSidebar={mock()}
        toggleExportInstructions={toggleExport}
      />,
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Show how to export sprite" }),
    );
    expect(toggleExport).toHaveBeenCalledTimes(1);
  });

  test("clicking 'Generate' fires toggleMobileSidebar", () => {
    const toggleSidebar = mock();
    renderWithProviders(
      <NavBar
        toggleMobileSidebar={toggleSidebar}
        toggleExportInstructions={mock()}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Toggle sidebar" }));
    expect(toggleSidebar).toHaveBeenCalledTimes(1);
  });
});
