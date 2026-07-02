# Image-processing performance — large source images (notes & potential optimization)

Status: **idea, not yet implemented** — captured 2026-07-02. Current behaviour is
correct; this is purely a speed win for large uploads.

## Observation

The image → sprite pipeline (`processSourceToCanvas` in
[`client/src/features/InputSection/hooks/useImageFileHandler.ts`](../../client/src/features/InputSection/hooks/useImageFileHandler.ts))
runs background removal and palette snapping at the **source image's full
resolution**, and only downscales to the target sprite size at the very end.
Both heavy steps are O(pixels), so wall-clock time scales with the *source*
megapixels — not the (tiny) sprite size.

Measured, one full pass (background removal → palette snap → crop → scale):

| Source image | Pixels  | One pass |
| ------------ | ------- | -------- |
| 1024×1024    | ~1 MP   | ~1.0 s   |
| 2783×3583    | ~10 MP  | ~7.5 s   |

A ~10 MP upload is ~10× slower than a ~1 MP one, entirely because of the source
resolution. The dominant cost is the OKLab per-pixel nearest-colour match in
`mapCanvasToMakeCodeColors` (`useMakeCodeColorConverter`); flood-fill background
removal (`removeBackground` in
[`client/src/features/InputSection/utils/canvasProcessing.ts`](../../client/src/features/InputSection/utils/canvasProcessing.ts))
is secondary. Both run synchronously on the main thread, so a large image also
janks the UI for the duration.

Note: the Source-panel compare view runs a *second*, cheaper pass — it re-frames
the source through the same geometry but **skips** the palette snap (via the
`skipColorSnap` option added for the crop-reflection fix), so it only adds
~0.3 s at 1 MP. It scales with source size too.

## Potential optimization

Cap the *working* resolution before the heavy steps: downscale the source to a
bounded long edge up front, then run background removal + palette snap + crop on
that smaller canvas. The result is scaled to the target sprite size (16–160 px)
anyway, so quality loss is negligible, and both the sprite pass and the compare
pass get much faster on large uploads.

Sketch — in `processSourceToCanvas`, before step 1 (remove background):

```ts
// MAX_WORK_EDGE comfortably above the largest target (160) — e.g. 1024.
if (Math.max(canvas.width, canvas.height) > MAX_WORK_EDGE) {
  canvas = downscaleToMaxEdge(canvas, MAX_WORK_EDGE);
}
```

Things to verify before implementing:

- **Framing unchanged.** Trim-edges / Fill crop bounds are computed from the
  (now downscaled) content — confirm the framing matches full-res within ~1 px.
- **Background-removal tolerance.** Anti-aliased edges shift slightly after a
  downscale; check the default tolerance still behaves the same.
- **Only when needed.** Skip the downscale when the source is already at/under
  the cap, so small/normal images are untouched.

## Why it's parked

Normal AI-generated sources (~1 MP) already process in ~1 s, so this only
matters for very large uploads. It's independent of the aspect-ratio /
crop-reflection fixes and can land on its own whenever it's worth doing.
