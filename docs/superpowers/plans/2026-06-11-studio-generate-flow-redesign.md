# Studio Generate Flow Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the studio's "Generate a sprite" modal a deliberate first step — trim it to two tabs (no Draw Blank, no size; asset type kept for AI), and have generate/upload stage a *source image* and open Resize & Process instead of writing the canvas. The hero/front-page widget is unchanged.

**Architecture:** The shared `GenerationControls` is parameterized by a new `surface: "hero" | "studio"` prop. Hero keeps today's commit-to-canvas-then-navigate path. Studio renders the trimmed UI and routes completion through *stage source → open Resize & Process* (which already stages locally and only commits on Apply). The canvas is untouched until Apply.

**Tech Stack:** React 19 + TypeScript, Tailwind CSS 3, Bun toolchain (bundler + scripts). No client test runner exists (tests are server-only per CLAUDE.md) — verification is `tsc` compile + eslint + browser preview.

**Spec:** `docs/superpowers/specs/2026-06-11-studio-generate-flow-redesign.md`

---

## Verification note (read first)

There is **no client unit-test framework** in this repo (`CLAUDE.md`: "There is no client test suite"; tests live server-side as `*.test.ts`). Do **not** scaffold one — that's out of scope and against the project's conventions. Each task's verification gate is:

- **Typecheck:** `cd client && bunx tsc -b` → expect no errors.
- **Lint (final task):** `bun run --filter client lint` → expect no errors.
- **Build + preview (final task):** `bun run --filter client build`, then exercise the flow in the browser preview.

All paths below are repo-root-relative. Run git commands from the repo root.

---

## File structure

| File | Change | Responsibility |
| --- | --- | --- |
| `client/src/features/InputSection/components/AssetOptionsSelection.tsx` | Modify | Add `showSize` flag → render asset-type dropdown standalone (no Size column / presets). |
| `client/src/features/InputSection/hooks/useImageFileHandler.ts` | Modify | Add `commit` option to the AI handler + a `stageSource` helper (cache source, no paste). |
| `client/src/features/InputSection/GenerationMethodSection/ImageToSpriteSection/components/ImageUploadForm.tsx` | Modify | Accept an optional `onFile` override for the picked file. |
| `client/src/components/GenerationControls/GenerationControls.tsx` | Modify | Replace `showQuality`/`showSizePresets` with `surface`; studio = 2 tabs, asset-type-only-on-AI, stage-and-handoff. |
| `client/src/pages/StudioPage/modals/GenerateModal.tsx` | Modify | Pass `surface="studio"` + an `onSuccess` that opens Resize & Process. |
| `client/src/pages/StudioPage/StudioPage.tsx` | Modify | Wire generate success → close Generate, open Resize & Process. |
| `client/src/pages/HeroPage/components/HeroEntryWidget.tsx` | Modify | Swap the two display booleans for `surface="hero"`. |

Tasks 1–3 are additive (each compiles standalone). Task 4 changes the `GenerationControls` prop signature and **must** update all three call sites in one commit so the build stays green. Task 5 is the end-to-end verification gate.

---

## Task 1: `AssetOptionsSelection` — add `showSize` flag

**Files:**
- Modify: `client/src/features/InputSection/components/AssetOptionsSelection.tsx`

- [ ] **Step 1: Add `showSize` to the Props interface**

Replace the existing `Props` interface (currently only `showSizePresets`):

```tsx
interface Props {
  /** Quick square-size preset chips (8×8 … 64×64) beneath the Width/Height inputs.
   *  Shown in the Studio Generate modal; hidden in the minimal hero entry widget. */
  showSizePresets?: boolean;
  /** When false, hide the Size inputs AND the preset chips entirely — the
   *  asset-type dropdown renders standalone (studio AI tab owns no sizing; final
   *  dimensions are chosen in Resize & Process). */
  showSize?: boolean;
}
```

- [ ] **Step 2: Destructure `showSize` with a default**

Change the component signature:

```tsx
const AssetOptionsSelection = ({
  showSizePresets = true,
  showSize = true,
}: Props) => {
```

- [ ] **Step 3: Gate the Size column on `showSize`**

In the returned JSX, wrap the Size column (the second flex child) so it only renders when `showSize` is true. Replace:

