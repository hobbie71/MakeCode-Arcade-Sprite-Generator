import { test, expect, describe } from "bun:test";
import { getCanvasCoordinates } from "./getCanvasCoordinates";

// A fake canvas whose bounding rect has the given top-left offset.
const makeCanvas = (left = 0, top = 0) =>
  ({
    getBoundingClientRect: () => ({ left, top }),
  }) as unknown as HTMLCanvasElement;

// A minimal fake mouse event carrying client coordinates.
const makeEvent = (clientX: number, clientY: number) =>
  ({ clientX, clientY }) as unknown as React.MouseEvent;

describe("getCanvasCoordinates", () => {
  test("maps client pixels to grid cells at zoom 1 (default pixel size 20)", () => {
    const canvas = makeCanvas(0, 0);
    expect(getCanvasCoordinates(canvas, makeEvent(0, 0), 1)).toEqual({
      x: 0,
      y: 0,
    });
    expect(getCanvasCoordinates(canvas, makeEvent(25, 45), 1)).toEqual({
      x: 1,
      y: 2,
    });
  });

  test("floors fractional cell positions", () => {
    const canvas = makeCanvas(0, 0);
    // 19/20 -> 0, 39/20 -> 1
    expect(getCanvasCoordinates(canvas, makeEvent(19, 39), 1)).toEqual({
      x: 0,
      y: 1,
    });
  });

  test("subtracts the canvas bounding-rect offset", () => {
    const canvas = makeCanvas(100, 50);
    // (140-100)/20 = 2, (90-50)/20 = 2
    expect(getCanvasCoordinates(canvas, makeEvent(140, 90), 1)).toEqual({
      x: 2,
      y: 2,
    });
  });

  test("accounts for zoom factor", () => {
    const canvas = makeCanvas(0, 0);
    // pixelSize*zoom = 20*2 = 40 ; 80/40 = 2
    expect(getCanvasCoordinates(canvas, makeEvent(80, 40), 2)).toEqual({
      x: 2,
      y: 1,
    });
  });

  test("honors an explicit pixel size override", () => {
    const canvas = makeCanvas(0, 0);
    // pixelSize 10, zoom 1 ; 35/10 -> 3
    expect(getCanvasCoordinates(canvas, makeEvent(35, 10), 1, 10)).toEqual({
      x: 3,
      y: 1,
    });
  });

  test("negative client positions floor to negative cells", () => {
    const canvas = makeCanvas(0, 0);
    // -1/20 -> Math.floor(-0.05) = -1
    expect(getCanvasCoordinates(canvas, makeEvent(-1, -1), 1)).toEqual({
      x: -1,
      y: -1,
    });
  });
});
