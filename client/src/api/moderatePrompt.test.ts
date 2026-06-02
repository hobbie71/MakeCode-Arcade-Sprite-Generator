import { test, expect, describe, spyOn, afterEach } from "bun:test";
import { moderatePrompt } from "./moderatePrompt";
import { IS_APPROPRIATE_API_URL } from "../constants/api";
import type { ModerationResponse } from "../types/export";

const okBody: ModerationResponse = {
  is_appropriate: true,
  flagged: false,
  categories: { violence: false },
  category_scores: { violence: 0.01 },
};

function jsonResponse(body: unknown, status = 200, statusText = "OK") {
  return new Response(JSON.stringify(body), {
    status,
    statusText,
    headers: { "Content-Type": "application/json" },
  });
}

describe("moderatePrompt", () => {
  afterEach(() => {
    if ((globalThis.fetch as { mockRestore?: () => void }).mockRestore) {
      (globalThis.fetch as unknown as { mockRestore: () => void }).mockRestore();
    }
  });

  test("POSTs to the moderation endpoint with the prompt as a JSON body", async () => {
    const f = spyOn(globalThis, "fetch").mockResolvedValue(jsonResponse(okBody));

    await moderatePrompt("a cute cat");

    expect(f).toHaveBeenCalledTimes(1);
    const [url, init] = f.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(IS_APPROPRIATE_API_URL);
    expect(init.method).toBe("POST");
    expect((init.headers as Record<string, string>)["Content-Type"]).toBe(
      "application/json",
    );
    expect(JSON.parse(init.body as string)).toEqual({ prompt: "a cute cat" });
  });

  test("returns the parsed moderation response on success", async () => {
    spyOn(globalThis, "fetch").mockResolvedValue(jsonResponse(okBody));

    const result = await moderatePrompt("hello");

    expect(result).toEqual(okBody);
    expect(result.is_appropriate).toBe(true);
    expect(result.flagged).toBe(false);
  });

  test("throws with the statusText when the response is not ok", async () => {
    spyOn(globalThis, "fetch").mockResolvedValue(
      jsonResponse({ error: "nope" }, 400, "Bad Request"),
    );

    let thrown: unknown;
    try {
      await moderatePrompt("bad");
    } catch (e) {
      thrown = e;
    }

    expect(thrown).toBeInstanceOf(Error);
    expect((thrown as Error).message).toBe("Text Moderation API Error: Bad Request");
  });

  test("does not parse the body when the response is not ok", async () => {
    const badResponse = jsonResponse({}, 503, "Service Unavailable");
    const jsonSpy = spyOn(badResponse, "json");
    spyOn(globalThis, "fetch").mockResolvedValue(badResponse);

    await expect(moderatePrompt("x")).rejects.toThrow(
      "Text Moderation API Error: Service Unavailable",
    );

    expect(jsonSpy).not.toHaveBeenCalled();
  });
});
