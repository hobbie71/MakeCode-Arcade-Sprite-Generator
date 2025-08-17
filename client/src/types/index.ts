// Sprite-related types
export interface Sprite {
  id: string;
  name: string;
  width: number;
  height: number;
  data: string[][];
  colors: MakeCodeColor[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SpriteFrame {
  id: string;
  spriteId: string;
  frameIndex: number;
  data: string[][];
  duration?: number; // for animation (milliseconds)
}

// MakeCode Arcade color palette
export enum MakeCodeColor {
  TRANSPARENT = ".",
  WHITE = "1",
  RED = "2",
  PINK = "3",
  ORANGE = "4",
  YELLOW = "5",
  TEAL = "6",
  GREEN = "7",
  BLUE = "8",
  LIGHT_BLUE = "9",
  PURPLE = "a",
  LIGHT_PURPLE = "b",
  DARK_PURPLE = "c",
  TAN = "d",
  BROWN = "e",
  BLACK = "f",
}

// Export formats
export type ExportFormat = "javascript" | "python" | "makecode" | "png";

export interface ExportOptions {
  format: ExportFormat;
  spriteKind?: string;
  variableName?: string;
  includeComments?: boolean;
}

// AI Generation
export interface AIPrompt {
  text: string;
  style?: "pixel-art" | "8-bit" | "retro" | "minecraft";
  size?: "16x16" | "32x32" | "64x64";
  colors?: "makecode" | "full-color";
}

export interface AIGenerationResult {
  id: string;
  prompt: AIPrompt;
  sprites: Sprite[];
  confidence: number;
  processingTime: number;
}

// Image conversion
export interface ImageConversionOptions {
  targetWidth: number;
  targetHeight: number;
  algorithm: "nearest-neighbor" | "bilinear" | "bicubic";
  dithering: boolean;
  colorReduction: "makecode-palette" | "auto";
  edgeDetection: boolean;
}

// API Response types
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Editor state
export interface EditorState {
  currentSprite: Sprite | null;
  selectedTool: DrawingTool;
  selectedColor: MakeCodeColor;
  zoom: number;
  showGrid: boolean;
  history: EditorAction[];
  historyIndex: number;
}

export type DrawingTool =
  | "pencil"
  | "eraser"
  | "fill"
  | "line"
  | "rectangle"
  | "circle"
  | "select";

export interface EditorAction {
  type: "draw" | "erase" | "fill" | "clear";
  coordinates?: { x: number; y: number }[];
  color?: MakeCodeColor;
  previousState: string[][];
  newState: string[][];
}
