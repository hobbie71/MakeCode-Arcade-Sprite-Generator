import { describe, it, expect } from "bun:test";
import { renderWithProviders, screen, fireEvent, waitFor } from "../../test/test-utils";
import { Crop } from "../../types/export";
import { usePostProcessing } from "../../context/PostProcessingContext/usePostProcessing";
import { useCanvasSize } from "../../context/CanvasSizeContext/useCanvasSize";
import AssetTypeTabs from "./AssetTypeTabs";

// Probe renders the live context values so the test can assert the effect ran.
function Probe() {
  const { settings } = usePostProcessing();
  const { width, height } = useCanvasSize();
  return (
    <div>
      <span data-testid="size">{`${width}x${height}`}</span>
      <span data-testid="removeBg">{String(settings.removeBackground)}</span>
      <span data-testid="crop">{settings.crop}</span>
    </div>
  );
}

describe("AssetTypeTabs", () => {
  it("renders a tab per asset type and applies the Sprite preset on mount", async () => {
    renderWithProviders(
      <>
        <AssetTypeTabs />
        <Probe />
      </>
    );

    expect(screen.getByRole("radio", { name: "Sprite" })).toBeTruthy();
    expect(screen.getByRole("radio", { name: "Background" })).toBeTruthy();
    expect(screen.getByRole("radio", { name: "Tile" })).toBeTruthy();

    await waitFor(() => {
      expect(screen.getByTestId("size").textContent).toBe("64x64");
    });
    expect(screen.getByTestId("removeBg").textContent).toBe("true");
  });

  it("applies the Background preset when the Background tab is clicked", async () => {
    renderWithProviders(
      <>
        <AssetTypeTabs />
        <Probe />
      </>
    );

    fireEvent.click(screen.getByRole("radio", { name: "Background" }));

    await waitFor(() => {
      expect(screen.getByTestId("size").textContent).toBe("160x120");
    });
    expect(screen.getByTestId("removeBg").textContent).toBe("false");
    expect(screen.getByTestId("crop").textContent).toBe(Crop.Fill);
  });
});
