import {
  test,
  expect,
  describe,
  spyOn,
  afterEach,
} from "bun:test";
import { createCanvasFromImage, fileToImageElement } from "./imageProcessers";

// happy-dom does not implement a real canvas 2D context (getContext returns
// null) and never fires Image load/error events, so both code paths are driven
// through controlled stubs that are always restored afterwards.

afterEach(() => {
  // Restore any prototype patches made during a test.
  // (spyOn auto-restores via mockRestore calls below; this is a safety net.)
});

describe("createCanvasFromImage", () => {
  test("throws when the 2D context is unavailable", () => {
    // Default happy-dom behavior: getContext("2d") => null.
    const img = { width: 8, height: 4 } as unknown as HTMLImageElement;
    expect(() => createCanvasFromImage(img)).toThrow("Failed to get CTX");
  });

  test("creates a canvas sized to the image and draws onto it", () => {
    const calls: Array<[string, ...unknown[]]> = [];
    const fakeCtx = {
      globalCompositeOperation: "",
      drawImage: (...a: unknown[]) => calls.push(["drawImage", ...a]),
    };
    const spy = spyOn(
      HTMLCanvasElement.prototype,
      "getContext"
    ).mockReturnValue(fakeCtx as unknown as CanvasRenderingContext2D);

    try {
      const img = { width: 16, height: 9 } as unknown as HTMLImageElement;
      const canvas = createCanvasFromImage(img);

      // Canvas takes the image's dimensions.
      expect(canvas.width).toBe(16);
      expect(canvas.height).toBe(9);
      // Composite mode is set for an opaque draw.
      expect(fakeCtx.globalCompositeOperation).toBe("source-over");
      // The image was drawn at the origin.
      expect(calls).toHaveLength(1);
      expect(calls[0][0]).toBe("drawImage");
      expect(calls[0][1]).toBe(img);
      expect(calls[0][2]).toBe(0);
      expect(calls[0][3]).toBe(0);
    } finally {
      spy.mockRestore();
    }
  });
});

describe("fileToImageElement", () => {
  test("resolves with the loaded image when decoding succeeds", async () => {
    const OriginalImage = window.Image;
    // Fake Image that fires onload synchronously once src is assigned.
    class FakeImage {
      width = 10;
      height = 20;
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      private _src = "";
      set src(value: string) {
        this._src = value;
        // Simulate a successful async decode.
        queueMicrotask(() => this.onload?.());
      }
      get src() {
        return this._src;
      }
    }
    (window as unknown as { Image: unknown }).Image =
      FakeImage as unknown as typeof window.Image;

    try {
      const file = new File([new Uint8Array([137, 80, 78, 71])], "x.png", {
        type: "image/png",
      });
      const img = await fileToImageElement(file);
      expect((img as unknown as FakeImage).width).toBe(10);
      expect((img as unknown as FakeImage).src.startsWith("data:image/png")).toBe(
        true
      );
    } finally {
      (window as unknown as { Image: unknown }).Image = OriginalImage;
    }
  });

  test("rejects when the image fails to decode", async () => {
    const OriginalImage = window.Image;
    class FailingImage {
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      private _src = "";
      set src(value: string) {
        this._src = value;
        queueMicrotask(() => this.onerror?.());
      }
      get src() {
        return this._src;
      }
    }
    (window as unknown as { Image: unknown }).Image =
      FailingImage as unknown as typeof window.Image;

    try {
      const file = new File([new Uint8Array([0, 0, 0])], "bad.png", {
        type: "image/png",
      });
      let rejected = false;
      let message = "";
      try {
        await fileToImageElement(file);
      } catch (e) {
        rejected = true;
        message = (e as Error).message;
      }
      expect(rejected).toBe(true);
      expect(message).toBe("Failed to load image");
    } finally {
      (window as unknown as { Image: unknown }).Image = OriginalImage;
    }
  });

  test("rejects when the FileReader errors", async () => {
    const OriginalReader = globalThis.FileReader;
    class FailingReader {
      onload: ((e: unknown) => void) | null = null;
      onerror: (() => void) | null = null;
      result: string | null = null;
      readAsDataURL() {
        queueMicrotask(() => this.onerror?.());
      }
    }
    (globalThis as unknown as { FileReader: unknown }).FileReader =
      FailingReader as unknown as typeof FileReader;

    try {
      const file = new File([new Uint8Array([1])], "x.png", {
        type: "image/png",
      });
      let message = "";
      try {
        await fileToImageElement(file);
      } catch (e) {
        message = (e as Error).message;
      }
      expect(message).toBe("Failed to load image");
    } finally {
      (globalThis as unknown as { FileReader: unknown }).FileReader =
        OriginalReader;
    }
  });
});
