import type { ModerationResponse } from "@makespritecode/shared";

export interface ModerationResultInput {
  flagged: boolean;
  categories: Record<string, boolean>;
  category_scores: Record<string, number>;
}

// Ported from app/routers/moderation.py: the only custom rule is to UN-flag a
// result when the sole concern is violence with a score below 0.5.
export function applyModerationOverride(result: ModerationResultInput): ModerationResponse {
  const violenceScore = result.category_scores.violence ?? 0;
  let customFlagged = result.flagged;
  if (result.categories.violence && violenceScore < 0.5) {
    customFlagged = false;
  }
  return {
    is_appropriate: !customFlagged,
    flagged: customFlagged,
    categories: result.categories,
    category_scores: result.category_scores,
  };
}
