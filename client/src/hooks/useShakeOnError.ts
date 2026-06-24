import { useEffect, useState } from "react";

/**
 * Returns a `shaking` flag that flips true for ~0.45s each time `errorNonce`
 * increments — a one-shot "nudge" for a required field that failed validation.
 * Pair the flag with the `animate-shake` class. `errorNonce === 0` means no
 * failed attempt yet (no shake).
 */
export function useShakeOnError(errorNonce: number): boolean {
  const [shaking, setShaking] = useState(false);

  useEffect(() => {
    if (errorNonce === 0) return;
    setShaking(true);
    const t = setTimeout(() => setShaking(false), 500);
    return () => clearTimeout(t);
  }, [errorNonce]);

  return shaking;
}
