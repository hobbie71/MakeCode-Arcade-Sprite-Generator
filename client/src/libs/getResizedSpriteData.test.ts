import { test, expect, describe } from "bun:test";
import { getResizedSpriteData } from "./getResizedSpriteData";
import { MakeCodeColor } from "../types/color";

const T = MakeCodeColor.TRANSPARENT;
const R = MakeCodeColor.RED;
const B = MakeCodeColor.BLUE;
const G = MakeCodeColor.GREEN;

describe("getResizedSpriteData", () => {
  test("returns a grid of the requested dimensions", () => {
    const result = getResizedSpriteData([], 3, 2);
    expect(result.length).toBe(2);
    expect(result.every((row) => row.length === 3)).toBe(true);
  });

  test("fills an empty source entirely with transparent", () => {
    const result = getResizedSpriteData([], 2, 2);
    expect(result).toEqual([
      [T, T],
      [T, T],
    ]);
  });

  test("preserves existing pixels when keeping the same size", () => {
    const old = [
      [R, B],
      [G, R],
    ];
    expect(getResizedSpriteData(old, 2, 2)).toEqual([
      [R, B],
      [G, R],
    ]);
  });

  test("grows by padding new cells with transparent (keeps top-left anchor)", () => {
    const old = [
      [R, B],
      [G, R],
    ];
    const result = getResizedSpriteData(old, 3, 3);
    expect(result).toEqual([
      [R, B, T],
      [G, R, T],
      [T, T, T],
    ]);
  });

  test("shrinks by cropping to the top-left region", () => {
    const old = [
      [R, B, G],
      [G, R, B],
      [B, G, R],
    ];
    const result = getResizedSpriteData(old, 2, 2);
    expect(result).toEqual([
      [R, B],
      [G, R],
    ]);
  });

  test("handles asymmetric resize (wider but shorter)", () => {
    const old = [
      [R, B],
      [G, R],
    ];
    const result = getResizedSpriteData(old, 4, 1);
    expect(result).toEqual([[R, B, T, T]]);
  });

  test("treats a ragged source row by padding missing columns", () => {
    const old = [[R], [G, B]];
    const result = getResizedSpriteData(old, 2, 2);
    expect(result).toEqual([
      [R, T],
      [G, B],
    ]);
  });

  test("zero dimensions yield an empty grid", () => {
    expect(getResizedSpriteData([[R]], 0, 0)).toEqual([]);
  });

  test("does not mutate the source array", () => {
    const old = [[R, B]];
    const snapshot = JSON.parse(JSON.stringify(old));
    getResizedSpriteData(old, 3, 3);
    expect(old).toEqual(snapshot);
  });
});
