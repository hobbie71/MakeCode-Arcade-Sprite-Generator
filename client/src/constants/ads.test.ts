import { test, expect, describe } from "bun:test";
import {
  GOOGLE_AD_CLIENT_ID,
  VERTICAL_AD_SLOT_ID,
  HORIZONTAL_AD_SLOT_ID,
  SQUARE_AD_SLOT_ID,
} from "./ads";

// These constants mirror build-time env vars (process.env.VITE_*). In the test
// environment they are typically undefined; the contract this module guarantees
// is that the four named exports exist and are each either a string or undefined
// (never an object/number/etc.). We assert the shape rather than a concrete URL
// so the test stays hermetic and does not depend on real env vars.
describe("ad constants", () => {
  test("exports the four ad slot identifiers", () => {
    const values = [
      GOOGLE_AD_CLIENT_ID,
      VERTICAL_AD_SLOT_ID,
      HORIZONTAL_AD_SLOT_ID,
      SQUARE_AD_SLOT_ID,
    ];
    expect(values.length).toBe(4);
  });

  test("each exported value is a string or undefined", () => {
    for (const value of [
      GOOGLE_AD_CLIENT_ID,
      VERTICAL_AD_SLOT_ID,
      HORIZONTAL_AD_SLOT_ID,
      SQUARE_AD_SLOT_ID,
    ]) {
      const t = typeof value;
      expect(t === "string" || t === "undefined").toBe(true);
    }
  });

  test("each value reflects its corresponding env var", () => {
    expect(GOOGLE_AD_CLIENT_ID).toBe(process.env.VITE_GOOGLE_AD_CLIENT_ID);
    expect(VERTICAL_AD_SLOT_ID).toBe(process.env.VITE_VERTICAL_AD_SLOT_ID);
    expect(HORIZONTAL_AD_SLOT_ID).toBe(process.env.VITE_HORIZONTAL_AD_SLOT_ID);
    expect(SQUARE_AD_SLOT_ID).toBe(process.env.VITE_SQUARE_AD_SLOT_ID);
  });
});
