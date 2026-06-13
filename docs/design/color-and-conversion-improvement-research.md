# Research: Improving Color Matching & Image→Sprite Conversion

**Date:** 2026-06-13
**Status:** Research / recommendations (nothing implemented yet)
**Scope:** Two systems — (1) the palette/color matcher, (2) the image→sprite conversion pipeline. Plus a verdict on whether to train a custom model.

---

## TL;DR

- **Almost none of the problems are in the backend/server.** The OpenAI generation prompt is well-written. The bugs all live in the **client-side post-processing pipeline** (color matcher + order of operations).
- **Two root causes** explain every reported symptom:
  1. The color matcher **ignores saturation** (matches on hue + luminance only).
  2. The pipeline **quantizes at full resolution, then nearest-neighbor downscales** (point-samples, discarding ~99.96% of pixels).
- **Two overhauls fix everything**, in ~2–3 days, with **no model training**:
  1. Replace the HSL hue/luminance zone matcher with **perceptual nearest-color in OKLab**.
  2. **Reorder the pipeline**: downscale first (area-average in linear light), quantize last.
- **Do not train a model.** It would solve the wrong problem expensively. Pre-trained native pixel-art APIs already exist if the AI path needs upgrading.

---

## What the code actually does today

The "long gradient" mental model is slightly off from the code. There is **no gradient/ramp of colors** being generated. The expensive up-front work is a **hue-zone + luminance-zone system**:

- `client/src/features/InputSection/utils/hueZoneUtils.ts` — runs ~2,000 iterations per palette: carves the 360° hue circle into one wedge per palette color, then slices each wedge into light/dark luminance bands.
- `client/src/utils/colors/getMakeCodeColor.ts` — at paint time, each pixel is matched cheaply: convert RGB→HSL, find its hue wedge, find its luminance band, return that color.

**The critical detail:** the matcher signature is `hslToMakeCodeColor(h, l, hueZones)` — it passes **hue and luminance but throws away saturation entirely** (`getMakeCodeColor.ts`). That single omission causes two of the three symptoms.

### Palette facts
- 16 canonical MakeCode Arcade colors defined in `client/src/types/color.ts` (e.g. `BROWN = #91463D`, `TAN = #E5CDC4`, `DARK_PURPLE = #5C406C`, `LIGHT_PURPLE = #A4839F`, plus white/black).
- 10 themed palettes (Arcade, Matte, Pastel, Sweet, Poke, Adventure, DIY, Adafruit, StillLife, SteamPunk).
- The palette already contains brown, tan, and several neutrals — the matcher just can't reach them.

### Conversion pipeline order (today)
`client/src/features/InputSection/hooks/useImageFileHandler.ts → processSourceToCanvas`:
1. `createCanvasFromImage`
2. `removeBackground` (optional, flood-fill from borders) — `canvasProcessing.ts:151`
3. `mapCanvasToMakeCodeColors` — **quantize at full resolution** — `useMakeCodeColorConverter.ts:82`
4. `cropToVisibleContent` / `fillToEdges` (optional)
5. `scaleCanvasToTarget` — **nearest-neighbor downscale**, `imageSmoothingEnabled = false` — `canvasProcessing.ts:432`

Alpha is a **hard binary threshold at 127** (`getMakeCodeColor.ts:55`): `a < 127 → TRANSPARENT`, else quantize.

---

## Diagnosis — symptom → root cause

| Symptom | Root cause | Where |
|---|---|---|
| **Red line between sprite & background** | Anti-aliased edge pixels are *gray* (saturation ≈ 0). Gray's hue is undefined and defaults to ~0° = **red**. Since saturation is ignored, the matcher can't tell "gray" from "red" — it bins the gray seam into the red wedge → red line. A secondary contributor: partial-alpha fringe pixels survive the flood-fill background removal and get mis-colored. | `getMakeCodeColor.ts`, `canvasProcessing.ts:151` |
| **Brown → light orange** | Brown is a *desaturated, dark orange*. With saturation ignored, the matcher only sees "orange-ish hue + medium lightness" and can't distinguish muted-dark-orange (brown) from bright orange. The palette **has** brown (`#91463D`) and tan (`#E5CDC4`) — the matcher just can't reach them. | `getMakeCodeColor.ts` |
| **Detail → mush, black outlines vanish** | The pipeline quantizes at full res, then **nearest-neighbor downscales**. Downscaling 1024→16 by nearest-neighbor *point-samples* one pixel per ~64×64 block and discards the other ~4,000. A 1px black outline has a ~1/64 chance of being sampled, so it usually disappears, and which detail survives is essentially random. | `useImageFileHandler.ts`, `canvasProcessing.ts:432` |

