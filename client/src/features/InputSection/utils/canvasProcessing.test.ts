import {
  test,
  expect,
  describe,
  spyOn,
  afterEach,
} from "bun:test";
import {
  detectBackgroundAndBounds,
  fillToEdges,
  scaleCanvasToTarget,
  cropToVisibleContent,
  removeBackground,
} from "./canvasProcessing";

// happy-dom has no real 2D canvas context, so we drive these functions with
// fully-faked canvas/context objects (for the passed-in source) and, where a
// function internally creates a NEW canvas via document.createElement, we stub
// HTMLCanvasElement.prototype.getContext to hand back a recording fake.

type Px = [number, number, number, number]; // r,g,b,a

/** Build a width*height RGBA buffer from a per-pixel callback. */
function makeData(
  width: number,
  height: number,
  at: (x: number, y: number) => Px
): Uint8ClampedArray {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const [r, g, b, a] = at(x, y);
      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;
      data[i + 3] = a;
    }
  }
  return data;
}

/** A fake HTMLCanvasElement backed by a fixed ImageData buffer. */
function fakeCanvas(
  width: number,
  height: number,
  data: Uint8ClampedArray
): HTMLCanvasElement {
  const ctx = {
    getImageData: () => ({ data, width, height }),
  };
  return {
    width,
    height,
    getContext: () => ctx,
  } as unknown as HTMLCanvasElement;
}

afterEach(() => {
  // each test restores its own spies in a finally block
});

describe("detectBackgroundAndBounds", () => {
  test("throws when the canvas has no 2D context", () => {
    const noCtx = {
      width: 4,
      height: 4,
      getContext: () => null,
    } as unknown as HTMLCanvasElement;
    expect(() => detectBackgroundAndBounds(noCtx)).toThrow(
      "Could not get canvas context"
    );
  });

  test("a uniform canvas yields full-canvas bounds (no content)", () => {
    const W = 5;
    const H = 5;
    const data = makeData(W, H, () => [10, 20, 30, 255]);
    const result = detectBackgroundAndBounds(fakeCanvas(W, H, data));
    expect(result.backgroundColor).toBe("rgba(10, 20, 30, 255)");
    expect(result.boundingBox).toEqual({ x: 0, y: 0, width: W, height: H });
  });

  test("detects the bounding box of a single off-background pixel", () => {
    const W = 5;
    const H = 5;
    // Background everywhere, one bright pixel at (2,3).
    const data = makeData(W, H, (x, y) =>
      x === 2 && y === 3 ? [255, 0, 0, 255] : [0, 0, 0, 255]
    );
    const result = detectBackgroundAndBounds(fakeCanvas(W, H, data), 30);
    expect(result.backgroundColor).toBe("rgba(0, 0, 0, 255)");
    expect(result.boundingBox).toEqual({ x: 2, y: 3, width: 1, height: 1 });
  });

  test("tolerance controls what counts as background", () => {
    const W = 4;
    const H = 4;
    // A pixel that differs by 20 from the black background.
    const data = makeData(W, H, (x, y) =>
      x === 1 && y === 1 ? [20, 20, 20, 255] : [0, 0, 0, 255]
    );
    // High tolerance => the near-black pixel is treated as background => no content.
    const loose = detectBackgroundAndBounds(fakeCanvas(W, H, data), 30);
    expect(loose.boundingBox).toEqual({ x: 0, y: 0, width: W, height: H });
    // Low tolerance => the pixel stands out as content.
    const strict = detectBackgroundAndBounds(fakeCanvas(W, H, data), 5);
    expect(strict.boundingBox).toEqual({ x: 1, y: 1, width: 1, height: 1 });
  });

  test("spanning content produces a multi-pixel bounding box", () => {
    const W = 6;
    const H = 6;
    // Content occupies a rectangle from (1,2) to (4,3).
    const data = makeData(W, H, (x, y) =>
      x >= 1 && x <= 4 && y >= 2 && y <= 3
        ? [255, 255, 255, 255]
        : [0, 0, 0, 255]
    );
    const result = detectBackgroundAndBounds(fakeCanvas(W, H, data), 30);
    expect(result.boundingBox).toEqual({ x: 1, y: 2, width: 4, height: 2 });
  });
});

