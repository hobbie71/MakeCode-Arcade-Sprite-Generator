import { MakeCodeColor } from "../types/color";
import { MAX_LENGTH } from "../types/pixel";

/**
 * Valid MakeCode color characters
 */
const VALID_MAKECODE_COLORS = new Set(Object.values(MakeCodeColor));

// MakeCode sprites range from 1×1 up to 512×512; the full-screen Arcade
// background is 160×120. Mirror the editor's real bound (MAX_LENGTH) so
// backgrounds validate — both when pasted into the studio and when rendered in
// the home-page gallery. A hard-coded 128 here silently rejected 160-wide art.
const MAX_SPRITE_DIMENSION = MAX_LENGTH;

/**
 * Extracts the trimmed, non-empty pixel rows from a MakeCode sprite string,
 * or returns null if the text is not wrapped in img`...`
 */
const extractSpriteRows = (text: string): string[] | null => {
  const normalized = text.trim().replace(/ /g, "");

  if (!normalized.startsWith("img`") || !normalized.endsWith("`")) {
    return null;
  }

  const content = normalized.slice(4, -1); // Remove 'img`' and '`'

  return content
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
};

const isValidSpriteRow = (row: string, expectedWidth: number): boolean => {
  if (row.length !== expectedWidth) {
    return false;
  }

  for (const char of row) {
    if (!VALID_MAKECODE_COLORS.has(char as MakeCodeColor)) {
      return false;
    }
  }

  return true;
};

/**
 * Checks if a string is valid MakeCode sprite data
 * @param text - The string to validate
 * @returns true if the string is valid MakeCode sprite data
 */
export const isValidMakeCodeSprite = (text: string): boolean => {
  if (!text || typeof text !== "string") {
    return false;
  }

  const rows = extractSpriteRows(text);
  if (!rows || rows.length === 0 || rows.length > MAX_SPRITE_DIMENSION) {
    return false;
  }

  // All rows must match the first row's width (rectangular sprite)
  const expectedWidth = rows[0].length;
  if (expectedWidth > MAX_SPRITE_DIMENSION) {
    return false;
  }

  return rows.every((row) => isValidSpriteRow(row, expectedWidth));
};

/**
 * Parses a MakeCode sprite string into a 2D array of MakeCodeColor
 * @param spriteText - The MakeCode sprite string (e.g., "img`1234\n5678`")
 * @returns 2D array of MakeCodeColor
 * @throws Error if the sprite text is invalid
 */
export const parseMakeCodeSprite = (spriteText: string): MakeCodeColor[][] => {
  if (!isValidMakeCodeSprite(spriteText)) {
    throw new Error("Invalid MakeCode sprite format");
  }

  const rows = extractSpriteRows(spriteText);
  if (!rows) {
    throw new Error("Invalid MakeCode sprite format");
  }

  return rows.map((row) =>
    row.split("").map((char) => char as MakeCodeColor)
  );
};
