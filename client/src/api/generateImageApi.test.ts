import { test, expect, describe, spyOn, afterEach } from "bun:test";
import { generateOpenAiImage } from "./generateImageApi";
import { GENERATE_OPENAI_IMAGE_API_URL } from "../constants/api";
import { AssetType, Style, OpenAIQuality } from "../types/export";
import type {
  OpenAIGenerationSettings,
  Size,
} from "../types/export";
import type { MakeCodePalette } from "../types/color";

const settings: OpenAIGenerationSettings = {
  prompt: "a friendly dragon",
  assetType: AssetType.Sprite,
  style: Style.Retro,
  quality: OpenAIQuality.Medium,
};

const size: Size = { width: 16, height: 16 };

const palette: MakeCodePalette = {
  "0": "#000000",
  "1": "#ffffff",
};

const okBody = { image_data: "data:image/png;base64,AAA", width: 16, height: 16 };

function jsonResponse(body: unknown, status = 200, statusText = "OK") {
  return new Response(JSON.stringify(body), {
    status,
    statusText,
    headers: { "Content-Type": "application/json" },
  });
}

describe("generateOpenAiImage", () => {
  afterEach(() => {
    // Restore any fetch spy installed in a test.
    if ((globalThis.fetch as { mockRestore?: () => void }).mockRestore) {
      (globalThis.fetch as unknown as { mockRestore: () => void }).mockRestore();
    }
  });

  test("POSTs to the OpenAI image endpoint with JSON body and content-type header", async () => {
    const f = spyOn(globalThis, "fetch").mockResolvedValue(jsonResponse(okBody));

    await generateOpenAiImage(settings, size, palette);

    expect(f).toHaveBeenCalledTimes(1);
    const [url, init] = f.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(GENERATE_OPENAI_IMAGE_API_URL);
    expect(init.method).toBe("POST");
    expect((init.headers as Record<string, string>)["Content-Type"]).toBe(
      "application/json",
    );

    // Body is the serialized OpenAISpriteRequest { settings, size, palette }.
    const parsed = JSON.parse(init.body as string);
    expect(parsed).toEqual({ settings, size, palette });
  });

  test("returns the parsed JSON response on success", async () => {
    spyOn(globalThis, "fetch").mockResolvedValue(jsonResponse(okBody));

    const result = await generateOpenAiImage(settings, size, palette);

    expect(result).toEqual(okBody);
  });

  test("throws with the statusText when the response is not ok", async () => {
    spyOn(globalThis, "fetch").mockResolvedValue(
      jsonResponse({ error: "boom" }, 500, "Internal Server Error"),
    );

    let thrown: unknown;
    try {
      await generateOpenAiImage(settings, size, palette);
    } catch (e) {
      thrown = e;
    }

    expect(thrown).toBeInstanceOf(Error);
    expect((thrown as Error).message).toBe(
      "OpenAI API error: Internal Server Error",
    );
  });

  test("does not parse the body when the response is not ok", async () => {
    // If it threw on !ok, json() should never be read.
    const badResponse = jsonResponse({}, 422, "Unprocessable Entity");
    const jsonSpy = spyOn(badResponse, "json");
    spyOn(globalThis, "fetch").mockResolvedValue(badResponse);

    await expect(
      generateOpenAiImage(settings, size, palette),
    ).rejects.toThrow("OpenAI API error: Unprocessable Entity");

    expect(jsonSpy).not.toHaveBeenCalled();
  });
});
