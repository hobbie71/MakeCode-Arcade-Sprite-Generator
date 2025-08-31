import { array as BAD_WORDS } from "badwords-list";

export const hasBadWord = (text: string, badWords: string[] = BAD_WORDS) => {
  if (!text) return false;
  const lowerText = text.toLowerCase();
  return badWords.some((word) => lowerText.includes(word.toLowerCase()));
};
