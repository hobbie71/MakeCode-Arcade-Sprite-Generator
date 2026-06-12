import type { SelectionMask } from "./selectionMask";

/**
 * Boundary of a selection mask as a Path2D in sprite-pixel units (1 unit = 1
 * sprite pixel, origin at the sprite's top-left). The caller scales/translates
 * at draw time, so the marching ants snap to pixel edges at any zoom.
 *
 * Directed unit edges are emitted clockwise around selected cells (holes come
 * out counter-clockwise automatically), then chained start→end into closed
 * loops. At a checkerboard corner a vertex has two outgoing edges; either
 * continuation closes correctly for stroking, so we just pop one.
 */
export const buildMaskOutline = (mask: SelectionMask): Path2D => {
  const edges = collectBoundaryEdges(mask);

  const takeEdge = (key: string): [number, number] | null => {
    const list = edges.get(key);
    if (!list || list.length === 0) return null;
    const next = list.pop()!;
    if (list.length === 0) edges.delete(key);
    return next;
  };

  const path = new Path2D();
  for (;;) {
    const first = edges.keys().next();
    if (first.done) break;
    const startKey = first.value;
    const [sx, sy] = startKey.split(",").map(Number);
    let next = takeEdge(startKey);
    path.moveTo(sx, sy);
    while (next && (next[0] !== sx || next[1] !== sy)) {
      path.lineTo(next[0], next[1]);
      next = takeEdge(`${next[0]},${next[1]}`);
    }
    path.closePath();
  }
  return path;
};

/**
 * Directed boundary edges of the mask, keyed by start vertex "x,y" (grid
 * corners, so 0..width / 0..height). A cell side is a boundary edge when the
 * neighbor across it is unselected.
 */
const collectBoundaryEdges = (
  mask: SelectionMask
): Map<string, Array<[number, number]>> => {
  const { width, height, bits } = mask;
  const get = (x: number, y: number): number =>
    x >= 0 && y >= 0 && x < width && y < height ? bits[y * width + x] : 0;

  const edges = new Map<string, Array<[number, number]>>();
  const addEdge = (x0: number, y0: number, x1: number, y1: number) => {
    const key = `${x0},${y0}`;
    const list = edges.get(key);
    if (list) list.push([x1, y1]);
    else edges.set(key, [[x1, y1]]);
  };

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (bits[y * width + x] !== 1) continue;
      if (!get(x, y - 1)) addEdge(x, y, x + 1, y); // top, left→right
      if (!get(x + 1, y)) addEdge(x + 1, y, x + 1, y + 1); // right, top→bottom
      if (!get(x, y + 1)) addEdge(x + 1, y + 1, x, y + 1); // bottom, right→left
      if (!get(x - 1, y)) addEdge(x, y + 1, x, y); // left, bottom→top
    }
  }
  return edges;
};
