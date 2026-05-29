import { test, expect, describe } from "bun:test";
import { getOpenAIFinalSize, openAIFinalSizeToDims } from "./size";

describe("getOpenAIFinalSize", () => {
  test("square band -> 1024x1024", () => {
    expect(getOpenAIFinalSize({ width: 16, height: 16 })).toBe("1024x1024"); // 1.0
    expect(getOpenAIFinalSize({ width: 11, height: 10 })).toBe("1024x1024"); // 1.1
  });
  test("landscape (ar >= 1.2) -> 1536x1024", () => {
    expect(getOpenAIFinalSize({ width: 24, height: 16 })).toBe("1536x1024"); // 1.5
    expect(getOpenAIFinalSize({ width: 12, height: 10 })).toBe("1536x1024"); // 1.2 exactly
  });
  test("portrait (ar <= 1/1.2) -> 1024x1536", () => {
    expect(getOpenAIFinalSize({ width: 16, height: 24 })).toBe("1024x1536"); // 0.667
    expect(getOpenAIFinalSize({ width: 10, height: 16 })).toBe("1024x1536"); // 0.625
  });
});

describe("openAIFinalSizeToDims", () => {
  test("parses the size string", () => {
    expect(openAIFinalSizeToDims("1024x1024")).toEqual({ width: 1024, height: 1024 });
    expect(openAIFinalSizeToDims("1536x1024")).toEqual({ width: 1536, height: 1024 });
    expect(openAIFinalSizeToDims("1024x1536")).toEqual({ width: 1024, height: 1536 });
  });
});
