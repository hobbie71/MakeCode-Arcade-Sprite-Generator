import { test, expect, describe } from "bun:test";
import { renderWithProviders } from "../../../test/test-utils";
import PreviewCanvas from "./PreviewCanvas";

describe("PreviewCanvas", () => {
  test("renders a canvas sized to width*pixelSize by height*pixelSize", () => {
    const { container } = renderWithProviders(
      <PreviewCanvas
        width={8}
        height={4}
        pixelSize={10}
        offset={{ x: 0, y: 0 }}
        zoom={1}
      />,
    );
    const canvas = container.querySelector("canvas") as HTMLCanvasElement | null;
    expect(canvas).toBeTruthy();
    expect(canvas!.width).toBe(80);
    expect(canvas!.height).toBe(40);
  });

  test("applies the offset/zoom transform to the canvas style", () => {
    const { container } = renderWithProviders(
      <PreviewCanvas
        width={16}
        height={16}
        pixelSize={20}
        offset={{ x: 30, y: 40 }}
        zoom={2}
      />,
    );
    const canvas = container.querySelector("canvas") as HTMLCanvasElement;
    expect(canvas.style.transform).toContain("translate(30px, 40px)");
    expect(canvas.style.transform).toContain("scale(2)");
    // The preview canvas should never intercept pointer events.
    expect(canvas.style.pointerEvents).toBe("none");
  });
});
