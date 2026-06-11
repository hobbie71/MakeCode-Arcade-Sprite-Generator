# Studio Generate Flow Redesign

**Date:** 2026-06-11
**Branch:** `ui-redesign`
**Status:** Approved — ready for implementation plan

## Problem

The studio's "Generate a sprite" modal does too much and commits too eagerly:

- It exposes a **Draw Blank** tab the studio doesn't need (the editor already opens
  on a blank canvas).
- It shows **size controls** (Width/Height inputs + preset chips) that duplicate
  the sizing the Resize & Process modal already owns.
- Generating or uploading an image **writes straight to the editor canvas** — an
  upload pastes the instant a file is dropped, before the user has reviewed
  dimensions, fit/crop, or background removal.

The intended experience is a deliberate, step-by-step flow:

> **Generate or upload → Resize & Process → edit → export.**

The first step should produce a *source image* and hand off to Resize & Process.
It must not touch the canvas until the user hits **Apply** in that modal.

## Scope

- **Studio only.** The hero / front-page entry widget stays exactly as it is
  (all three tabs, size controls, commit-to-canvas then navigate to the studio).
- No change to the wire contract, server, or the Resize & Process modal's internals
  — that modal already stages locally and only commits on Apply, so the new flow
  reuses its existing machinery.

## Current architecture (as found)

- **`components/GenerationControls/GenerationControls.tsx`** — shared by BOTH the
  hero (`HeroEntryWidget`) and the studio (`GenerateModal`). Renders three tabs
  (AI Generate / Upload Image / Draw Blank), the method-specific input, the
  asset-type + size block (`AssetOptionsSelection`), the primary button, and the
  AI cost/speed line. Flexes per surface today via `showQuality` /
  `showSizePresets` props. Fires `onSuccess` on the `isGenerating` true→false
  transition (no error).
- **`features/InputSection/hooks/useImageFileHandler.ts`** — where the canvas is
  written. Both `importImageManually` (upload) and
  `generateAIImageAndConvertToSprite` (AI) cache the raw file as `sourceImage`
  **and** call `processImageToSprite(file)`, which pastes into the editor.
- **`features/InputSection/.../ImageUploadForm.tsx`** — on drop/browse calls
  `importImageManually(file)` (auto-paste, no button click).
- **`pages/StudioPage/modals/ResizeProcessModal.tsx`** — reads the cached
  `sourceImage`, runs a live preview at staged dimensions/settings, and commits to
  the canvas only on **Apply** (sets canvas width/height + pastes). Cancel/Esc/
  backdrop discard — nothing to roll back.
- **`pages/StudioPage/StudioPage.tsx`** — owns the open/close state for the
  Generate, Resize, Export, and Token modals.

The "stage then apply" mechanism the redesign needs **already exists** in Resize &
Process. Generation/upload just has to stop short of pasting and hand off to it.

## Target experience

The new studio flow:

```
Generate / Upload   →   Resize & Process   →   edit   →   export
(stage source,          (preview + Apply
 canvas untouched)       commits to canvas)
```

### Studio Generate modal — UI

- **Two tabs only:** *AI Generate* and *Upload Image*. Draw Blank removed.
- **AI Generate tab:** prompt + quality + **asset type** (kept — informs the
  generation prompt) + the cost/speed indicator. **No size controls.**
- **Upload Image tab:** just the drag-and-drop zone + the primary button. No asset
  type, no size, nothing else.

### Behavior — canvas untouched until Resize & Process → Apply

- **AI Generate:** click *Generate sprite* → ~40s spinner in the modal (unchanged)
  → on success, cache the source PNG **only (no paste)**, close Generate, open
  Resize & Process seeded with that source.
- **Upload (auto-advance):** dropping or browsing a file immediately caches it as
  the source, closes Generate, and opens Resize & Process. No paste, no required
  button click.
- **Upload "Process image" button (kept):** enabled whenever a source image is
  available; clicking it opens Resize & Process with that source — the same
  destination as the drop, just an explicit affordance (e.g. when Generate is
  reopened with a previously-cached image). Button label stays **"Process image"**.
