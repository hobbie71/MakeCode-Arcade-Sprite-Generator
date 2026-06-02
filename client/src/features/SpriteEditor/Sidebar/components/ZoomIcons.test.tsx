import { test, expect, describe } from "bun:test";
import { renderWithProviders, screen, fireEvent } from "../../../../test/test-utils";
import ZoomIcons from "./ZoomIcons";
import { useZoom } from "../../contexts/ZoomContext/useZoom";
import { MAX_ZOOM, MIN_ZOOM, ZOOM_AMOUNT } from "../../constants/canvas";

const ZoomProbe = () => {
  const { zoom } = useZoom();
  return <span data-testid="zoom">{zoom}</span>;
};

describe("ZoomIcons", () => {
  test("renders zoom-out and zoom-in buttons", () => {
    renderWithProviders(<ZoomIcons />);
    expect(screen.getByRole("button", { name: "Zoom out" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Zoom in" })).toBeTruthy();
  });

  test("clicking zoom in increases the zoom by ZOOM_AMOUNT", () => {
    renderWithProviders(
      <>
        <ZoomIcons />
        <ZoomProbe />
      </>,
    );
    const start = Number(screen.getByTestId("zoom").textContent);
    fireEvent.click(screen.getByRole("button", { name: "Zoom in" }));
    const after = Number(screen.getByTestId("zoom").textContent);
    expect(after).toBeCloseTo(Math.min(MAX_ZOOM, start + ZOOM_AMOUNT));
  });

  test("clicking zoom out decreases the zoom by ZOOM_AMOUNT (clamped to MIN_ZOOM)", () => {
    renderWithProviders(
      <>
        <ZoomIcons />
        <ZoomProbe />
      </>,
    );
    const start = Number(screen.getByTestId("zoom").textContent);
    fireEvent.click(screen.getByRole("button", { name: "Zoom out" }));
    const after = Number(screen.getByTestId("zoom").textContent);
    expect(after).toBeCloseTo(Math.max(MIN_ZOOM, start - ZOOM_AMOUNT));
  });

  test("zoom out becomes disabled once zoom hits MIN_ZOOM", () => {
    renderWithProviders(
      <>
        <ZoomIcons />
        <ZoomProbe />
      </>,
    );
    const zoomOut = screen.getByRole("button", {
      name: "Zoom out",
    }) as HTMLButtonElement;
    // Click out repeatedly; zoom is clamped to MIN_ZOOM and the button disables.
    for (let i = 0; i < 30; i++) {
      if (zoomOut.disabled) break;
      fireEvent.click(zoomOut);
    }
    expect(Number(screen.getByTestId("zoom").textContent)).toBeCloseTo(MIN_ZOOM);
    expect(zoomOut.disabled).toBe(true);
  });
});