> Key insight: detail isn't lost to the 16-color limit — it's lost to **point-sampling a high-res image instead of averaging it down.**

---

## Recommendations — biggest overhauls first

### 🔴 Overhaul #1 — Perceptual nearest-color in OKLab
**Impact: very high · Effort: ~1 day · Fixes the red line, brown→orange, and most "wrong color" cases**

Replace the entire hue/luminance zone system with a brute-force nearest-color search over the 16 active palette colors in a **perceptually-uniform color space (OKLab, or CIELAB with ΔE / CIEDE2000)**. For each pixel: convert to OKLab once, compute distance to all 16 pre-converted palette colors, pick the closest.

Why it's a rare win-win-win:
- **Quality:** OKLab distance respects lightness *and* chroma *and* hue together. Gray maps to white/black/tan (never saturated red). Brown maps to brown.
- **Performance:** *Deletes* the ~2,000-iteration zone precompute. 16 distance calcs per pixel is trivial; palette switches become instant.
- **Simplicity:** ~40 lines replaces two large files of zone logic (`hueZoneUtils.ts` + most of `getMakeCodeColor.ts`).

Design choices to settle before implementing:
- OKLab (simpler, fast, very good) vs. CIEDE2000 (gold standard, heavier math).
- Keep the themed palettes on the same code path (they should — the matcher just takes whatever 16 colors are active).

### 🔴 Overhaul #2 — Downscale first, quantize last
**Impact: very high · Effort: ~1 day · Fixes mush, random colors, vanishing outlines**

Flip the pipeline so quantization happens **once, at sprite resolution, after a proper downscale**:
1. Downscale the source to target size using **area-averaging (box filter) in linear-light sRGB** (convert sRGB→linear, average, linear→sRGB; averaging raw sRGB shifts colors lighter/muddier and feeds the brown→orange drift).
2. *Then* run the OKLab matcher on the small image.

Area-averaging preserves a feature's *energy*: a 1px black outline averaged into a block darkens it, so it survives as a dark pixel instead of being randomly dropped. This is what produces "unity" instead of confetti.

> Overhauls #1 + #2 together address every reported symptom. If only two things get done, do these. They're independent and could be done in parallel; ship #1 first (self-contained, deletes code, most visible improvement per hour).

---

### 🟡 Medium improvements (after the two overhauls)

- **#3 — Outline/edge preservation pass** (½–1 day). Run a cheap edge detector (Sobel on luminance) on the source; where there's a strong dark edge, force the corresponding sprite pixel to the darkest palette color *after* quantization. Guarantees "if it has a black border, it keeps a black border."
- **#4 — Dominant-color (mode) downscale option** (½ day). Area-averaging can muddy two adjacent flat colors into a third (red + blue → purple). For flat cartoon art, picking the *most common* color per source block looks crisper. Offer both; default by asset type (average for photos/backgrounds, mode for sprites).
- **#5 — Edge decontamination + softer alpha** (½ day). The hard alpha cutoff at 127 (`getMakeCodeColor.ts:55`) plus flood-fill background removal lets partial-alpha fringe pixels survive and get mis-colored — the *second* contributor to the red seam. Decontaminate edges (un-premultiply / pull color from nearest opaque neighbor) before quantizing; treat alpha as coverage during downscale rather than a late hard threshold.
- **#6 — Optional ordered (Bayer) dithering for backgrounds & tiles** (½ day). Off for sprites (looks like noise at 16×16). For backgrounds/tiles, a small ordered dither recovers gradient-ish shading within 16 colors. Per-asset-type toggle, off by default.

---

### 🟢 Generation-side lever (separate from conversion)

