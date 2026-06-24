# Asset-Type Presets Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Sprite / Background / Tile a first-class choice (top-level tabs) that drives one source-of-truth preset (size + fit + background-removal), applied on type change so generation, upload, and the Resize & Process modal all open with the correct defaults per type.

**Architecture:** A single `ASSET_PRESETS` map (client-only) is the canonical per-type default. `PostProcessingContext` defaults read from it. A `useApplyAssetPreset()` hook pushes a type's preset into the canvas-size + post-processing + OpenAI contexts, driven by one effect inside a new `AssetTypeTabs` component. The dead pre-generation size picker (`AssetOptionsSelection` + `SizeInputs`/`SizeInput`) is removed.

**Tech Stack:** React 19 + TypeScript, Bun bundler + `bun test` (happy-dom + React Testing Library), Tailwind CSS 3. Spec: `docs/superpowers/specs/2026-06-21-asset-type-presets-design.md`.

## Global Constraints

- **Client only.** No edits to `shared/` or `server/`. The wire contract is unchanged (`assetType` and `size` already cross the network).
- **No new asset types in the UI** — tabs expose only `AssetType.Sprite`, `AssetType.Background`, `AssetType.Tile` (the existing `ALL_ASSETS_TYPE`).
- **Per-type defaults (the single source of truth):** Sprite → 64×64, `crop: Edges`, `removeBackground: true`; Background → 160×120, `crop: Fill`, `removeBackground: false`; Tile → 16×16, `crop: Fill`, `removeBackground: false`. `tolerance: 30` for all.
- **Use `if`/`else` (or guard clauses), never `switch`,** in new code (project owner preference).
- **Test command (run from repo root):** `bun run --filter client test`. **Typecheck:** `bun run --filter client typecheck`. Test files live beside source as `*.test.ts(x)` and import helpers from `client/src/test/test-utils`.
- **Commit note:** if the shared fallow pre-commit gate blocks a commit because of *unrelated* in-progress sibling work on the branch (e.g. `ColorMenu.tsx`/`PopoverMenu.tsx`), the code + tests for each task are still done in order; batch the commits once the branch is green. Do not "fix" sibling files to satisfy the gate.

---

### Task 1: Asset presets source of truth

**Files:**
- Create: `client/src/config/assetPresets.ts`
- Test: `client/src/config/assetPresets.test.ts`

**Interfaces:**
- Consumes: `AssetType`, `Crop`, `PostProcessingSettings` from `client/src/types/export`.
- Produces:
  - `interface AssetPreset { defaultSize: { width: number; height: number }; postProcessing: PostProcessingSettings }`
  - `const ASSET_PRESETS: Partial<Record<AssetType, AssetPreset>>`
  - `function getAssetPreset(type: AssetType): AssetPreset` — returns the Sprite preset for any type not in the map.

- [ ] **Step 1: Write the failing test**

Create `client/src/config/assetPresets.test.ts`:

```ts
import { describe, it, expect } from "bun:test";
import { AssetType, Crop } from "../types/export";
import { getAssetPreset } from "./assetPresets";

describe("getAssetPreset", () => {
  it("returns the Sprite preset (64×64, trim edges, remove background)", () => {
    expect(getAssetPreset(AssetType.Sprite)).toEqual({
      defaultSize: { width: 64, height: 64 },
      postProcessing: { removeBackground: true, crop: Crop.Edges, tolerance: 30 },
    });
  });

  it("returns the Background preset (160×120, fill, keep background)", () => {
    expect(getAssetPreset(AssetType.Background)).toEqual({
      defaultSize: { width: 160, height: 120 },
      postProcessing: { removeBackground: false, crop: Crop.Fill, tolerance: 30 },
    });
  });

  it("returns the Tile preset (16×16, fill, keep background)", () => {
    expect(getAssetPreset(AssetType.Tile)).toEqual({
      defaultSize: { width: 16, height: 16 },
      postProcessing: { removeBackground: false, crop: Crop.Fill, tolerance: 30 },
    });
  });

  it("falls back to the Sprite preset for types not in the map", () => {
    expect(getAssetPreset(AssetType.Tilemap)).toEqual(getAssetPreset(AssetType.Sprite));
    expect(getAssetPreset(AssetType.Animation)).toEqual(getAssetPreset(AssetType.Sprite));
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `bun run --filter client test assetPresets`
Expected: FAIL — `Cannot find module "./assetPresets"` (file not created yet).

- [ ] **Step 3: Write the implementation**

Create `client/src/config/assetPresets.ts`:

```ts
// Single source of truth for per-asset-type defaults (client-only — these are UI
// + post-processing defaults, not wire data). When a tab is selected,
// useApplyAssetPreset pushes the matching preset into the canvas-size and
// post-processing contexts. PostProcessingContext's defaults also read from here.
import { AssetType, Crop } from "../types/export";
import type { PostProcessingSettings } from "../types/export";

