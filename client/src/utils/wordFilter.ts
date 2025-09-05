import { Filter } from "bad-words";

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
