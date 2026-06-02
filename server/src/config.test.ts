import { test, expect, describe } from "bun:test";
import { parseCorsOrigins, config } from "./config";

describe("parseCorsOrigins", () => {
  test("undefined -> []", () => {
    expect(parseCorsOrigins(undefined)).toEqual([]);
  });

  test("empty string -> []", () => {
    expect(parseCorsOrigins("")).toEqual([]);
  });

  test("double-quoted JSON array literal -> parsed", () => {
    expect(parseCorsOrigins('["https://a.com", "https://b.com"]')).toEqual([
      "https://a.com",
      "https://b.com",
    ]);
  });

  test("single-quoted JSON array literal -> parsed (quotes normalized)", () => {
    expect(parseCorsOrigins("['https://a.com', 'https://b.com']")).toEqual([
      "https://a.com",
      "https://b.com",
    ]);
  });

  test("empty JSON array literal -> []", () => {
    expect(parseCorsOrigins("[]")).toEqual([]);
  });

  test("single-element JSON array literal -> one origin", () => {
    expect(parseCorsOrigins('["https://only.com"]')).toEqual(["https://only.com"]);
  });

  test("comma-separated list -> split", () => {
    expect(parseCorsOrigins("https://a.com,https://b.com")).toEqual([
      "https://a.com",
      "https://b.com",
    ]);
  });

  test("comma-separated list with surrounding whitespace -> trimmed", () => {
    expect(parseCorsOrigins("  https://a.com , https://b.com  ")).toEqual([
      "https://a.com",
      "https://b.com",
    ]);
  });

  test("single origin (no comma, not bracketed) -> single-element array", () => {
    expect(parseCorsOrigins("https://only.com")).toEqual(["https://only.com"]);
  });

  test("malformed JSON array literal -> [] (parse failure swallowed)", () => {
    // Starts with "[" and ends with "]" so it takes the JSON.parse branch, but
    // the contents are not valid JSON -> caught -> [].
    expect(parseCorsOrigins("[not valid json]")).toEqual([]);
  });

  test("bracketed but trailing-comma JSON -> [] on parse failure", () => {
    expect(parseCorsOrigins('["a",]')).toEqual([]);
  });
});

describe("config object", () => {
  test("exposes the expected keys with sane typed defaults", () => {
    expect(typeof config.OPENAI_API_KEY).toBe("string");
    expect(Array.isArray(config.CORS_ORIGINS)).toBe(true);
    expect(typeof config.DEBUG).toBe("boolean");
    expect(typeof config.ENVIRONMENT).toBe("string");
    expect(typeof config.HOST).toBe("string");
    expect(typeof config.PORT).toBe("number");
  });

  test("PORT is a finite positive number (defaults to 8000 when unset/0)", () => {
    expect(Number.isFinite(config.PORT)).toBe(true);
    expect(config.PORT).toBeGreaterThan(0);
  });

  test("ENVIRONMENT and HOST are non-empty strings", () => {
    expect(config.ENVIRONMENT.length).toBeGreaterThan(0);
    expect(config.HOST.length).toBeGreaterThan(0);
  });
});
