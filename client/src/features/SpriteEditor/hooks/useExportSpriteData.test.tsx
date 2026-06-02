import { test, expect, describe, afterEach } from "bun:test";
import { act } from "@testing-library/react";
import { renderHookWithProviders } from "../../../test/test-utils";
import { useExportSpriteData } from "./useExportSpriteData";
import { useSprite } from "../../../context/SpriteContext/useSprite";
import { useCanvasSize } from "../../../context/CanvasSizeContext/useCanvasSize";
import { MakeCodeColor } from "../../../types/color";
import { ImageExportFormats } from "../../../types/export";

// Combined hook so the export hook and the sprite-data setter share the same
// provider instances (same spriteData state).
const useExportHarness = () => ({
  exporter: useExportSpriteData(),
  sprite: useSprite(),
  size: useCanvasSize(),
});

describe("useExportSpriteData", () => {
  afterEach(() => {
    // Remove any <a> elements a test may have appended (DOM-safe cleanup).
    document.querySelectorAll("a").forEach((el) => el.remove());
  });

  test("returns the expected function set", () => {
    const { result } = renderHookWithProviders(() => useExportSpriteData());
    expect(typeof result.current.getImgCode).toBe("function");
    expect(typeof result.current.getJavaScriptCode).toBe("function");
    expect(typeof result.current.getPythonCode).toBe("function");
    expect(typeof result.current.exportSpriteToImage).toBe("function");
  });

  test("getImgCode formats a small sprite into an img`` literal", () => {
    const { result } = renderHookWithProviders(() => useExportHarness());

    const grid = [
      [MakeCodeColor.RED, MakeCodeColor.BLUE],
      [MakeCodeColor.TRANSPARENT, MakeCodeColor.BLACK],
    ];
    act(() => result.current.sprite.setSpriteData(grid));

    const img = result.current.exporter.getImgCode();
    // Rows joined by newline, cells joined by spaces, wrapped in img`...`.
    expect(img).toBe("img`\n2 8\n. f\n`");
  });

  test("getImgCode handles a single-cell sprite", () => {
    const { result } = renderHookWithProviders(() => useExportHarness());
    act(() => result.current.sprite.setSpriteData([[MakeCodeColor.WHITE]]));
    expect(result.current.exporter.getImgCode()).toBe("img`\n1\n`");
  });

  test("getJavaScriptCode wraps img code in sprites.create(...)", () => {
    const { result } = renderHookWithProviders(() => useExportHarness());
    act(() =>
      result.current.sprite.setSpriteData([
        [MakeCodeColor.RED, MakeCodeColor.GREEN],
      ]),
    );

    const js = result.current.exporter.getJavaScriptCode();
    expect(js).toBe(
      "const mySprite = sprites.create(img`\n2 7\n`, SpriteKind.Player)",
    );
  });

  test("getPythonCode strips the img token and converts backticks to triple-quotes", () => {
    const { result } = renderHookWithProviders(() => useExportHarness());
    act(() =>
      result.current.sprite.setSpriteData([
        [MakeCodeColor.RED, MakeCodeColor.GREEN],
      ]),
    );

    const py = result.current.exporter.getPythonCode();
    expect(py).toBe(
      'my_sprite = arcade_sprites.create_sprite("""\n2 7\n""", sprite_kind="Player")',
    );
    // No leftover img token or raw backticks.
    expect(py.includes("img")).toBe(false);
    expect(py.includes("`")).toBe(false);
  });

  test("exportSpriteToImage triggers a download link with the right filename/format", () => {
    const { result } = renderHookWithProviders(() => useExportHarness());

    // The export loop iterates width x height from canvas size, so match it
    // to the seeded 2x2 sprite to avoid reading out-of-bounds cells.
    act(() => {
      result.current.size.setWidth(2);
      result.current.size.setHeight(2);
    });
    act(() =>
      result.current.sprite.setSpriteData([
        [MakeCodeColor.RED, MakeCodeColor.BLUE],
        [MakeCodeColor.GREEN, MakeCodeColor.BLACK],
      ]),
    );

    // happy-dom's canvas may not support a real 2d context; stub out the bits
    // exportSpriteToImage relies on so we can assert the download behavior.
    const created: HTMLAnchorElement[] = [];
    let clicked = 0;
    const realCreate = document.createElement.bind(document);
    const fakeCtx = {
      fillStyle: "",
      fillRect: () => {},
      clearRect: () => {},
    };
    const spy = (tag: string) => {
      if (tag === "canvas") {
        return {
          width: 0,
          height: 0,
          getContext: () => fakeCtx,
          toDataURL: (type: string) => `data:${type};base64,AAAA`,
        } as unknown as HTMLCanvasElement;
      }
      if (tag === "a") {
        const a = realCreate("a") as HTMLAnchorElement;
        a.click = () => {
          clicked++;
        };
        created.push(a);
        return a;
      }
      return realCreate(tag);
    };
    const original = document.createElement;
    // @ts-expect-error overriding for the duration of the test
    document.createElement = spy;

    try {
      act(() => result.current.exporter.exportSpriteToImage(ImageExportFormats.PNG));
    } finally {
      document.createElement = original;
    }

    expect(clicked).toBe(1);
    expect(created.length).toBe(1);
    expect(created[0].download).toBe("my-sprite");
    expect(created[0].href).toContain(`image/${ImageExportFormats.PNG}`);
  });
});
