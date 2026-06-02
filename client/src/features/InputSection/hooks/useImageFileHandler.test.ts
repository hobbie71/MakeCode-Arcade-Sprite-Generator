import { test, expect, describe } from "bun:test";
import { act } from "@testing-library/react";
import { renderHookWithProviders } from "../../../test/test-utils";
import { useImageFileHandler } from "./useImageFileHandler";
import { useError } from "../../../context/ErrorContext/useError";

// We only exercise the branches that are fully deterministic + hermetic under
// happy-dom: the early-return guards. The success pipeline (processImageToSprite
// with a real File) decodes an image and draws to a real <canvas>, neither of
// which happy-dom supports, so it is intentionally left untested here.
const render = () =>
  renderHookWithProviders(() => ({
    handler: useImageFileHandler(),
    error: useError(),
  }));

describe("useImageFileHandler", () => {
  test("returns the expected API surface", () => {
    const { result } = render();
    const h = result.current.handler;
    expect(typeof h.importImageManually).toBe("function");
    expect(typeof h.generateAIImageAndConvertToSprite).toBe("function");
    expect(typeof h.processImageToSprite).toBe("function");
  });

  test("importedImage starts as null", () => {
    const { result } = render();
    expect(result.current.handler.importedImage).toBeNull();
  });

  test("processImageToSprite with no file and no imported image sets a clear error", async () => {
    const { result } = render();
    await act(async () => {
      await result.current.handler.processImageToSprite();
    });
    expect(result.current.error.error).toBe(
      "No Image File Available for Sprite Generation"
    );
  });

  test("processImageToSprite clears a pre-existing error before re-checking", async () => {
    const { result } = render();
    // Seed an unrelated error, then call the guard path again.
    act(() => result.current.error.setError("stale error"));
    expect(result.current.error.error).toBe("stale error");

    await act(async () => {
      await result.current.handler.processImageToSprite();
    });
    // setError(null) ran first, then the no-image guard set the new message.
    expect(result.current.error.error).toBe(
      "No Image File Available for Sprite Generation"
    );
  });

  test("generateAIImageAndConvertToSprite blocks on an empty prompt without hitting the network", async () => {
    // Default OpenAI settings have an empty prompt, so validatePrompt short-
    // circuits with "No Prompt Detected" before any fetch/moderation call.
    const { result } = render();
    await act(async () => {
      await result.current.handler.generateAIImageAndConvertToSprite();
    });
    expect(result.current.error.error).toBe(
      "No Prompt Detected. Added a Prompt"
    );
  });

  test("the returned functions are stable across re-renders", () => {
    const { result, rerender } = render();
    const first = result.current.handler;
    rerender();
    const second = result.current.handler;
    expect(second.importImageManually).toBe(first.importImageManually);
    expect(second.generateAIImageAndConvertToSprite).toBe(
      first.generateAIImageAndConvertToSprite
    );
    expect(second.processImageToSprite).toBe(first.processImageToSprite);
  });
});
