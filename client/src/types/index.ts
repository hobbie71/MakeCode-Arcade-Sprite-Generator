import { MakeCodeColor } from "./color";
import { EditorTools } from "./tools";

// Re-export types from other modules
export { MakeCodeColor } from "./color";
export { EditorTools } from "./tools";

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
  style: "pixel-art" | "8-bit" | "retro" | "minecraft";
  width: number;
  height: number;
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
  selectedTool: EditorTools;
  selectedColor: MakeCodeColor;
  zoom: number;
  showGrid: boolean;
  history: EditorAction[];
  historyIndex: number;
}

export interface EditorAction {
  type: "draw" | "erase" | "fill" | "clear";
  coordinates?: { x: number; y: number }[];
  color?: MakeCodeColor;
  previousState: string[][];
  newState: string[][];
}
