import { test, expect, describe, afterEach } from "bun:test";
import { showRewardedAd } from "./ayet";

type Cb = {
  onComplete?: () => void;
  onReward?: () => void;
  onClose?: () => void;
  onNoFill?: () => void;
  onError?: () => void;
};
function fakeSdk(play: (cb: Cb) => void) {
  (window as unknown as { AyetVideoSdk?: unknown }).AyetVideoSdk = {
    init: () => {},
    requestAd: () => {},
    playFullscreenAd: play,
  };
}

describe("showRewardedAd", () => {
  afterEach(() => {
    delete (window as unknown as { AyetVideoSdk?: unknown }).AyetVideoSdk;
  });

  test("resolves 'completed' on the complete callback", async () => {
    fakeSdk((cb) => cb.onComplete?.());
    expect(await showRewardedAd("slot")).toBe("completed");
  });

  test("resolves 'completed' on the reward callback", async () => {
    fakeSdk((cb) => cb.onReward?.());
    expect(await showRewardedAd("slot")).toBe("completed");
  });

  test("resolves 'closed' when the user closes the ad", async () => {
    fakeSdk((cb) => cb.onClose?.());
    expect(await showRewardedAd("slot")).toBe("closed");
  });

  test("resolves 'no_fill' when the SDK is absent (never blocks the user)", async () => {
    expect(await showRewardedAd("slot")).toBe("no_fill");
  });

  test("resolves 'error' if playFullscreenAd throws", async () => {
    fakeSdk(() => {
      throw new Error("boom");
    });
    expect(await showRewardedAd("slot")).toBe("error");
  });
});
