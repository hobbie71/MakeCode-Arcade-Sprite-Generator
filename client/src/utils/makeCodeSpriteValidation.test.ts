import { test, expect, describe } from "bun:test";
import {
  isValidMakeCodeSprite,
  parseMakeCodeSprite,
  stringifyMakeCodeSprite,
  isValidSpriteData,
  getSpriteDimensions,
} from "./makeCodeSpriteValidation";
import { MakeCodeColor } from "../types/color";

const { RED, BLUE, GREEN, TRANSPARENT, WHITE } = MakeCodeColor;

describe("isValidMakeCodeSprite", () => {
  test("accepts a well-formed multi-line img literal", () => {
    expect(isValidMakeCodeSprite("img`\n.123\n4567\n`")).toBe(true);
  });

  test("accepts a single-row sprite", () => {
    expect(isValidMakeCodeSprite("img`1234`")).toBe(true);
  });

  test("strips spaces inside the literal before validating", () => {
    expect(isValidMakeCodeSprite("img`\n. 1 2 3\n4 5 6 7\n`")).toBe(true);
  });

  test("rejects empty and non-string input", () => {
    expect(isValidMakeCodeSprite("")).toBe(false);
    // @ts-expect-error exercising the runtime type guard
    expect(isValidMakeCodeSprite(null)).toBe(false);
    // @ts-expect-error exercising the runtime type guard
    expect(isValidMakeCodeSprite(123)).toBe(false);
  });

  test("rejects a wrong prefix", () => {
    expect(isValidMakeCodeSprite("foo`12`")).toBe(false);
  });

  test("rejects a missing trailing backtick", () => {
    expect(isValidMakeCodeSprite("img`12")).toBe(false);
  });

  test("rejects ragged rows of differing length", () => {
    expect(isValidMakeCodeSprite("img`\n12\n345\n`")).toBe(false);
  });

  test("rejects invalid color characters", () => {
    expect(isValidMakeCodeSprite("img`\nxz\n`")).toBe(false);
  });

  test("rejects content with no rows", () => {
    expect(isValidMakeCodeSprite("img``")).toBe(false);
  });

  test("accepts the maximum 128-wide sprite but rejects 129", () => {
    expect(isValidMakeCodeSprite("img`" + "1".repeat(128) + "`")).toBe(true);
    expect(isValidMakeCodeSprite("img`" + "1".repeat(129) + "`")).toBe(false);
  });

  test("rejects more than 128 rows", () => {
    const rows = Array.from({ length: 129 }, () => "1").join("\n");
    expect(isValidMakeCodeSprite("img`\n" + rows + "\n`")).toBe(false);
  });
});

describe("parseMakeCodeSprite", () => {
  test("parses a valid sprite into a 2D array of color chars", () => {
    // Each cell is the raw color char cast to MakeCodeColor (".123" -> transparent/white/red/pink).
    expect(parseMakeCodeSprite("img`\n.123\n4567\n`")).toEqual([
      [".", "1", "2", "3"],
      ["4", "5", "6", "7"],
    ] as MakeCodeColor[][]);
  });

  test("throws on invalid sprite text", () => {
    expect(() => parseMakeCodeSprite("not a sprite")).toThrow(
      /Invalid MakeCode sprite format/
    );
  });
});

describe("stringifyMakeCodeSprite", () => {
  test("serializes a 2D color array into an img literal", () => {
    const data: MakeCodeColor[][] = [
      [TRANSPARENT, WHITE],
      [RED, BLUE],
    ];
    expect(stringifyMakeCodeSprite(data)).toBe("img`\n.1\n28\n`");
  });

  test("round-trips through parseMakeCodeSprite", () => {
    const original = "img`\n.123\n4567\n`";
    const parsed = parseMakeCodeSprite(original);
    const stringified = stringifyMakeCodeSprite(parsed);
    expect(isValidMakeCodeSprite(stringified)).toBe(true);
    expect(parseMakeCodeSprite(stringified)).toEqual(parsed);
  });

  test("throws on a non-array / empty input", () => {
    // @ts-expect-error exercising the runtime guard
    expect(() => stringifyMakeCodeSprite(null)).toThrow(/non-empty 2D array/);
    expect(() => stringifyMakeCodeSprite([])).toThrow(/non-empty 2D array/);
  });

  test("throws when the first row is empty", () => {
    expect(() => stringifyMakeCodeSprite([[]])).toThrow(
      /rows cannot be empty/
    );
  });

  test("throws on inconsistent row lengths", () => {
    expect(() =>
      stringifyMakeCodeSprite([[RED], [RED, BLUE]])
    ).toThrow(/row 1 has inconsistent length/);
  });

  test("throws on an invalid color value", () => {
    expect(() =>
      stringifyMakeCodeSprite([["z" as MakeCodeColor]])
    ).toThrow(/Invalid color "z" at position \[0, 0\]/);
  });
});

describe("isValidSpriteData", () => {
  test("accepts a rectangular array of valid colors", () => {
    expect(
      isValidSpriteData([
        [RED, BLUE],
        [GREEN, WHITE],
      ])
    ).toBe(true);
  });

  test("rejects non-arrays and empty arrays", () => {
    expect(isValidSpriteData(null)).toBe(false);
    expect(isValidSpriteData([])).toBe(false);
    expect(isValidSpriteData("img`12`")).toBe(false);
  });

  test("rejects an empty first row", () => {
    expect(isValidSpriteData([[]])).toBe(false);
  });

  test("rejects ragged rows", () => {
    expect(isValidSpriteData([[RED], [RED, BLUE]])).toBe(false);
  });

  test("rejects invalid color characters", () => {
    expect(isValidSpriteData([["x"]])).toBe(false);
  });
});

describe("getSpriteDimensions", () => {
  test("returns width and height of a valid sprite", () => {
    const data: MakeCodeColor[][] = [
      [RED, BLUE, GREEN],
      [WHITE, TRANSPARENT, RED],
    ];
    expect(getSpriteDimensions(data)).toEqual({ width: 3, height: 2 });
  });

  test("throws on invalid sprite data", () => {
    expect(() =>
      getSpriteDimensions([[RED], [RED, BLUE]])
    ).toThrow(/Invalid sprite data/);
  });
});
