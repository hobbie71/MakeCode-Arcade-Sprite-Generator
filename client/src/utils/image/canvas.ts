/**
 * Small shared canvas helper. Several image utilities need "a fresh
 * (width × height) canvas plus its willReadFrequently+alpha 2d context, throwing
 * if the context is unavailable" — this is that one line, so the boilerplate
 * isn't copy-pasted at every call site.
 */
export interface Canvas2D {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
}

export const createCanvas2D = (width: number, height: number): Canvas2D => {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true, alpha: true });
  if (!ctx) throw new Error("createCanvas2D: 2d context unavailable");
  return { canvas, ctx };
};