Everything above improves *both* uploaded and AI-generated images. For the **AI path specifically**, there's a way to sidestep downscale-quantize entirely: **generate native pixel art instead of generating ~816×816 and shrinking it.**

`gpt-image-2` is not a pixel-art model — it renders "pixel-art-*style*" at high res with anti-aliasing, and the pipeline spends ~655k pixels (e.g. 816×816 for a 16×16 sprite) only to discard 99.96%. Purpose-built alternatives produce true low-res, limited-palette sprites at native resolution:

- **Retro Diffusion** — pay-as-you-go USD credits (no subscription), <$0.01/image, API in dashboard, and available on **Replicate** (`retro-diffusion/rd-fast`) → trivial to call from the Bun server. Credit model fits this app better than a subscription.
- **PixelLab** — game-asset focused (also rotations/animations, mapping to the `Animation`/`Tilemap` asset types), but **subscription-tiered** ($50/mo top tier); previously hit a `402` on this account. Revisit later for the animation/rotation features, not now.

Approach: A/B `gpt-image-2` vs. a native generator behind the existing `style`/`assetType` settings.

**Minor prompt tweaks** (`server/src/prompt.ts`, low effort): the prompt is already strong. Worth testing: "use ONLY these exact colors, never blend or interpolate between them" and, for sprites, "hard aliased edges between subject and background." But fixing the client matcher matters far more than prompt tuning.

---

## "Do I need to train my own model?" — No.

- **~80% of the pain is classical-pipeline bugs** (saturation-blind matcher + wrong operation order), fixable in 2–3 days with zero ML.
- **The quantization gold standard is non-ML:** Gerstner et al., *"Pixelated Image Abstraction"* (2012) — joint palette + pixel-assignment optimization via SLIC superpixels + simulated annealing. The "go all-in" version of #1+#2+#4, still no training.
- **For generation**, pre-trained native pixel-art models already exist (Retro Diffusion, PixelLab) — an afternoon to integrate.
- **If ever going ML** (not needed): a LoRA fine-tune on top of an existing pixel-art diffusion model — never from scratch, never hand-drawing a dataset.

---

## Suggested sequence

1. **OKLab nearest-color matcher** (#1) — kills red seam, brown→orange, wrong colors; also a perf win. Start here.
2. **Reorder downscale-before-quantize with linear-light averaging** (#2) — kills mush + vanishing outlines.
3. Re-evaluate on real images, then add **outline preservation** (#3) and **mode downscale** (#4) only where still needed.
4. **Edge decontamination / alpha** (#5) for residual fringing.
5. *Separately*, prototype a **native pixel-art generation API** (Retro Diffusion via Replicate) for the AI path.

---

## Key code references

| Concern | File |
|---|---|
| Color matcher (drops saturation) | `client/src/utils/colors/getMakeCodeColor.ts` |
| Hue/luminance zone precompute (~2,000 iters) | `client/src/features/InputSection/utils/hueZoneUtils.ts` |
| RGB→HSL conversion | `client/src/utils/colors/colorConversion.ts` |
| Palette definitions (16 colors, 10 themes) | `client/src/types/color.ts` |
| Pipeline order (quantize before downscale) | `client/src/features/InputSection/hooks/useImageFileHandler.ts` |
| Quantize step | `client/src/features/InputSection/hooks/useMakeCodeColorConverter.ts` |
| Nearest-neighbor downscale | `client/src/features/InputSection/utils/canvasProcessing.ts:432` |
| Background removal (flood-fill) | `client/src/features/InputSection/utils/canvasProcessing.ts:151` |
| Alpha hard threshold (127) | `client/src/utils/colors/getMakeCodeColor.ts:55` |
| OpenAI call (`gpt-image-2`, size) | `server/src/openai.ts:23` |
| Generation prompt template | `server/src/prompt.ts` |
| Generated-image sizing (MIN_PIXELS) | `server/src/size.ts` |

## Sources (generation APIs)
- PixelLab API — https://www.pixellab.ai/pixellab-api
- Retro Diffusion — https://retrodiffusion.ai/
- Retro Diffusion on Replicate — https://replicate.com/retro-diffusion/rd-fast