describe("fillToEdges (input validation)", () => {
  test("throws on non-positive source dimensions", () => {
    const src = { width: 0, height: 10 } as unknown as HTMLCanvasElement;
    expect(() => fillToEdges(src, 16, 16)).toThrow(
      "Source canvas must have positive dimensions"
    );
  });

  test("throws on non-positive target dimensions", () => {
    const src = { width: 10, height: 10 } as unknown as HTMLCanvasElement;
    expect(() => fillToEdges(src, 0, 16)).toThrow(
      "Target dimensions must be positive"
    );
    expect(() => fillToEdges(src, 16, -1)).toThrow(
      "Target dimensions must be positive"
    );
  });
});

describe("fillToEdges (no content)", () => {
  test("returns a target-sized canvas when the source is fully transparent", () => {
    const W = 8;
    const H = 8;
    const data = makeData(W, H, () => [0, 0, 0, 0]); // all transparent
    // getImageData comes from the passed canvas; document.createElement makes the
    // returned canvas (no context needed on the no-content branch).
    const result = fillToEdges(fakeCanvas(W, H, data), 16, 32);
    expect(result.width).toBe(16);
    expect(result.height).toBe(32);
  });
});

describe("scaleCanvasToTarget", () => {
  test("throws when the new canvas has no context", () => {
    // Default happy-dom: created canvas getContext => null.
    const src = { width: 10, height: 10 } as unknown as HTMLCanvasElement;
    expect(() => scaleCanvasToTarget(src, 16, 16)).toThrow("Failed to get CTX");
  });

  test("centers a wider-than-target source, fitting to width", () => {
    const calls: Array<unknown[]> = [];
    const ctx = {
      imageSmoothingEnabled: true,
      drawImage: (...a: unknown[]) => calls.push(a),
    };
    const spy = spyOn(
      HTMLCanvasElement.prototype,
      "getContext"
    ).mockReturnValue(ctx as unknown as CanvasRenderingContext2D);
    try {
      // 20x10 source (aspect 2.0) into 10x10 target (aspect 1.0): fit to width.
      const src = { width: 20, height: 10 } as unknown as HTMLCanvasElement;
      const out = scaleCanvasToTarget(src, 10, 10);
      expect(out.width).toBe(10);
      expect(out.height).toBe(10);
      // Pixel-art: smoothing disabled.
      expect(ctx.imageSmoothingEnabled).toBe(false);
      expect(calls).toHaveLength(1);
      const args = calls[0];
      // drawWidth = 10, drawHeight = round(10/2) = 5
      expect(args[7]).toBe(10); // drawWidth
      expect(args[8]).toBe(5); // drawHeight
      // offsetY centers the 5px-tall draw inside the 10px canvas => 2.
      expect(args[6]).toBe(2); // offsetY
      expect(args[5]).toBe(0); // offsetX
    } finally {
      spy.mockRestore();
    }
  });

  test("centers a taller-than-target source, fitting to height", () => {
    const calls: Array<unknown[]> = [];
    const ctx = {
      imageSmoothingEnabled: true,
      drawImage: (...a: unknown[]) => calls.push(a),
    };
    const spy = spyOn(
      HTMLCanvasElement.prototype,
      "getContext"
    ).mockReturnValue(ctx as unknown as CanvasRenderingContext2D);
    try {
      // 10x20 source (aspect 0.5) into 10x10 target: fit to height.
      const src = { width: 10, height: 20 } as unknown as HTMLCanvasElement;
      scaleCanvasToTarget(src, 10, 10);
      const args = calls[0];
      // drawHeight = 10, drawWidth = round(10*0.5) = 5
      expect(args[8]).toBe(10); // drawHeight
      expect(args[7]).toBe(5); // drawWidth
      expect(args[5]).toBe(2); // offsetX centers the 5px-wide draw
      expect(args[6]).toBe(0); // offsetY
    } finally {
      spy.mockRestore();
    }
  });
});

