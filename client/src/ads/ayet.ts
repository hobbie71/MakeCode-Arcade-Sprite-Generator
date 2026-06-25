import { AYET_PLACEMENT_ID, AYET_ADSLOT } from "../constants/ads";

export type AdResult = "completed" | "closed" | "no_fill" | "error";

type AyetCallbacks = {
  onComplete?: () => void;
  onReward?: () => void;
  onClose?: () => void;
  onNoFill?: () => void;
  onError?: () => void;
};
type AyetSdk = {
  init: (
    placementId: string,
    externalId?: string,
    opts?: { nonPersonalized?: boolean },
  ) => void;
  requestAd: (adslot: string) => void;
  playFullscreenAd: (cb: AyetCallbacks) => void;
};
function getSdk(): AyetSdk | undefined {
  return (window as unknown as { AyetVideoSdk?: AyetSdk }).AyetVideoSdk;
}

let initialized = false;

/** Idempotent; safe to call before the async SDK script has loaded (no-ops). */
export function initAyet(): void {
  if (initialized) return;
  const sdk = getSdk();
  if (!sdk) return; // try again on first showRewardedAd
  // NON-PERSONALIZED for everyone — blanket COPPA-safety posture.
  sdk.init(AYET_PLACEMENT_ID, undefined, { nonPersonalized: true });
  initialized = true;
}

/** Shows one fullscreen ad. Resolves on any terminal outcome; NEVER rejects. */
export function showRewardedAd(
  adslot: string = AYET_ADSLOT,
): Promise<AdResult> {
  return new Promise<AdResult>((resolve) => {
    initAyet();
    const sdk = getSdk();
    if (!sdk) {
      resolve("no_fill");
      return;
    }
    let settled = false;
    const done = (r: AdResult) => {
      if (!settled) {
        settled = true;
        resolve(r);
      }
    };
    try {
      sdk.requestAd(adslot);
      sdk.playFullscreenAd({
        onReward: () => done("completed"),
        onComplete: () => done("completed"),
        onClose: () => done("closed"),
        onNoFill: () => done("no_fill"),
        onError: () => done("error"),
      });
    } catch {
      done("error");
    }
  });
}
