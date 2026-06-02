import { test, expect, describe } from "bun:test";
import { renderWithProviders } from "../../../test/test-utils";
import Canvas from "./Canvas";

describe("Canvas", () => {
  test("mounts and renders a <canvas> inside the container", () => {
    const { container } = renderWithProviders(<Canvas width={16} height={16} />);
    const root = container.querySelector(".canvas-container");
    expect(root).toBeTruthy();
    // Main sprite canvas + preview canvas both render.
    const canvases = container.querySelectorAll("canvas");
    expect(canvases.length).toBeGreaterThanOrEqual(2);
  });

  test("the container exposes the application role and accessible label", () => {
    const { container } = renderWithProviders(<Canvas width={16} height={16} />);
    const root = container.querySelector('[role="application"]');
    expect(root).toBeTruthy();
    expect((root as HTMLElement).getAttribute("aria-label")).toBe(
      "Sprite Editor Canvas",
    );
  });

  test("sizes the main canvas to width*pixelSize by height*pixelSize", () => {
    const { container } = renderWithProviders(
      <Canvas width={16} height={16} pixelSize={20} />,
    );
    const canvas = container.querySelector(
      'canvas[role="img"]',
    ) as HTMLCanvasElement | null;
    expect(canvas).toBeTruthy();
    expect(canvas!.width).toBe(16 * 20);
    expect(canvas!.height).toBe(16 * 20);
  });
});