describe("cropToVisibleContent", () => {
  test("returns a full-size copy when nothing is visible", () => {
    const W = 4;
    const H = 4;
    const transparent = makeData(W, H, () => [0, 0, 0, 0]);
    const src = fakeCanvas(W, H, transparent);
    const drawCalls: unknown[][] = [];
    const ctx = {
      drawImage: (...a: unknown[]) => drawCalls.push(a),
    };
    const spy = spyOn(
      HTMLCanvasElement.prototype,
      "getContext"
    ).mockReturnValue(ctx as unknown as CanvasRenderingContext2D);
    try {
      const out = cropToVisibleContent(src);
      // No content => new canvas keeps the source dimensions.
      expect(out.width).toBe(W);
      expect(out.height).toBe(H);
    } finally {
      spy.mockRestore();
    }
  });

  test("crops tightly to the visible (non-transparent) region", () => {
    const W = 6;
    const H = 6;
    // Visible block from (2,1) to (4,3): width 3, height 3.
    const data = makeData(W, H, (x, y) =>
      x >= 2 && x <= 4 && y >= 1 && y <= 3
        ? [10, 20, 30, 255]
        : [0, 0, 0, 0]
    );
    const src = fakeCanvas(W, H, data);
    const drawCalls: unknown[][] = [];
    const ctx = {
      drawImage: (...a: unknown[]) => drawCalls.push(a),
    };
    const spy = spyOn(
      HTMLCanvasElement.prototype,
      "getContext"
    ).mockReturnValue(ctx as unknown as CanvasRenderingContext2D);
    try {
      const out = cropToVisibleContent(src);
      // Cropped canvas dimensions equal the content bounds.
      expect(out.width).toBe(3);
      expect(out.height).toBe(3);
      expect(drawCalls).toHaveLength(1);
      const args = drawCalls[0];
      // source x,y,w,h = 2,1,3,3
      expect(args[1]).toBe(2);
      expect(args[2]).toBe(1);
      expect(args[3]).toBe(3);
      expect(args[4]).toBe(3);
    } finally {
      spy.mockRestore();
    }
  });
});

describe("removeBackground", () => {
  test("flood-fills the connected background and sets its alpha to 0", () => {
    const W = 4;
    const H = 4;
    // Black background everywhere, a single non-background pixel in the center.
    const data = makeData(W, H, (x, y) =>
      x === 1 && y === 1 ? [255, 0, 0, 255] : [0, 0, 0, 255]
    );
    const src = fakeCanvas(W, H, data);

    let captured: ImageData | null = null;
    const ctx = {
      createImageData: (w: number, h: number) => ({
        data: new Uint8ClampedArray(w * h * 4),
        width: w,
        height: h,
      }),
      getImageData: () => ({ data, width: W, height: H }),
      putImageData: (img: ImageData) => {
        captured = img;
      },
    };
    const spy = spyOn(
      HTMLCanvasElement.prototype,
      "getContext"
    ).mockReturnValue(ctx as unknown as CanvasRenderingContext2D);

    try {
      const out = removeBackground(src, 30);
      expect(out.width).toBe(W);
      expect(out.height).toBe(H);
      expect(captured).not.toBeNull();
      const outData = (captured as unknown as ImageData).data;

      // The center content pixel (1,1) keeps full alpha.
      const contentIdx = (1 * W + 1) * 4;
      expect(outData[contentIdx + 3]).toBe(255);

      // A corner background pixel (0,0) becomes transparent.
      const cornerIdx = (0 * W + 0) * 4;
      expect(outData[cornerIdx + 3]).toBe(0);
    } finally {
      spy.mockRestore();
    }
  });
});
