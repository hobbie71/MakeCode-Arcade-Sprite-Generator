import { MakeCodeColor } from "@/types/color";

/**
 * Valid MakeCode color characters
 */
const VALID_MAKECODE_COLORS = new Set(Object.values(MakeCodeColor));

/**
 * Checks if a string is valid MakeCode sprite data
 * @param text - The string to validate
 * @returns true if the string is valid MakeCode sprite data
 */
export const isValidMakeCodeSprite = (text: string): boolean => {
  if (!text || typeof text !== "string") {
    return false;
  }

  const trimmedText = text.trim().replace(/ /g, "");

  // Check if it starts with img` and ends with `
  if (!trimmedText.startsWith("img`") || !trimmedText.endsWith("`")) {
    return false;
  }

  const content = trimmedText.slice(4, -1); // Remove 'img`' and '`'

  const lines = content.split("\n").filter((line) => line.trim().length > 0);

  if (lines.length === 0) {
    return false;
  }

  // Check that all lines have the same length (rectangular sprite)
  const expectedWidth = lines[0].trim().length;
  if (expectedWidth === 0) {
    return false;
  }

  for (const line of lines) {
    const trimmedLine = line.trim();

    // Check line length consistency
    if (trimmedLine.length !== expectedWidth) {
      return false;
    }

    // Check that all characters are valid MakeCode colors
    for (const char of trimmedLine) {
      if (!VALID_MAKECODE_COLORS.has(char as MakeCodeColor)) {
        return false;
      }
    }
  }

  // Validate dimensions (MakeCode typically supports common sprite sizes)
  const width = expectedWidth;
  const height = lines.length;

  // Check for reasonable sprite dimensions (1x1 to 128x128)
  if (width < 1 || height < 1 || width > 128 || height > 128) {
    return false;
  }

  return true;
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

  const trimmedText = spriteText.trim().replace(/ /g, "");

  // Extract the content between img` and `
  const content = trimmedText.slice(4, -1); // Remove 'img`' and '`'

  // Split into lines and filter out empty lines
  const lines = content
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  // Convert each line into an array of MakeCodeColor
  return lines.map((line) =>
    line.split("").map((char) => char as MakeCodeColor)
  );
};

/**
 * Converts a 2D array of MakeCodeColor into a MakeCode sprite string
 * @param spriteData - 2D array of MakeCodeColor
 * @returns MakeCode sprite string (e.g., "img`1234\n5678`")
 */
export const stringifyMakeCodeSprite = (
  spriteData: MakeCodeColor[][]
): string => {
  if (!spriteData || !Array.isArray(spriteData) || spriteData.length === 0) {
    throw new Error("Invalid sprite data: must be a non-empty 2D array");
  }

  // Validate that all rows have the same length
  const expectedWidth = spriteData[0]?.length ?? 0;
  if (expectedWidth === 0) {
    throw new Error("Invalid sprite data: rows cannot be empty");
  }

  for (let i = 0; i < spriteData.length; i++) {
    const row = spriteData[i];
    if (!Array.isArray(row) || row.length !== expectedWidth) {
      throw new Error(`Invalid sprite data: row ${i} has inconsistent length`);
    }

    // Validate that all values are valid MakeCode colors
    for (let j = 0; j < row.length; j++) {
      const color = row[j];
      if (!VALID_MAKECODE_COLORS.has(color)) {
        throw new Error(`Invalid color "${color}" at position [${i}, ${j}]`);
      }
    }
  }

  // Convert sprite data to string format
  const lines = spriteData.map((row) => row.join(""));
  return `img\`\n${lines.join("\n")}\n\``;
};

/**
 * Validates that sprite data is a proper 2D array of MakeCodeColor
 * @param spriteData - The data to validate
 * @returns true if valid
 */
export const isValidSpriteData = (
  spriteData: unknown
): spriteData is MakeCodeColor[][] => {
  if (!Array.isArray(spriteData) || spriteData.length === 0) {
    return false;
  }

  const expectedWidth = spriteData[0]?.length ?? 0;
  if (expectedWidth === 0) {
    return false;
  }

  for (const row of spriteData) {
    if (!Array.isArray(row) || row.length !== expectedWidth) {
      return false;
    }

    for (const color of row) {
      if (!VALID_MAKECODE_COLORS.has(color as MakeCodeColor)) {
        return false;
      }
    }
  }

  return true;
};

/**
 * Gets the dimensions of sprite data
 * @param spriteData - 2D array of MakeCodeColor
 * @returns Object with width and height properties
 */
export const getSpriteDimensions = (
  spriteData: MakeCodeColor[][]
): { width: number; height: number } => {
  if (!isValidSpriteData(spriteData)) {
    throw new Error("Invalid sprite data");
  }

  return {
    width: spriteData[0].length,
    height: spriteData.length,
  };
};
