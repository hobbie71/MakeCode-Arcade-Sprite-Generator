export type Coordinates = {
  x: number;
  y: number;
};

export type SelectionArea = {
  start: Coordinates;
  end: Coordinates;
};

export const MAX_LENGTH = 512;
export const MIN_LENGTH = 1;

export const STROKE_SIZES = [1, 3, 5];

export const BACKGROUND_SIZE = { x: 160, y: 120 };
export const TILE_SIZE = { x: 16, y: 16 };
