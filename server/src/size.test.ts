import { test, expect, describe } from "bun:test";
import type { Size } from "@makespritecode/shared";
import { getOpenAIFinalSize, openAIFinalSizeToDims } from "./size";

const MIN_PIXELS = 655_360;
const parse = (s: string): [number, number] =>
  s.split("x").map(Number) as [number, number];

describe("getOpenAIFinalSize", () => {
  test("targets the cheapest valid resolution at the sprite's aspect ratio", () => {
    expect(getOpenAIFinalSize({ width: 16, height: 16 })).toBe("816x816"); // 1.0
    expect(getOpenAIFinalSize({ width: 24, height: 16 })).toBe("1008x672"); // 1.5
    expect(getOpenAIFinalSize({ width: 16, height: 24 })).toBe("672x992"); // 0.667
  });

  test("every output satisfies the gpt-image-2 constraints", () => {
    const cases: Size[] = [
      { width: 16, height: 16 },
      { width: 32, height: 16 },
      { width: 16, height: 32 },
      { width: 160, height: 120 },
      { width: 64, height: 8 }, // 8:1 -> clamped to 3:1
      { width: 8, height: 64 }, // 1:8 -> clamped to 1:3
    ];
    for (const c of cases) {
      const [w, h] = parse(getOpenAIFinalSize(c));
      expect(w % 16).toBe(0);
      expect(h % 16).toBe(0);
      expect(w * h).toBeGreaterThanOrEqual(MIN_PIXELS);
      expect(Math.max(w, h) / Math.min(w, h)).toBeLessThanOrEqual(3);
    }
  });

  test("sits at the floor — no wasted spend above ~10%", () => {
    const [w, h] = parse(getOpenAIFinalSize({ width: 16, height: 16 }));
    expect(w * h).toBeLessThan(MIN_PIXELS * 1.1);
  });
});

describe("openAIFinalSizeToDims", () => {
  test("parses the size string", () => {
    expect(openAIFinalSizeToDims("816x816")).toEqual({ width: 816, height: 816 });
    expect(openAIFinalSizeToDims("1008x672")).toEqual({ width: 1008, height: 672 });
  });
});
