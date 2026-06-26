/**
 * Shared colour value types (RGB / RGBA), used by the canvas pixel helpers and
 * the OKLab colour matcher.
 */

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface RGBA extends RGB {
  a: number;
}
