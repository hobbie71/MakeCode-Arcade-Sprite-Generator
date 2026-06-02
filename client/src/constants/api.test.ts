import { test, expect, describe } from "bun:test";
import {
  GENERATE_OPENAI_IMAGE_API_URL,
  IS_APPROPRIATE_API_URL,
} from "./api";

// constants/api.ts builds full endpoint URLs from a base
// (process.env.VITE_API_URL || "http://localhost:62274"). We assert the path
// suffixes are correct without pinning the base, so the test is hermetic
// regardless of whether VITE_API_URL is set.
describe("api URL constants", () => {
  test("both URLs are non-empty strings", () => {
    expect(typeof GENERATE_OPENAI_IMAGE_API_URL).toBe("string");
    expect(typeof IS_APPROPRIATE_API_URL).toBe("string");
    expect(GENERATE_OPENAI_IMAGE_API_URL.length).toBeGreaterThan(0);
    expect(IS_APPROPRIATE_API_URL.length).toBeGreaterThan(0);
  });

  test("generate image URL ends with the OpenAI generation path", () => {
    expect(GENERATE_OPENAI_IMAGE_API_URL.endsWith("/generate-image/openai")).toBe(
      true
    );
  });

  test("moderation URL ends with the moderate path", () => {
    expect(IS_APPROPRIATE_API_URL.endsWith("/moderation/moderate")).toBe(true);
  });

  test("URLs share a common base origin", () => {
    const expectedBase =
      process.env.VITE_API_URL || "http://localhost:62274";
    expect(GENERATE_OPENAI_IMAGE_API_URL).toBe(
      `${expectedBase}/generate-image/openai`
    );
    expect(IS_APPROPRIATE_API_URL).toBe(`${expectedBase}/moderation/moderate`);
  });

  test("both URLs are absolute (contain a protocol)", () => {
    expect(GENERATE_OPENAI_IMAGE_API_URL.includes("://")).toBe(true);
    expect(IS_APPROPRIATE_API_URL.includes("://")).toBe(true);
  });
});
