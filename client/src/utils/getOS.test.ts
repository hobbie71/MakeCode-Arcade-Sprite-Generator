import { test, expect, describe } from "bun:test";
import { OS } from "./getOS";

// getOS itself is module-private; only the computed OS const is exported. It is
// evaluated once at import time from navigator.platform, so we assert it landed
// on one of the three supported buckets rather than re-deriving it.
describe("OS", () => {
  test("is one of the supported platform buckets", () => {
    expect(["mac", "windows", "other"]).toContain(OS);
  });

  test("is a non-empty string", () => {
    expect(typeof OS).toBe("string");
    expect(OS.length > 0).toBe(true);
  });
});
