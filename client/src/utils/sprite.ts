import { MakeCodeColor, type Sprite, type ExportOptions } from "@/types";

/**
 * MakeCode Arcade color palette hex values
 */
export const MAKECODE_COLORS: Record<MakeCodeColor, string> = {
  [MakeCodeColor.TRANSPARENT]: "transparent",
  [MakeCodeColor.WHITE]: "#ffffff",
  [MakeCodeColor.RED]: "#ff2121",
  [MakeCodeColor.PINK]: "#ff93c4",
  [MakeCodeColor.ORANGE]: "#ff8135",
  [MakeCodeColor.YELLOW]: "#fff609",
  [MakeCodeColor.TEAL]: "#249ca3",
  [MakeCodeColor.GREEN]: "#78dc52",
  [MakeCodeColor.BLUE]: "#003fad",
  [MakeCodeColor.LIGHT_BLUE]: "#87ceeb",
  [MakeCodeColor.PURPLE]: "#8b2635",
  [MakeCodeColor.LIGHT_PURPLE]: "#bc5cd7",
  [MakeCodeColor.DARK_PURPLE]: "#401353",
  [MakeCodeColor.TAN]: "#d2b48c",
  [MakeCodeColor.BROWN]: "#654321",
  [MakeCodeColor.BLACK]: "#000000",
};

/**
 * Convert sprite data to different export formats
 */
export const exportSprite = {
  toJavaScript: (sprite: Sprite, options: Partial<ExportOptions> = {}) => {
    const {
      spriteKind = "Player",
      variableName = "mySprite",
      includeComments = true,
    } = options;

    return `${includeComments ? "// Generated sprite\n" : ""}const ${variableName} = sprites.create(img\`
${sprite.data.map((row) => row.join(" ")).join("\n")}
\`, SpriteKind.${spriteKind})`;
  },

  toPython: (sprite: Sprite, options: Partial<ExportOptions> = {}) => {
    const {
      spriteKind = "Player",
      variableName = "my_sprite",
      includeComments = true,
    } = options;

    return `${includeComments ? "# Generated sprite\n" : ""}import arcade_sprites

${variableName} = arcade_sprites.create_sprite("""
${sprite.data.map((row) => row.join(" ")).join("\n")}
""", sprite_kind="${spriteKind}")`;
  },

  toMakeCode: (sprite: Sprite) => {
    return `img\`
${sprite.data.map((row) => row.join(" ")).join("\n")}
\``;
  },

  toPNG: async (sprite: Sprite, scale: number = 10): Promise<Blob> => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;

    canvas.width = sprite.width * scale;
    canvas.height = sprite.height * scale;

    // Clear canvas
    ctx.fillStyle = "transparent";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw pixels
    sprite.data.forEach((row, y) => {
      row.forEach((color, x) => {
        if (color !== MakeCodeColor.TRANSPARENT) {
          ctx.fillStyle = MAKECODE_COLORS[color as MakeCodeColor];
          ctx.fillRect(x * scale, y * scale, scale, scale);
        }
      });
    });

    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob!), "image/png");
    });
  },
};

/**
 * Create an empty sprite with default dimensions
 */
export const createEmptySprite = (
  width: number = 16,
  height: number = 16
): Omit<Sprite, "id" | "createdAt" | "updatedAt"> => ({
  name: "New Sprite",
  width,
  height,
  data: Array(height)
    .fill(null)
    .map(() => Array(width).fill(MakeCodeColor.TRANSPARENT)),
  colors: [MakeCodeColor.TRANSPARENT],
});

/**
 * Validate sprite dimensions for MakeCode Arcade
 */
export const isValidSpriteSize = (width: number, height: number): boolean => {
  const validSizes = [8, 16, 32, 64, 128];
  return validSizes.includes(width) && validSizes.includes(height);
};

/**
 * Get the closest valid sprite size
 */
export const getClosestValidSize = (
  width: number,
  height: number
): { width: number; height: number } => {
  const validSizes = [8, 16, 32, 64, 128];

  const closestWidth = validSizes.reduce((prev, curr) =>
    Math.abs(curr - width) < Math.abs(prev - width) ? curr : prev
  );

  const closestHeight = validSizes.reduce((prev, curr) =>
    Math.abs(curr - height) < Math.abs(prev - height) ? curr : prev
  );

  return { width: closestWidth, height: closestHeight };
};

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);
    return false;
  }
};

/**
 * Download file as blob
 */
export const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Debounce function for performance optimization
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: number;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => func(...args), delay);
  };
};