```tsx
        <div className="min-w-0 flex-1">
          <label className="form-label">Size</label>
          {/* Remount per asset type so the locked dimensions re-apply on every
              switch (Background → 160×120, Tile → 16×16; Sprite is editable). */}
          <SizeInputs
            key={selectedAsset}
            fixedSize={fixedSize}
            disabled={isGenerating}
          />
        </div>
```

with:

```tsx
        {showSize && (
          <div className="min-w-0 flex-1">
            <label className="form-label">Size</label>
            {/* Remount per asset type so the locked dimensions re-apply on every
                switch (Background → 160×120, Tile → 16×16; Sprite is editable). */}
            <SizeInputs
              key={selectedAsset}
              fixedSize={fixedSize}
              disabled={isGenerating}
            />
          </div>
        )}
```

- [ ] **Step 4: Gate the preset chips on `showSize` too**

Change the presets condition from:

```tsx
      {selectedAsset === AssetType.Sprite && showSizePresets && (
```

to:

```tsx
      {showSize && selectedAsset === AssetType.Sprite && showSizePresets && (
```

- [ ] **Step 5: Typecheck**

Run: `cd client && bunx tsc -b`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add client/src/features/InputSection/components/AssetOptionsSelection.tsx
git commit -m "AssetOptionsSelection: add showSize flag for asset-type-only rendering"
```

---

## Task 2: `useImageFileHandler` — `commit` option + `stageSource`

**Files:**
- Modify: `client/src/features/InputSection/hooks/useImageFileHandler.ts`

- [ ] **Step 1: Add a `stageSource` helper**

Add this `useCallback` inside the hook, just before `processSourceToCanvas` (or anywhere among the other callbacks). It caches the file as both the imported and re-processable source **without** touching the canvas:

```tsx
  /**
   * Caches a file as the imported + re-processable source WITHOUT committing it
   * to the editor canvas. Used by the studio Generate modal, which hands the
   * source off to Resize & Process instead of pasting immediately.
   */
  const stageSource = useCallback(
    (file: File) => {
      setImportedImage(file);
      setSourceImage(file);
    },
    [setImportedImage, setSourceImage]
  );
```

- [ ] **Step 2: Add a `commit` option to the AI handler signature**

Keep the `useCallback` arrow **inline** so the body's indentation does not shift — only the parameter list changes and one line is inserted. Change:

```tsx
  const generateAIImageAndConvertToSprite = useCallback(async () => {
    setError(null);
```

to:

```tsx
  const generateAIImageAndConvertToSprite = useCallback(async (options?: {
    commit?: boolean;
  }) => {
    // commit=true (default): paste the result into the editor (hero flow).
    // commit=false: cache the source only and let Resize & Process commit it.
    const commit = options?.commit ?? true;
    setError(null);
```

The rest of the function body stays at its current indentation. The closing `}, [ ...deps... ]);` is **unchanged** (do not edit it).

- [ ] **Step 3: Make the final paste conditional on `commit`**

Inside that handler, the source is already cached before the paste. Change:

```tsx
      // Cache the original generated image so re-processing (resize) is free.
      setImportedImage(file);
      setSourceImage(file);
      await processImageToSprite(file);
```

to:

```tsx
      // Cache the original generated image so re-processing (resize) is free.
      setImportedImage(file);
      setSourceImage(file);
      if (commit) await processImageToSprite(file);
```

- [ ] **Step 4: Leave the closing + dependency array untouched**

Do not change the existing closing `}, [ startGeneration, stopGeneration, ... setGenerationMessage ]);`. `options` is a function argument, not a dependency, so the array stays exactly as it was.

- [ ] **Step 5: Export `stageSource` from the hook**

Add `stageSource` to the returned object:

```tsx
  return {
    importImageManually,
    generateAIImageAndConvertToSprite,
    importedImage,
    sourceImage,
    setSourceImage,
    stageSource,
    processImageToSprite,
    processSourceToCanvas,
  };