export interface AssetPreset {
  /** Canvas size applied when this asset type is selected. */
  defaultSize: { width: number; height: number };
  /** Post-processing defaults fed to PostProcessingContext.resetToDefaults. */
  postProcessing: PostProcessingSettings;
}

export const ASSET_PRESETS: Partial<Record<AssetType, AssetPreset>> = {
  [AssetType.Sprite]: {
    defaultSize: { width: 64, height: 64 },
    postProcessing: { removeBackground: true, crop: Crop.Edges, tolerance: 30 },
  },
  [AssetType.Background]: {
    defaultSize: { width: 160, height: 120 },
    postProcessing: { removeBackground: false, crop: Crop.Fill, tolerance: 30 },
  },
  [AssetType.Tile]: {
    defaultSize: { width: 16, height: 16 },
    postProcessing: { removeBackground: false, crop: Crop.Fill, tolerance: 30 },
  },
};

/** Look up a preset, falling back to Sprite for any type not in the map
 *  (e.g. Tilemap/Animation, which the UI never selects). */
export function getAssetPreset(type: AssetType): AssetPreset {
  return ASSET_PRESETS[type] ?? ASSET_PRESETS[AssetType.Sprite]!;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `bun run --filter client test assetPresets`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add client/src/config/assetPresets.ts client/src/config/assetPresets.test.ts
git commit -m "feat(client): add asset-type preset source of truth"
```

---

### Task 2: PostProcessing defaults read from the preset

**Files:**
- Modify: `client/src/context/PostProcessingContext/getDefaultSettings.ts` (full rewrite — currently 31 lines)
- Test: `client/src/context/PostProcessingContext/getDefaultSettings.test.ts`

**Interfaces:**
- Consumes: `getAssetPreset` from Task 1.
- Produces: `getDefaultPostProcessingSettings(assetType: AssetType): PostProcessingSettings` (unchanged signature) now delegating to the preset. **Behavior change:** Tile now returns `crop: Fill` (was `Crop.Edges`).

- [ ] **Step 1: Write the failing test**

Create `client/src/context/PostProcessingContext/getDefaultSettings.test.ts`:

```ts
import { describe, it, expect } from "bun:test";
import { AssetType, Crop } from "../../types/export";
import { getDefaultPostProcessingSettings } from "./getDefaultSettings";

describe("getDefaultPostProcessingSettings", () => {
  it("Sprite: trim edges, remove background", () => {
    expect(getDefaultPostProcessingSettings(AssetType.Sprite)).toEqual({
      removeBackground: true,
      crop: Crop.Edges,
      tolerance: 30,
    });
  });

  it("Background: fill, keep background", () => {
    expect(getDefaultPostProcessingSettings(AssetType.Background)).toEqual({
      removeBackground: false,
      crop: Crop.Fill,
      tolerance: 30,
    });
  });

  it("Tile: fill, keep background (crop is Fill, not Edges)", () => {
    expect(getDefaultPostProcessingSettings(AssetType.Tile)).toEqual({
      removeBackground: false,
      crop: Crop.Fill,
      tolerance: 30,
    });
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `bun run --filter client test getDefaultSettings`
Expected: FAIL on the Tile case — current code returns `crop: Crop.Edges` for Tile.

- [ ] **Step 3: Write the implementation**

Replace the entire contents of `client/src/context/PostProcessingContext/getDefaultSettings.ts` with:

```ts
import type { AssetType } from "../../types/export";
import type { PostProcessingSettings } from "../../types/export";
import { getAssetPreset } from "../../config/assetPresets";

// PostProcessing defaults per asset type — sourced from the single ASSET_PRESETS
// map so size + post-processing defaults can never drift apart.
export const getDefaultPostProcessingSettings = (
  assetType: AssetType
): PostProcessingSettings => getAssetPreset(assetType).postProcessing;
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `bun run --filter client test getDefaultSettings`
Expected: PASS (3 tests).

- [ ] **Step 5: Typecheck (the reducer in `PostProcessingContext.tsx` still calls this with `(assetType)` — confirm nothing broke)**

Run: `bun run --filter client typecheck`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add client/src/context/PostProcessingContext/getDefaultSettings.ts client/src/context/PostProcessingContext/getDefaultSettings.test.ts
git commit -m "refactor(client): source PostProcessing defaults from asset presets"
```

---

### Task 3: `useApplyAssetPreset` hook

**Files:**
- Create: `client/src/hooks/useApplyAssetPreset.ts`
- Test: `client/src/hooks/useApplyAssetPreset.test.tsx`

**Interfaces:**
- Consumes: `getAssetPreset` (Task 1); `useCanvasSize` (`{ setWidth, setHeight }`), `usePostProcessing` (`{ resetToDefaults }`), `useOpenAISettings` (`{ resetToDefaults }`).
- Produces: `useApplyAssetPreset(): (type: AssetType) => void` — a stable callback that sets canvas size from the preset and resets the post-processing + OpenAI settings to that type's defaults.

- [ ] **Step 1: Write the failing test**

Create `client/src/hooks/useApplyAssetPreset.test.tsx`:

```tsx
import { describe, it, expect } from "bun:test";
import { act, renderHookWithProviders } from "../test/test-utils";
import { AssetType, Crop } from "../types/export";
import { useApplyAssetPreset } from "./useApplyAssetPreset";
import { useCanvasSize } from "../context/CanvasSizeContext/useCanvasSize";
import { usePostProcessing } from "../context/PostProcessingContext/usePostProcessing";

describe("useApplyAssetPreset", () => {
  it("applies the Background preset to canvas size + post-processing", () => {
    const { result } = renderHookWithProviders(() => ({
      apply: useApplyAssetPreset(),
      size: useCanvasSize(),
      pp: usePostProcessing(),
    }));

    act(() => {
      result.current.apply(AssetType.Background);
    });

    expect(result.current.size.width).toBe(160);
    expect(result.current.size.height).toBe(120);
    expect(result.current.pp.settings.removeBackground).toBe(false);
    expect(result.current.pp.settings.crop).toBe(Crop.Fill);
  });

  it("applies the Sprite preset (64×64, remove background)", () => {
    const { result } = renderHookWithProviders(() => ({
      apply: useApplyAssetPreset(),
      size: useCanvasSize(),
      pp: usePostProcessing(),
    }));

    act(() => {
      result.current.apply(AssetType.Sprite);
    });

    expect(result.current.size.width).toBe(64);
    expect(result.current.size.height).toBe(64);
    expect(result.current.pp.settings.removeBackground).toBe(true);
    expect(result.current.pp.settings.crop).toBe(Crop.Edges);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `bun run --filter client test useApplyAssetPreset`
Expected: FAIL — `Cannot find module "./useApplyAssetPreset"`.

- [ ] **Step 3: Write the implementation**

Create `client/src/hooks/useApplyAssetPreset.ts`:

```ts
import { useCallback } from "react";
import type { AssetType } from "../types/export";
import { getAssetPreset } from "../config/assetPresets";
import { useCanvasSize } from "../context/CanvasSizeContext/useCanvasSize";
import { usePostProcessing } from "../context/PostProcessingContext/usePostProcessing";
import { useOpenAISettings } from "../context/OpenAISettingsContext/useOpenAISettings";

/**
 * Returns a stable callback that pushes an asset type's preset into the shared
 * contexts: canvas size, post-processing (removeBackground / crop / tolerance),
 * and the OpenAI settings' `assetType` field. The Resize & Process modal and the
 * AI generate call read these contexts, so this is the one place a type's defaults
 * are applied. OpenAI's reset preserves the typed prompt.
 */
export const useApplyAssetPreset = () => {
  const { setWidth, setHeight } = useCanvasSize();
  const { resetToDefaults: resetPostProcessing } = usePostProcessing();
  const { resetToDefaults: resetOpenAISettings } = useOpenAISettings();

  return useCallback(
    (type: AssetType) => {
      const { defaultSize } = getAssetPreset(type);
      setWidth(defaultSize.width);
      setHeight(defaultSize.height);
      resetPostProcessing(type);
      resetOpenAISettings(type);
    },
    [setWidth, setHeight, resetPostProcessing, resetOpenAISettings]
  );
};
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `bun run --filter client test useApplyAssetPreset`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add client/src/hooks/useApplyAssetPreset.ts client/src/hooks/useApplyAssetPreset.test.tsx
git commit -m "feat(client): add useApplyAssetPreset hook"
```

---

### Task 4: `AssetTypeTabs` component

**Files:**
- Create: `client/src/components/GenerationControls/AssetTypeTabs.tsx`
- Test: `client/src/components/GenerationControls/AssetTypeTabs.test.tsx`

**Interfaces:**
- Consumes: `SegmentedControl` + `SegmentOption` from `client/src/components/SegmentedControl`; `useAssetType` (`{ selectedAsset, setSelectedAsset }`); `useApplyAssetPreset` (Task 3); `useLoading` (`{ isGenerating }`); `ALL_ASSETS_TYPE`, `AssetType` from `client/src/types/export`.
- Produces: default export `AssetTypeTabs` — a segmented control of the three asset types that, via one effect on `selectedAsset`, applies the preset.

- [ ] **Step 1: Write the failing test**

Create `client/src/components/GenerationControls/AssetTypeTabs.test.tsx`:

```tsx
import { describe, it, expect } from "bun:test";
import { renderWithProviders, screen, fireEvent, waitFor } from "../../test/test-utils";
import { Crop } from "../../types/export";
import { usePostProcessing } from "../../context/PostProcessingContext/usePostProcessing";
import { useCanvasSize } from "../../context/CanvasSizeContext/useCanvasSize";
import AssetTypeTabs from "./AssetTypeTabs";

// Probe renders the live context values so the test can assert the effect ran.
function Probe() {
  const { settings } = usePostProcessing();
  const { width, height } = useCanvasSize();
  return (
    <div>
      <span data-testid="size">{`${width}x${height}`}</span>
      <span data-testid="removeBg">{String(settings.removeBackground)}</span>
      <span data-testid="crop">{settings.crop}</span>
    </div>
  );
}

describe("AssetTypeTabs", () => {
  it("renders a tab per asset type and applies the Sprite preset on mount", async () => {
    renderWithProviders(
      <>
        <AssetTypeTabs />
        <Probe />
      </>
    );

    expect(screen.getByRole("radio", { name: "Sprite" })).toBeTruthy();
    expect(screen.getByRole("radio", { name: "Background" })).toBeTruthy();
    expect(screen.getByRole("radio", { name: "Tile" })).toBeTruthy();

    await waitFor(() => {
      expect(screen.getByTestId("size").textContent).toBe("64x64");
    });
    expect(screen.getByTestId("removeBg").textContent).toBe("true");
  });

  it("applies the Background preset when the Background tab is clicked", async () => {
    renderWithProviders(
      <>
        <AssetTypeTabs />
        <Probe />
      </>
    );

    fireEvent.click(screen.getByRole("radio", { name: "Background" }));

    await waitFor(() => {
      expect(screen.getByTestId("size").textContent).toBe("160x120");
    });
    expect(screen.getByTestId("removeBg").textContent).toBe("false");
    expect(screen.getByTestId("crop").textContent).toBe(Crop.Fill);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `bun run --filter client test AssetTypeTabs`
Expected: FAIL — `Cannot find module "./AssetTypeTabs"`.

- [ ] **Step 3: Write the implementation**

Create `client/src/components/GenerationControls/AssetTypeTabs.tsx`:

```tsx
import { useEffect } from "react";
import SegmentedControl, { type SegmentOption } from "../SegmentedControl";
import { useAssetType } from "../../context/AssetTypeContext/useAssetType";
import { useApplyAssetPreset } from "../../hooks/useApplyAssetPreset";
import { useLoading } from "../../context/LoadingContext/useLoading";
import { AssetType, ALL_ASSETS_TYPE } from "../../types/export";

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const ASSET_TABS: SegmentOption<AssetType>[] = ALL_ASSETS_TYPE.map((type) => ({
  value: type,
  label: cap(type),
}));

/**
 * Top-level asset-type selector (Sprite / Background / Tile). Picking a type is
 * the first choice in the generation flow: the effect applies that type's preset
 * (size + fit + background-removal) so generation, upload, and Resize & Process
 * all use the right defaults. Lives in the generation surface only — it sets the
 * NEXT sprite's target, never the live editor canvas.
 */
export default function AssetTypeTabs() {
  const { selectedAsset, setSelectedAsset } = useAssetType();
  const applyAssetPreset = useApplyAssetPreset();
  const { isGenerating } = useLoading();

  // Single apply path: any time the selected type changes (including initial
  // mount), push its preset into the shared contexts.
  useEffect(() => {
    applyAssetPreset(selectedAsset);
  }, [selectedAsset, applyAssetPreset]);

  return (
    <SegmentedControl
      options={ASSET_TABS}
      value={selectedAsset}
      onChange={setSelectedAsset}
      ariaLabel="Asset type"
      stretch
      disabled={isGenerating}
    />
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `bun run --filter client test AssetTypeTabs`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add client/src/components/GenerationControls/AssetTypeTabs.tsx client/src/components/GenerationControls/AssetTypeTabs.test.tsx
git commit -m "feat(client): add AssetTypeTabs selector"
```

---

### Task 5: Swap the selector — wire tabs, drop the dead dropdown path

This task lands together so there is never an intermediate state with unused
(dead) code: mounting the tabs, removing the old dropdown usage + its now-redundant
reset effect, deleting the orphaned components, and dropping the dead size constants.

**Files:**
- Modify: `client/src/components/GenerationControls/GenerationControls.tsx`
- Modify: `client/src/features/InputSection/GenerationMethodSection/TextToSpriteSection/components/OpenAISettingsSection.tsx`
- Modify: `client/src/types/pixel.ts`
- Delete: `client/src/features/InputSection/components/AssetOptionsSelection.tsx`
- Delete: `client/src/features/InputSection/components/SizeInputs.tsx`
- Delete: `client/src/features/InputSection/components/SizeInput.tsx`

**Interfaces:**
- Consumes: `AssetTypeTabs` (Task 4).
- Produces: no new exports. After this task, `selectedAsset` is set via the tabs; `useApplyAssetPreset` is the only thing that resets PostProcessing/OpenAI on type change.

- [ ] **Step 1: Mount `AssetTypeTabs` in `GenerationControls` and remove the dropdown**

In `client/src/components/GenerationControls/GenerationControls.tsx`:

Replace the import line:
```tsx
import AssetOptionsSelection from "../../features/InputSection/components/AssetOptionsSelection";
```
with:
```tsx
import AssetTypeTabs from "./AssetTypeTabs";
```

Add the tabs as the first child of the root container — change the opening of the returned JSX from:
```tsx
  return (
    <div className="space-y-4">
      {/* Tabs — hero adds Draw Blank; studio is AI + Upload only. */}
      <SegmentedControl
```
to:
```tsx
  return (
    <div className="space-y-4">
      {/* Asset type — the first choice; drives the per-type preset. Shown on all
          input methods and both surfaces. */}
      <AssetTypeTabs />

      {/* Tabs — hero adds Draw Blank; studio is AI + Upload only. */}
      <SegmentedControl
```

Remove the old asset-type block (the dropdown shown only on the AI tab):
```tsx
      {/* Asset type — AI Generate tab only (no size; final dimensions are chosen
          in Resize & Process). Identical on both surfaces. */}
      {activeMethod === GenerationMethod.TextToSprite && (
        <AssetOptionsSelection showSize={false} />
      )}
```
Delete those five lines entirely.

- [ ] **Step 2: Remove the now-redundant reset effect from `OpenAISettingsSection`**

`useApplyAssetPreset` now resets the OpenAI settings on every type change, so the
section's own effect is redundant. Replace the entire contents of
`client/src/features/InputSection/GenerationMethodSection/TextToSpriteSection/components/OpenAISettingsSection.tsx` with:

```tsx
// Component imports
import AiPromptInput from "../components/AiPromptInput";

// Hooks imports
import { useOpenAISettings } from "../../../../../context/OpenAISettingsContext/useOpenAISettings";
import { useLoading } from "../../../../../context/LoadingContext/useLoading";

/** Text-to-sprite input. Generation quality is forced to "low" server-side
 *  (Medium/High were removed), so there is no quality picker — just the prompt.
 *  Per-asset-type settings (incl. the OpenAI `assetType`) are reset centrally by
 *  AssetTypeTabs → useApplyAssetPreset, so this section no longer resets them. */
const OpenAISettingsSection = () => {
  const { updateSetting } = useOpenAISettings();
  const { isGenerating } = useLoading();

  return (
    <div className="form-group">
      <AiPromptInput
        onSubmit={(prompt) => updateSetting("prompt", prompt)}
        disabled={isGenerating}
      />
    </div>
  );
};

export default OpenAISettingsSection;
```

- [ ] **Step 3: Delete the orphaned components**

```bash
git rm client/src/features/InputSection/components/AssetOptionsSelection.tsx \
       client/src/features/InputSection/components/SizeInputs.tsx \
       client/src/features/InputSection/components/SizeInput.tsx
```

- [ ] **Step 4: Drop the dead size constants from `pixel.ts`**

In `client/src/types/pixel.ts`, delete these lines (the first two were only read by
the deleted `AssetOptionsSelection`; `DEFAULT_PROCESS_SIZE` was already unused):

```ts
export const BACKGROUND_SIZE = { x: 160, y: 120 };
export const TILE_SIZE = { x: 16, y: 16 };

// Square size seeded into Resize & Process for a freshly staged image source
// (an upload or an AI generation). The studio generate/upload flow owns no
// sizing — final dimensions are chosen in Resize & Process — so this is the
// size that panel opens at the first time after staging.
export const DEFAULT_PROCESS_SIZE = 64;
```

Leave the rest of `pixel.ts` (`Coordinates`, `MAX_LENGTH`, `MIN_LENGTH`,
`STROKE_SIZES`, `StrokeSize`) unchanged.

- [ ] **Step 5: Typecheck — confirm nothing imports the deleted modules/constants**

Run: `bun run --filter client typecheck`
Expected: no errors. (If a `Cannot find name 'BACKGROUND_SIZE'`/`module` error appears, an unexpected importer exists — grep for it and remove the usage before continuing.)

- [ ] **Step 6: Build — confirm the bundle compiles**

Run: `bun run --filter client build`
Expected: build completes with no errors.

- [ ] **Step 7: Run the full client test suite**

Run: `bun run --filter client test`
Expected: PASS (Tasks 1–4 specs + the existing `infra.test.tsx`).

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat(client): replace asset-type dropdown with top-level tabs; remove dead size picker"
```

---

### Task 6: Add an 8×8 preset chip to Resize & Process (tile quick option)

**Files:**
- Modify: `client/src/pages/StudioPage/modals/ResizeProcessModal.tsx:24-33` (the `PRESETS` array)

**Interfaces:**
- Consumes: nothing new. Produces: nothing new — extends the existing size-preset list.

- [ ] **Step 1: Add the 8×8 entry**

In `client/src/pages/StudioPage/modals/ResizeProcessModal.tsx`, change the start of
the `PRESETS` array from:
```tsx
const PRESETS: { w: number; h: number }[] = [
  { w: 16, h: 16 },
```
to:
```tsx
const PRESETS: { w: number; h: number }[] = [
  { w: 8, h: 8 },
  { w: 16, h: 16 },
```

- [ ] **Step 2: Typecheck**

Run: `bun run --filter client typecheck`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add client/src/pages/StudioPage/modals/ResizeProcessModal.tsx
git commit -m "feat(client): add 8x8 size preset to Resize & Process (tile quick option)"
```

---

## Final verification (after all tasks)

- [ ] **Full test + typecheck from repo root**

Run: `bun run --filter client test && bun run --filter client typecheck`
Expected: all client specs pass; typecheck clean.

- [ ] **Manual smoke (dev-chrome on port 3002)**

1. Hero loads with the Sprite | Background | Tile tabs above the AI/Upload/Draw toggle; Sprite selected.
2. Select **Background**, generate or upload → Resize & Process opens at **160×120**, crop **Fill**, **Remove background OFF**.
3. Select **Tile**, upload → Resize & Process opens at **16×16**, crop **Fill**; the **8×8** chip is present and one-click switches to 8×8.
4. Select **Sprite** → Resize & Process opens at **64×64**, crop **Trim edges**, **Remove background ON**.
5. The choice persists hero → studio (generate from hero, land in studio with the same type's defaults applied).
