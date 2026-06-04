import { useCallback, useState } from "react";

const KEY = "msc_has_visited";

/**
 * Tracks whether the user has been here before, so returning users can skip the
 * marketing hero and land straight in the studio (ADR-0006 "expert-skip").
 *
 * Backed by localStorage (wrapped in try/catch for private-mode / blocked
 * storage). Clearing site data restores the hero.
 */
export function useHasVisited() {
  const [visited, setVisited] = useState<boolean>(() => {
    try {
      return localStorage.getItem(KEY) === "1";
    } catch {
      return false;
    }
  });

  const markVisited = useCallback(() => {
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      // ignore (storage unavailable) — worst case the hero shows again
    }
    setVisited(true);
  }, []);

  return { visited, markVisited };
}
