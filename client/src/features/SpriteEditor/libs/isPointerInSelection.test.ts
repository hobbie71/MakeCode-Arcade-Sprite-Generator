import { test, expect, describe } from "bun:test";
import { isPointerInSelection } from "./isPointerInSelection";

const area = { start: { x: 2, y: 2 }, end: { x: 5, y: 6 } };

describe("isPointerInSelection", () => {
  test("returns false when the area is null", () => {
    expect(isPointerInSelection({ x: 0, y: 0 }, null)).toBe(false);
  });

  test("returns true for a point strictly inside", () => {
    expect(isPointerInSelection({ x: 3, y: 4 }, area)).toBe(true);
  });

  test("includes the boundary corners (inclusive bounds)", () => {
    expect(isPointerInSelection({ x: 2, y: 2 }, area)).toBe(true);
    expect(isPointerInSelection({ x: 5, y: 6 }, area)).toBe(true);
    expect(isPointerInSelection({ x: 2, y: 6 }, area)).toBe(true);
    expect(isPointerInSelection({ x: 5, y: 2 }, area)).toBe(true);
  });

  test("returns false just outside each edge", () => {
    expect(isPointerInSelection({ x: 1, y: 4 }, area)).toBe(false);
    expect(isPointerInSelection({ x: 6, y: 4 }, area)).toBe(false);
    expect(isPointerInSelection({ x: 3, y: 1 }, area)).toBe(false);
    expect(isPointerInSelection({ x: 3, y: 7 }, area)).toBe(false);
  });

  test("normalizes a reversed (end < start) selection", () => {
    const reversed = { start: { x: 5, y: 6 }, end: { x: 2, y: 2 } };
    expect(isPointerInSelection({ x: 3, y: 4 }, reversed)).toBe(true);
    expect(isPointerInSelection({ x: 1, y: 1 }, reversed)).toBe(false);
  });

  test("a single-cell selection only matches that cell", () => {
    const single = { start: { x: 4, y: 4 }, end: { x: 4, y: 4 } };
    expect(isPointerInSelection({ x: 4, y: 4 }, single)).toBe(true);
    expect(isPointerInSelection({ x: 5, y: 4 }, single)).toBe(false);
  });
});
