import type { ModerationResponse } from "../../../api/moderatePrompt";
import { Filter } from "bad-words";
import { moderatePrompt } from "../../../api/moderatePrompt";

export const isTextInappropriate = (text: string) => {
  if (!text) return false;

  const filter = new Filter();
  return filter.isProfane(text);
};

export const filterBadWords = (text: string): string => {
  if (!text) return text;

  const filter = new Filter();
  return filter.clean(text);
};

export const getModerationError = (moderation: ModerationResponse): string => {
  const categories = moderation.categories;

  const flaggedCategories = Object.entries(categories)
    .filter(([, flagged]) => flagged)
    .map(([category]) => category);

  if (flaggedCategories.length === 0) {
    return "";
  }

  return `Prompt flagged for: ${flaggedCategories.join(", ")}`;
};

export const validatePrompt = async (
  prompt: string,
  setError: (msg: string) => void,
  setGenerationMessage: (msg: string) => void
): Promise<boolean> => {
  if (!prompt) {
    setError("No Prompt Detected. Added a Prompt");
    return false;
  }

  if (isTextInappropriate(prompt)) {
    setError(`Prompt contains inappropriate text: ${filterBadWords(prompt)}`);
    return false;
  }

  setGenerationMessage("Analyzing Prompt");
  const moderation = await moderatePrompt(prompt);
  if (!moderation.is_appropriate) {
    setError(getModerationError(moderation));
    return false;
  }
  return true;
};
