import { test, expect, describe } from "bun:test";
import { applyModerationOverride } from "./moderation-logic";
import benign from "../../fixtures/responses/moderation-benign.json";
import violent from "../../fixtures/responses/moderation-violent.json";

describe("applyModerationOverride (parity with the Python router)", () => {
  test("benign fixture stays appropriate", () => {
    const out = applyModerationOverride({
      flagged: benign.flagged,
      categories: benign.categories,
      category_scores: benign.category_scores,
    });
    expect(out.is_appropriate).toBe(benign.is_appropriate); // true
    expect(out.flagged).toBe(benign.flagged); // false
  });

  test("violent fixture (violence score 0.83 >= 0.5) stays flagged", () => {
    const out = applyModerationOverride({
      flagged: violent.flagged,
      categories: violent.categories,
      category_scores: violent.category_scores,
    });
    expect(out.is_appropriate).toBe(violent.is_appropriate); // false
    expect(out.flagged).toBe(violent.flagged); // true
  });

  test("violence true but score < 0.5 is overridden to not-flagged", () => {
    const out = applyModerationOverride({
      flagged: true,
      categories: { violence: true },
      category_scores: { violence: 0.3 },
    });
    expect(out.flagged).toBe(false);
    expect(out.is_appropriate).toBe(true);
  });

  test("a non-violence flag is never overridden", () => {
    const out = applyModerationOverride({
      flagged: true,
      categories: { sexual: true, violence: false },
      category_scores: { violence: 0 },
    });
    expect(out.flagged).toBe(true);
    expect(out.is_appropriate).toBe(false);
  });
});
