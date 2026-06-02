import { test, expect, describe } from "bun:test";
import { MakeCodePaletteSchema } from "./palette";

describe("MakeCodePaletteSchema", () => {
  test("accepts a record of string keys to string values", () => {
    const palette = {
      ".": "rgba(0,0,0,0)",
      "1": "#FFFFFF",
      a: "#FF0000",
      f: "#000000",
    };
    expect(MakeCodePaletteSchema.parse(palette)).toEqual(palette);
  });

  test("accepts an empty record", () => {
    expect(MakeCodePaletteSchema.parse({})).toEqual({});
  });

  test("rejects a non-string value", () => {
    expect(MakeCodePaletteSchema.safeParse({ "1": 123 }).success).toBe(false);
    expect(MakeCodePaletteSchema.safeParse({ "1": null }).success).toBe(false);
    expect(
      MakeCodePaletteSchema.safeParse({ "1": ["#fff"] }).success,
    ).toBe(false);
  });

  test("rejects a value that is an object instead of a string", () => {
    expect(
      MakeCodePaletteSchema.safeParse({ "1": { hex: "#fff" } }).success,
    ).toBe(false);
  });

  test("rejects a non-object top-level value", () => {
    expect(MakeCodePaletteSchema.safeParse("not an object").success).toBe(false);
    expect(MakeCodePaletteSchema.safeParse(null).success).toBe(false);
    expect(MakeCodePaletteSchema.safeParse(42).success).toBe(false);
  });

  test("rejects when only some values are non-string", () => {
    const result = MakeCodePaletteSchema.safeParse({
      "1": "#FFFFFF",
      "2": 0,
    });
    expect(result.success).toBe(false);
  });
});
