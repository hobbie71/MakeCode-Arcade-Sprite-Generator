/**
 * Runs `work` and `showAd` concurrently, then resolves only once BOTH settle —
 * the soft "finish the ad to reveal your sprite" gate. The ad can never block
 * delivery: if it rejects, we swallow it and still return the work result.
 */
export async function runWithAdGate<T>(
  work: Promise<T>,
  showAd: () => Promise<unknown>,
): Promise<T> {
  const ad = showAd().catch(() => undefined); // ad failure must not reject
  const result = await work;
  await ad;
  return result;
}
