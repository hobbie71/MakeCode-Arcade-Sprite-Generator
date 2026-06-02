import { test, expect, describe } from "bun:test";
import { useEffect } from "react";
import { renderWithProviders } from "../../../test/test-utils";
import SelectionOverlay from "./SelectionOverlay";
import { useSelectionArea } from "../contexts/SelectionArea/useSelectionArea";
import { useToolSelected } from "../contexts/ToolSelectedContext/useToolSelected";
import { EditorTools } from "../../../types/tools";
import { PIXEL_SIZE } from "../constants/canvas";

/** Seeds a selection area and forces the "select" tool, then renders the overlay. */
const SeededOverlay = ({
  start,
  end,
}: {
  start: { x: number; y: number };
  end: { x: number; y: number };
}) => {
  const { setSelectionArea } = useSelectionArea();
  const { setTool } = useToolSelected();
  useEffect(() => {
    setTool(EditorTools.Select);
    setSelectionArea({ start, end });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <SelectionOverlay />;
};

describe("SelectionOverlay", () => {
  test("renders nothing when there is no selection area", () => {
    const { container } = renderWithProviders(<SelectionOverlay />);
    expect(container.querySelector("div")).toBeNull();
    expect(container.textContent).toBe("");
  });

  test("renders the marquee with computed geometry from the selection bounds", () => {
    const { container } = renderWithProviders(
      <SeededOverlay start={{ x: 2, y: 3 }} end={{ x: 5, y: 7 }} />,
    );
    const marquee = container.querySelector(".border-dashed") as HTMLElement | null;
    expect(marquee).toBeTruthy();

    // left = minX * PIXEL_SIZE, top = minY * PIXEL_SIZE
    expect(marquee!.style.left).toBe(`${2 * PIXEL_SIZE}px`);
    expect(marquee!.style.top).toBe(`${3 * PIXEL_SIZE}px`);
    // width = (maxX - minX + 1) * PIXEL_SIZE, height = (maxY - minY + 1) * PIXEL_SIZE
    expect(marquee!.style.width).toBe(`${(5 - 2 + 1) * PIXEL_SIZE}px`);
    expect(marquee!.style.height).toBe(`${(7 - 3 + 1) * PIXEL_SIZE}px`);
  });

  test("normalizes reversed start/end coordinates", () => {
    const { container } = renderWithProviders(
      <SeededOverlay start={{ x: 5, y: 7 }} end={{ x: 2, y: 3 }} />,
    );
    const marquee = container.querySelector(".border-dashed") as HTMLElement;
    // min still resolves to 2,3 regardless of order.
    expect(marquee.style.left).toBe(`${2 * PIXEL_SIZE}px`);
    expect(marquee.style.top).toBe(`${3 * PIXEL_SIZE}px`);
  });

  test("renders four corner resize handles", () => {
    const { container } = renderWithProviders(
      <SeededOverlay start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />,
    );
    const handles = container.querySelectorAll(".pointer-events-auto");
    expect(handles.length).toBe(4);
  });
});