- **Cancel in Resize & Process** leaves the canvas as it was — the source is cached
  but uncommitted (matches the modal's existing "nothing to roll back" model).

## Design

**Approach: parameterize the shared `GenerationControls` by surface.** Add a
`surface: "hero" | "studio"` discriminator that bundles the per-surface
differences. The hero stays the default, untouched path; the studio gets the
trimmed UI and the stage-and-handoff completion. This extends the existing
per-surface pattern rather than duplicating the tab scaffolding.

### Component changes

1. **`GenerationControls`**
   - Replace the `showQuality` / `showSizePresets` booleans with a single
     `surface: "hero" | "studio"` prop (default `"hero"`). It derives:
     - **Tabs:** hero = all three; studio = AI Generate + Upload Image.
     - **Quality picker:** hero hides it; studio shows it.
     - **Asset/size block:** hero renders `AssetOptionsSelection` under all tabs
       with the **size inputs shown but the preset chips hidden** — i.e.
       `showSizePresets={false}`, preserving today's hero exactly. Studio renders
       asset type **only**, **only on the AI Generate tab**, with no size
       (`showSize={false}`).
     - **Completion:** hero **commits** (paste → `onSuccess`); studio **stages**
       (cache source → `onSuccess`, no paste).
   - Studio AI button → `generateAIImageAndConvertToSprite({ commit: false })`.
     Completion still flows through the `isGenerating` true→false effect → fires
     `onSuccess`.
   - Studio upload completion: the file handler stages the source, then
     `onSuccess` is called directly (no async generation runs, so the
     `isGenerating` effect won't fire for uploads in studio mode).

2. **`useImageFileHandler`**
   - Add a `commit` option to the AI handler:
     `generateAIImageAndConvertToSprite(options?: { commit?: boolean })`.
     `commit: false` runs the full generate-to-source pipeline (validate → OpenAI →
     build File → cache `importedImage` + `sourceImage`) but **skips** the final
     `processImageToSprite(file)` paste. Default `true` keeps the hero unchanged.
   - Add a small `stageSource(file)` helper that sets `importedImage` +
     `sourceImage` without pasting (for studio uploads).
   - Leave `processImageToSprite` and `importImageManually` untouched (hero +
     Resize & Process Apply still use them).

3. **`ImageUploadForm`**
   - Accept an optional `onFile?: (file: File) => void` override. When provided
     (studio), call it instead of `importImageManually`. When absent (hero), keep
     today's auto-commit behavior.

4. **`AssetOptionsSelection`**
   - Add a `showSize` flag (default `true`). When `false`, render the asset-type
     dropdown standalone (no Size inputs, no preset chips — overrides
     `showSizePresets`). Studio passes `showSize={false}`; hero keeps `showSize`
     default and continues to pass `showSizePresets={false}`.

5. **`GenerateModal` / `StudioPage`**
   - `StudioPage` provides the success handler:
     `onSuccess = () => { generateModal.close(); resizeModal.open(); }` — close
     Generate, open Resize & Process. Pass it through `GenerateModal` →
     `GenerationControls` (`surface="studio"`).

6. **`HeroEntryWidget`**
   - Switch from `showQuality={false} showSizePresets={false}` to `surface="hero"`.
     Internally hero maps to quality-hidden + `AssetOptionsSelection
     showSizePresets={false}` — no behavioral change.

### Data flow (studio)

```
Upload drop/browse ─┐
                    ├─► stageSource(file) ─► sourceImage cached (no paste)
AI Generate ────────┘   generateAIImageAndConvertToSprite({commit:false})
                                    │
                                    ▼
                         onSuccess(): close Generate, open Resize & Process
                                    │
                                    ▼
              Resize & Process: live preview from sourceImage
                                    │  Apply
                                    ▼
              processImageToSprite(sourceImage, {w,h,settings}) ─► canvas
```

## Edge cases & notes

- **Source fidelity.** The cached `sourceImage` is the full-resolution upload /
  OpenAI PNG, so Resize & Process always re-processes from clean source. Generation
  size no longer affects quality — this is why dropping the size UI from the
  Generate modal is safe.
- **AI generation dimensions.** The OpenAI call still passes the canvas-size
  context's current `width`/`height`; the source PNG is full-res regardless, and
  the user picks final dimensions in Resize & Process. No size UI needed at
  generate time.
- **Asset type and dimensions.** In studio, asset type informs the AI prompt only.
  Background/Tile no longer auto-lock canvas dimensions at generate time (that
  side-effect lived in the now-hidden `SizeInputs` remount). Acceptable: final
  dimensions are chosen next in Resize & Process. Re-adding an asset-type → size
  default is possible later if desired, but out of scope here.
- **Resize seeding.** Resize & Process seeds its staged dimensions from the
  canvas-size context (current behavior). For a fresh source this is the last
  canvas size; the user adjusts from there. No change required.
- **Hero untouched.** All three tabs, size controls, and commit-then-navigate
  behavior remain exactly as they are. The only hero edit is swapping the two
  display booleans for `surface="hero"`.

## Out of scope

- Any change to the hero / front-page flow beyond the prop swap.
- Server, wire contract, or Resize & Process internal changes.
- Re-adding asset-type → dimension locking in the studio.
- A client test suite (none exists; server-only tests).
