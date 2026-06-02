import {
  test,
  expect,
  describe,
  mock,
  beforeEach,
  afterEach,
} from "bun:test";
import type { ModerationResponse } from "../../../types/export";

// Mock the moderation API module so validatePrompt never hits the network.
// The mock is reconfigured per-test via `moderateImpl`.
let moderateImpl: (prompt: string) => Promise<ModerationResponse>;
const moderateMock = mock((prompt: string) => moderateImpl(prompt));

mock.module("../../../api/moderatePrompt", () => ({
  moderatePrompt: moderateMock,
}));

// Imported AFTER mock.module so the stub is wired in.
import {
  isTextInappropriate,
  filterBadWords,
  getModerationError,
  validatePrompt,
} from "./promptModeration";

const appropriate: ModerationResponse = {
  is_appropriate: true,
  flagged: false,
  categories: {},
  category_scores: {},
} as unknown as ModerationResponse;

const inappropriate: ModerationResponse = {
  is_appropriate: false,
  flagged: true,
  categories: { violence: true, hate: false, harassment: true },
  category_scores: {},
} as unknown as ModerationResponse;

beforeEach(() => {
  moderateMock.mockClear();
  moderateImpl = () => Promise.resolve(appropriate);
});

afterEach(() => {
  moderateMock.mockClear();
});

describe("isTextInappropriate", () => {
  test("returns false for empty string", () => {
    expect(isTextInappropriate("")).toBe(false);
  });

  test("returns false for clean text", () => {
    expect(isTextInappropriate("a happy purple dragon")).toBe(false);
  });

  test("returns true for profane text", () => {
    expect(isTextInappropriate("you ass")).toBe(true);
  });
});

describe("filterBadWords", () => {
  test("returns the input unchanged for empty string", () => {
    expect(filterBadWords("")).toBe("");
  });

  test("leaves clean text untouched", () => {
    expect(filterBadWords("blue knight sprite")).toBe("blue knight sprite");
  });

  test("masks profane words with asterisks", () => {
    const cleaned = filterBadWords("you ass");
    expect(cleaned).not.toContain("ass");
    expect(cleaned).toContain("*");
  });
});

describe("getModerationError", () => {
  test("returns empty string when no categories are flagged", () => {
    const result = getModerationError(appropriate);
    expect(result).toBe("");
  });

  test("lists only the flagged categories", () => {
    const result = getModerationError(inappropriate);
    expect(result).toContain("Prompt flagged for:");
    expect(result).toContain("violence");
    expect(result).toContain("harassment");
    expect(result).not.toContain("hate");
  });
});

describe("validatePrompt", () => {
  test("rejects an empty prompt and sets a no-prompt error", async () => {
    let msg = "";
    const ok = await validatePrompt("", (m) => (msg = m));
    expect(ok).toBe(false);
    expect(msg).toContain("No Prompt Detected");
    // API never reached for an empty prompt.
    expect(moderateMock).not.toHaveBeenCalled();
  });

  test("rejects a profane prompt before calling the API", async () => {
    let msg = "";
    const ok = await validatePrompt("you ass", (m) => (msg = m));
    expect(ok).toBe(false);
    expect(msg).toContain("inappropriate text");
    // Profanity prefilter short-circuits — moderation API is not consulted.
    expect(moderateMock).not.toHaveBeenCalled();
  });

  test("rejects a clean prompt the API deems inappropriate", async () => {
    moderateImpl = () => Promise.resolve(inappropriate);
    let msg = "";
    const ok = await validatePrompt("a knight", (m) => (msg = m));
    expect(ok).toBe(false);
    expect(moderateMock).toHaveBeenCalledTimes(1);
    expect(msg).toContain("violence");
  });

  test("accepts a clean prompt the API approves", async () => {
    moderateImpl = () => Promise.resolve(appropriate);
    let msg = "";
    const ok = await validatePrompt("a knight", (m) => (msg = m));
    expect(ok).toBe(true);
    expect(moderateMock).toHaveBeenCalledTimes(1);
    // No error message set on the happy path.
    expect(msg).toBe("");
  });

  test("passes the raw prompt through to the moderation API", async () => {
    moderateImpl = () => Promise.resolve(appropriate);
    await validatePrompt("a green slime", () => {});
    expect(moderateMock).toHaveBeenCalledTimes(1);
    expect(moderateMock.mock.calls[0][0]).toBe("a green slime");
  });
});