```

- [ ] **Step 6: Typecheck**

Run: `cd client && bunx tsc -b`
Expected: no errors. (`generateAIImageAndConvertToSprite()` with no args still compiles — `options` is optional.)

- [ ] **Step 7: Commit**

```bash
git add client/src/features/InputSection/hooks/useImageFileHandler.ts
git commit -m "useImageFileHandler: add stageSource + commit option for staged generation"
```

---

## Task 3: `ImageUploadForm` — optional `onFile` override

**Files:**
- Modify: `client/src/features/InputSection/GenerationMethodSection/ImageToSpriteSection/components/ImageUploadForm.tsx`

- [ ] **Step 1: Accept an `onFile` prop and choose the handler**

Change the component signature + handler resolution. Replace:

```tsx
const ImageUploadForm = () => {
  // Hooks
  const { importImageManually } = useImageFileHandler();
  const { isGenerating } = useLoading();
```

with:

```tsx
interface Props {
  /** Override for what happens with the picked file. The studio passes a
   *  stage-and-handoff handler (cache source → open Resize & Process); when
   *  omitted (hero) the file is committed straight to the canvas. */
  onFile?: (file: File) => void;
}

const ImageUploadForm = ({ onFile }: Props) => {
  // Hooks
  const { importImageManually } = useImageFileHandler();
  const { isGenerating } = useLoading();
  const handleFile = onFile ?? importImageManually;
```

- [ ] **Step 2: Use `handleFile` in the drop handler**

In `handleDrop`, change `importImageManually(file);` to `handleFile(file);`:

```tsx
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleFile(file);
      setLiveMessage(`Image ${file.name} uploaded successfully.`);
    } else {
```

- [ ] **Step 3: Use `handleFile` in the input-change handler**

In `handleInputChange`, change `importImageManually(file);` to `handleFile(file);`:

```tsx
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      handleFile(file);
      setLiveMessage(`Image ${file.name} uploaded successfully.`);
    } else {
```

- [ ] **Step 4: Typecheck**

Run: `cd client && bunx tsc -b`
Expected: no errors. (Existing `<ImageUploadForm />` callers compile — `onFile` is optional.)

- [ ] **Step 5: Commit**

```bash
git add client/src/features/InputSection/GenerationMethodSection/ImageToSpriteSection/components/ImageUploadForm.tsx
git commit -m "ImageUploadForm: optional onFile override for staged uploads"
```

---

## Task 4: `GenerationControls` `surface` prop + wire all call sites (atomic)

This changes the `GenerationControls` prop signature, so it updates the component **and** all three call sites in one commit to keep the build green.

**Files:**
- Modify: `client/src/components/GenerationControls/GenerationControls.tsx`
- Modify: `client/src/pages/StudioPage/modals/GenerateModal.tsx`
- Modify: `client/src/pages/StudioPage/StudioPage.tsx`
- Modify: `client/src/pages/HeroPage/components/HeroEntryWidget.tsx`

- [ ] **Step 1: Rewrite `GenerationControls.tsx`**

Replace the **entire** file with:

```tsx
import { useEffect, useRef } from "react";
import Button from "../Button";
import SegmentedControl, { type SegmentOption } from "../SegmentedControl";
import OpenAISettingsSection from "../../features/InputSection/GenerationMethodSection/TextToSpriteSection/components/OpenAISettingsSection";
import ImageUploadForm from "../../features/InputSection/GenerationMethodSection/ImageToSpriteSection/components/ImageUploadForm";
import AssetOptionsSelection from "../../features/InputSection/components/AssetOptionsSelection";
import { useGenerationMethod } from "../../context/GenerationMethodContext/useGenerationMethod";
import { useLoading } from "../../context/LoadingContext/useLoading";
import { useError } from "../../context/ErrorContext/useError";
import { useToken } from "../../context/TokenContext/useToken";
import { useCanvasSize } from "../../context/CanvasSizeContext/useCanvasSize";
import { useSprite } from "../../context/SpriteContext/useSprite";
import { useOpenAISettings } from "../../context/OpenAISettingsContext/useOpenAISettings";
import { useImageFileHandler } from "../../features/InputSection/hooks/useImageFileHandler";
import { GenerationMethod, getQualityTokenCost } from "../../types/export";
import { MakeCodeColor } from "../../types/color";

/** Small filled lightning bolt for the speed estimate (matches the solid ★). */
function BoltIcon() {
  return (
    <svg
      className="h-3 w-3 text-accent"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z" />
    </svg>
  );
}

type Surface = "hero" | "studio";

const HERO_TABS: SegmentOption<GenerationMethod>[] = [
  { value: GenerationMethod.TextToSprite, label: "AI Generate" },
  { value: GenerationMethod.ImageToSprite, label: "Upload Image" },
  { value: GenerationMethod.BlankCanvas, label: "Draw Blank" },
];

const STUDIO_TABS: SegmentOption<GenerationMethod>[] = [
  { value: GenerationMethod.TextToSprite, label: "AI Generate" },
  { value: GenerationMethod.ImageToSprite, label: "Upload Image" },
];

interface Props {
  /** Called after a successful generate / upload / blank.
   *  hero → navigate to the studio; studio → open Resize & Process. */
  onSuccess?: () => void;
  /** Which host renders this widget.
   *  - "hero" (default): all three tabs, asset type + size, and generate/upload
   *    COMMIT to the canvas before firing onSuccess (then the hero navigates).
   *  - "studio": AI Generate + Upload Image only, asset type on the AI tab (no
   *    size), and generate/upload STAGE a source image then fire onSuccess
   *    (which opens Resize & Process) WITHOUT pasting to the canvas. */
  surface?: Surface;
}

/**
 * Shared generation UI used by BOTH the hero entry widget and the studio Generate
 * modal. Composes the existing primitives (OpenAISettingsSection, ImageUploadForm,
 * AssetOptionsSelection) behind tabs, plus a token indicator and a context-aware
 * primary button. The `surface` prop selects the hero (commit) vs studio (stage)
 * behavior and the trimmed studio layout.
 */
export default function GenerationControls({
  onSuccess,
  surface = "hero",
}: Props) {
  const isStudio = surface === "studio";
  const { selectedMethod, setSelectedMethod } = useGenerationMethod();
  const { isGenerating } = useLoading();
  const { error } = useError();
  const { canGenerate, watchAdToEarnToken } = useToken();
  const { settings } = useOpenAISettings();
  const { width, height } = useCanvasSize();
  const { setSpriteData } = useSprite();
  const {
    generateAIImageAndConvertToSprite,
    processImageToSprite,
    importedImage,
    setSourceImage,
    stageSource,
  } = useImageFileHandler();

  // Display-only token cost for the selected quality (no real economy — ADR-0006).
  const tokenCost = getQualityTokenCost(settings.quality);

  // The studio has no Draw Blank tab. If the shared GenerationMethod context is
  // still on Blank (e.g. it was chosen on the hero before navigating in), fall
  // back to AI so a tab is always highlighted and the body always matches.
  const activeMethod =
    isStudio && selectedMethod === GenerationMethod.BlankCanvas
      ? GenerationMethod.TextToSprite
      : selectedMethod;

  // Fire onSuccess when an async generate/upload finishes without error. This
  // covers the AI path on both surfaces and the committing upload on the hero.
  const wasGenerating = useRef(false);
  useEffect(() => {
    if (wasGenerating.current && !isGenerating && !error) onSuccess?.();
    wasGenerating.current = isGenerating;
  }, [isGenerating, error, onSuccess]);

  const startBlankCanvas = () => {
    const blank: MakeCodeColor[][] = Array.from({ length: height }, () =>
      Array.from({ length: width }, () => MakeCodeColor.TRANSPARENT),
    );
    setSpriteData(blank);
    setSourceImage(null); // a blank canvas has no re-processable source
    onSuccess?.();
  };

  // Studio upload: stage the picked file (cache, do NOT paste) and hand off to
  // Resize & Process immediately. No async generation runs, so call onSuccess
  // directly (the isGenerating effect above won't fire for a staged upload).
  const handleStudioUpload = (file: File) => {
    stageSource(file);
    onSuccess?.();
  };

  const renderPrimary = () => {
    if (activeMethod === GenerationMethod.TextToSprite) {
      return canGenerate ? (
        <Button
          variant="primary"
          className="w-full"
          isLoading={isGenerating}
          onClick={() =>
            generateAIImageAndConvertToSprite(
              isStudio ? { commit: false } : undefined,
            ).catch(() => {})
          }
        >
          ✦ Generate sprite
        </Button>
      ) : (
        // Display-only placeholder for the future rewarded-ad flow (ADR-0006).
        <Button
          variant="secondary"
          className="w-full"
          onClick={watchAdToEarnToken}
        >
          Watch ad to earn a token
        </Button>
      );
    }
    if (activeMethod === GenerationMethod.ImageToSprite) {
      return (
        <Button
          variant="primary"
          className="w-full"
          isLoading={isGenerating}
          disabled={!importedImage}
          onClick={() => {
            if (isStudio) {
              // Source is normally staged on drop (auto-advance); this button is
              // the explicit affordance when a source is already cached.
              if (importedImage) handleStudioUpload(importedImage);
            } else {
              processImageToSprite();
            }
          }}
        >
          Process image
        </Button>
      );
    }
    return (
      <Button variant="primary" className="w-full" onClick={startBlankCanvas}>
        Start with blank canvas
      </Button>
    );
  };

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <SegmentedControl
        options={isStudio ? STUDIO_TABS : HERO_TABS}
        value={activeMethod}
        onChange={setSelectedMethod}
        ariaLabel="Generation method"
        stretch
        disabled={isGenerating}
      />

      {/* Method-specific input */}
      {activeMethod === GenerationMethod.TextToSprite && (
        <OpenAISettingsSection showQuality={isStudio} />
      )}
      {activeMethod === GenerationMethod.ImageToSprite && (
        <ImageUploadForm onFile={isStudio ? handleStudioUpload : undefined} />
      )}
      {activeMethod === GenerationMethod.BlankCanvas && (
        <p className="text-sm text-ink-muted">
          Start from an empty canvas at the size below and draw your sprite
          pixel by pixel.
        </p>
      )}

      {/* Asset options:
          - hero: asset type + size inputs (no preset chips), under all tabs.
          - studio: asset type only, on the AI Generate tab only (no size). */}
      {isStudio ? (
        activeMethod === GenerationMethod.TextToSprite && (
          <AssetOptionsSelection showSize={false} />
        )
      ) : (
        <AssetOptionsSelection showSizePresets={false} />
      )}

      {renderPrimary()}

      {/* Cost + speed indicator (AI only) — sits below the button, mirrors the mockup */}
      {activeMethod === GenerationMethod.TextToSprite && (
        <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-ink-subtle">
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
            <span className="text-accent">★</span>
            {`${tokenCost} token${tokenCost === 1 ? "" : "s"} per generation`}
          </span>
          <span aria-hidden="true" className="font-bold">
            ·
          </span>
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
            <BoltIcon />
            ~40s AI sprite generation
          </span>
        </p>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Update `GenerateModal.tsx`**

Replace the **entire** file with:

```tsx
import Modal from "../../../components/Modal/Modal";
import GenerationControls from "../../../components/GenerationControls/GenerationControls";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  /** Fired when a generate/upload has staged a source image — the studio closes
   *  this modal and opens Resize & Process. */
  onSuccess: () => void;
}

/**
 * Studio Generate modal — wraps the shared GenerationControls in "studio" mode:
 * two tabs (AI Generate / Upload Image), asset type on the AI tab, no size, and
 * generate/upload STAGE a source image (canvas untouched) then hand off to
 * Resize & Process via onSuccess.
 */
export default function GenerateModal({ isOpen, onClose, onSuccess }: Props) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      title="Generate a sprite"
      subtitle="Describe it or upload an image — AI draws it on the Arcade palette.">
      <GenerationControls surface="studio" onSuccess={onSuccess} />
    </Modal>
  );
}
```

- [ ] **Step 3: Wire the success handoff in `StudioPage.tsx`**

Add a memoized handler that closes Generate and opens Resize & Process, then pass it to `GenerateModal`.

Add this `useCallback` alongside the existing `openGenerate` / `openResize` callbacks (after `openExport`):

```tsx
  // A staged generate/upload hands off to Resize & Process: close the Generate
  // modal and open Resize seeded with the freshly staged source image.
  const handleGenerated = useCallback(() => {
    generateModal.close();
    resizeModal.open();
  }, [generateModal, resizeModal]);
```

Then update the `GenerateModal` element from:

```tsx
      <GenerateModal
        isOpen={generateModal.isOpen}
        onClose={generateModal.close}
      />
```

to:

```tsx
      <GenerateModal
        isOpen={generateModal.isOpen}
        onClose={generateModal.close}
        onSuccess={handleGenerated}
      />
```

(`useCallback` is already imported in `StudioPage.tsx`.)

- [ ] **Step 4: Update `HeroEntryWidget.tsx`**

Replace the `GenerationControls` element. Change:

```tsx
      <GenerationControls
        onSuccess={onSuccess}
        showQuality={false}
        showSizePresets={false}
      />
```

to:

```tsx
      <GenerationControls onSuccess={onSuccess} surface="hero" />
```

- [ ] **Step 5: Typecheck the whole client**

Run: `cd client && bunx tsc -b`
Expected: no errors. (No remaining references to `showQuality`/`showSizePresets` on `GenerationControls`.)

- [ ] **Step 6: Confirm no stale prop references remain**

Run: `grep -rn "showQuality\|showSizePresets" client/src/components/GenerationControls client/src/pages/StudioPage/modals/GenerateModal.tsx client/src/pages/HeroPage/components/HeroEntryWidget.tsx`
Expected: **no matches** (the props now live only inside `OpenAISettingsSection` / `AssetOptionsSelection`, not on `GenerationControls`).

- [ ] **Step 7: Commit**

```bash
git add client/src/components/GenerationControls/GenerationControls.tsx \
        client/src/pages/StudioPage/modals/GenerateModal.tsx \
        client/src/pages/StudioPage/StudioPage.tsx \
        client/src/pages/HeroPage/components/HeroEntryWidget.tsx
git commit -m "GenerationControls: surface prop; studio stages source into Resize & Process"
```

---

## Task 5: End-to-end verification (build, lint, preview)

**Files:** none (verification only).

- [ ] **Step 1: Full client build**

Run: `bun run --filter client build`
Expected: completes without TypeScript or bundler errors.

- [ ] **Step 2: Lint**

Run: `bun run --filter client lint`
Expected: no errors.

- [ ] **Step 3: Start the preview / dev server**

Use the preview tooling (or `bun run dev:client`) and open the app.

- [ ] **Step 4: Verify the studio Generate modal — layout**

Navigate to `/studio`, open the Generate modal (the editor's generate action). Confirm:
- Exactly **two** tabs: **AI Generate** and **Upload Image** (no "Draw Blank").
- **AI Generate** tab shows prompt + quality + **Asset type** + the cost/speed line, and **no** Width/Height inputs or size preset chips.
- **Upload Image** tab shows only the drag-and-drop zone + the **Process image** button (no asset type, no size).

- [ ] **Step 5: Verify the studio upload flow — staged, canvas untouched**

On the **Upload Image** tab, drop or browse an image. Confirm:
- The Generate modal closes and **Resize & Process opens** with the uploaded image in the live preview.
- The editor canvas behind it is **unchanged** (still blank/previous) until you click **Apply changes** in Resize & Process.
- After **Apply changes**, the canvas updates to the processed sprite at the chosen size.

- [ ] **Step 6: Verify the studio AI flow — staged, canvas untouched**

On the **AI Generate** tab, enter a prompt and click **Generate sprite**. Confirm:
- The spinner shows in the Generate modal during generation.
- On success the Generate modal closes and **Resize & Process opens** with the generated image; the canvas is unchanged until **Apply changes**.

- [ ] **Step 7: Verify the hero (front page) regression — unchanged**

Navigate to `/`. In the hero entry widget confirm:
- **Three** tabs still present (AI Generate / Upload Image / Draw Blank).
- Asset type **and** the Width/Height size inputs are shown (preset chips still hidden, quality picker still hidden — matching the prior hero).
- Uploading or generating commits to the canvas and **navigates into the studio** (the old behavior), and **Draw Blank** starts a blank canvas and navigates in.

- [ ] **Step 8: Final confirmation**

If all checks pass, the feature is complete. If any check fails, debug from the relevant source file, fix, re-run Steps 1–2, and re-verify. (No commit needed unless a fix was made — then commit the fix with a descriptive message.)

---

## Self-review notes (already reconciled)

- **Spec coverage:** Draw Blank removed in studio (Task 4 STUDIO_TABS); size removed in studio (Task 1 `showSize={false}` + Task 4 asset block); asset type kept on AI tab (Task 4); upload = dropzone + button only (Task 4 upload branch); generate/upload stage + open Resize (Tasks 2–4); auto-advance + kept "Process image" button (Task 4 `handleStudioUpload` + upload button); hero untouched (Task 4 hero branch + `surface="hero"`).
- **Type consistency:** `stageSource(file: File)` defined in Task 2, exported in Task 2 Step 5, consumed in Task 4. `onFile?: (file: File) => void` defined in Task 3, passed in Task 4. `generateAIImageAndConvertToSprite(options?: { commit?: boolean })` defined in Task 2, called with `{ commit: false }` / `undefined` in Task 4. `GenerateModal` gains a required `onSuccess: () => void` (Task 4 Step 2) provided by `StudioPage` (Task 4 Step 3).
- **No placeholders:** every code step shows full content; no TBD/TODO.
