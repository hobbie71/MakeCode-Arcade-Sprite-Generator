/**
 * /compare — a DEV-ONLY visual harness for the image→sprite pipeline overhauls.
 *
 * It runs a 2×2 ablation (pipeline order × border-detection pass) on a handful
 * of sample sprites and paints the whole thing onto ONE labelled canvas, so the
 * effect of #2 (downscale-first) and #3 (border detection) can be compared at a
 * glance / screenshotted. Not linked anywhere in the app and gated to localhost;
 * see docs/design/color-and-conversion-improvement-research.md.
 */
import { useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import { ArcadePalette } from "../../types/color";
import type { MakeCodeColor, MakeCodePalette } from "../../types/color";
import { drawSpriteDataOnCanvasTransparent } from "../../features/SpriteEditor/libs/drawPixelOnCanvas";
import { createCanvas2D } from "../../utils/image/canvas";
import { runVariants, type Variants } from "./runVariants";

const SAMPLES = [
  { label: "Chest", src: "/compare-samples/chest.png" },
  { label: "Knight", src: "/compare-samples/knight.png" },
  { label: "Coin", src: "/compare-samples/coin.png" },
];

const TARGET = 32; // sprite resolution
const SCALE = 5; // display px per sprite px  → 160px tiles
const TILE = TARGET * SCALE;
const GAP = 12;
const LABEL_W = 122;
const PAD = 18;
const TITLE_H = 40;
const SUBTITLE_H = 24;
const HEADER_H = 26;

// Rows of the grid: the source, then the four variants (A/B/C/D).
const ROWS: { key: "source" | keyof Variants; lines: string[] }[] = [
  { key: "source", lines: ["Source"] },
  { key: "current", lines: ["A — Current", "(how it is now)"] },
  { key: "currentEdge", lines: ["B — Current", "+ Border #3"] },
  { key: "downscaleFirst", lines: ["C — Downscale", "first #2"] },
  { key: "downscaleFirstEdge", lines: ["D — #2 + #3", "(both)"] },
];

const isLocalhost =
  typeof window !== "undefined" &&
  /^(localhost|127\.0\.0\.1|\[::1\])$/.test(window.location.hostname);

const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load ${src}`));
    img.src = src;
  });

/** Two-tone checkerboard so transparent sprite pixels read as transparency. */
const drawCheckerboard = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number
) => {
  const cell = 8;
  for (let cy = 0; cy < size; cy += cell) {
    for (let cx = 0; cx < size; cx += cell) {
      ctx.fillStyle = ((cx / cell + cy / cell) & 1) === 0 ? "#e9e9ee" : "#ffffff";
      ctx.fillRect(x + cx, y + cy, cell, cell);
    }
  }
};

const renderSpriteTile = (
  sprite: MakeCodeColor[][],
  palette: MakeCodePalette
): HTMLCanvasElement => {
  const { canvas: tile, ctx } = createCanvas2D(TILE, TILE);
  drawCheckerboard(ctx, 0, 0, TILE);
  drawSpriteDataOnCanvasTransparent(tile, { x: 0, y: 0 }, sprite, palette, SCALE);
  return tile;
};

const renderSourceTile = (image: HTMLImageElement): HTMLCanvasElement => {
  const { canvas: tile, ctx } = createCanvas2D(TILE, TILE);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, TILE, TILE);
  const scale = Math.min(TILE / image.width, TILE / image.height);
  const w = image.width * scale;
  const h = image.height * scale;
  ctx.drawImage(image, (TILE - w) / 2, (TILE - h) / 2, w, h);
  return tile;
};

interface Subject {
  label: string;
  image: HTMLImageElement;
  variants: Variants;
}

/** Draw one variant/source tile at (x, y), with D's cells highlighted green. */
const drawTile = (
  ctx: CanvasRenderingContext2D,
  subject: Subject,
  row: (typeof ROWS)[number],
  x: number,
  y: number
) => {
  const tile =
    row.key === "source"
      ? renderSourceTile(subject.image)
      : renderSpriteTile(subject.variants[row.key], ArcadePalette);
  ctx.drawImage(tile, x, y);

  const border =
    row.key === "downscaleFirstEdge"
      ? { color: "#16a34a", width: 3, inset: 1.5 }
      : { color: "#d4d4d8", width: 1, inset: 0.5 };
  ctx.strokeStyle = border.color;
  ctx.lineWidth = border.width;
  ctx.strokeRect(
    x + border.inset,
    y + border.inset,
    TILE - border.inset * 2,
    TILE - border.inset * 2
  );
};

/** Load every sample, run its variants, and package the subjects for the grid. */
const loadSubjects = async (): Promise<Subject[]> => {
  const subjects: Subject[] = [];
  for (const sample of SAMPLES) {
    const image = await loadImage(sample.src);
    const variants = runVariants(image, ArcadePalette, {
      targetWidth: TARGET,
      targetHeight: TARGET,
      removeBackground: true,
    });
    subjects.push({ label: sample.label, image, variants });
  }
  return subjects;
};

const drawGrid = (canvas: HTMLCanvasElement, subjects: Subject[]) => {
  const cols = subjects.length;
  const width = PAD + LABEL_W + cols * TILE + (cols - 1) * GAP + PAD;
  const FOOTER_H = 52;
  const height =
    PAD +
    TITLE_H +
    SUBTITLE_H +
    HEADER_H +
    ROWS.length * TILE +
    (ROWS.length - 1) * GAP +
    FOOTER_H +
    PAD;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#f4f4f5";
  ctx.fillRect(0, 0, width, height);
  ctx.textBaseline = "middle";

  // Title + subtitle
  ctx.fillStyle = "#18181b";
  ctx.font = "700 20px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("Image → Sprite: pipeline comparison", PAD, PAD + TITLE_H / 2);
  ctx.fillStyle = "#52525b";
  ctx.font = "500 12px sans-serif";
  ctx.fillText(
    "32×32 · Arcade palette · #2 = area-average downscale-first · #3 = dark-edge border detection",
    PAD,
    PAD + TITLE_H + SUBTITLE_H / 2
  );

  const gridLeft = PAD + LABEL_W;
  const gridTop = PAD + TITLE_H + SUBTITLE_H + HEADER_H;

  // Column headers (subject names)
  ctx.fillStyle = "#18181b";
  ctx.font = "700 14px sans-serif";
  ctx.textAlign = "center";
  subjects.forEach((subject, col) => {
    const x = gridLeft + col * (TILE + GAP) + TILE / 2;
    ctx.fillText(subject.label, x, gridTop - HEADER_H / 2);
  });

  // Rows
  ROWS.forEach((row, rowIndex) => {
    const y = gridTop + rowIndex * (TILE + GAP);

    // Row label (left gutter, multi-line, vertically centred)
    ctx.fillStyle = row.key === "downscaleFirstEdge" ? "#166534" : "#27272a";
    ctx.font = "700 13px sans-serif";
    ctx.textAlign = "left";
    const lineH = 17;
    const startY = y + TILE / 2 - ((row.lines.length - 1) * lineH) / 2;
    row.lines.forEach((line, i) => {
      ctx.fillText(line, PAD, startY + i * lineH);
    });

    subjects.forEach((subject, col) => {
      drawTile(ctx, subject, row, gridLeft + col * (TILE + GAP), y);
    });
  });

  // Footer takeaway
  const footerY = gridTop + ROWS.length * TILE + (ROWS.length - 1) * GAP + 16;
  ctx.textAlign = "left";
  ctx.fillStyle = "#166534";
  ctx.font = "700 13px sans-serif";
  ctx.fillText(
    "D (#2 + #3) — coherent shapes + crisp outlines: best of both.",
    PAD,
    footerY
  );
  ctx.fillStyle = "#52525b";
  ctx.font = "500 11px sans-serif";
  ctx.fillText(
    "A→B: outlines return, base still point-sampled · C: coherent but outlines fade · edge speckle = bg-removal fringe (#5).",
    PAD,
    footerY + 21
  );
};

const ComparePage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState("Loading samples…");

  useEffect(() => {
    let cancelled = false;
    loadSubjects()
      .then((subjects) => {
        if (cancelled) return;
        const canvas = canvasRef.current;
        if (canvas) drawGrid(canvas, subjects);
        setStatus("");
      })
      .catch((err) => {
        if (!cancelled) setStatus(String(err));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!isLocalhost) return <Navigate to="/" replace />;

  return (
    <div style={{ padding: 16, background: "#fff", minHeight: "100vh" }}>
      {status && <p style={{ fontFamily: "sans-serif" }}>{status}</p>}
      <canvas ref={canvasRef} data-testid="compare-grid" />
    </div>
  );
};

export default ComparePage;
