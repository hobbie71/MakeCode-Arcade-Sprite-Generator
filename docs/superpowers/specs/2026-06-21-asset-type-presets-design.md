# Asset-Type Presets — Design Spec

- **Date:** 2026-06-21
- **Status:** Approved (design); corrected against the real code during planning
- **Branch:** `ui-tweaks`
- **Scope:** Client only. No wire-contract, `shared/`, or `server/` changes.

> **Planning correction (2026-06-21):** the initial draft was based on an
> exploration summary that mis-described the staging flow. Reading the real code
> changed the root-cause analysis and shrank the change. Corrections are folded in
> below; see **Root cause (verified)** and **Files touched**.

## Problem

When a user creates a sprite, the per-asset-type defaults aren't applied at the
moment that matters, and asset type is buried in a dropdown inside the AI tab.
Generating a **Background** still strips its background and opens **Resize &
Process** at the wrong size; a **Tile** doesn't lock to 16×16. The right defaults
should follow from the chosen asset type automatically.

### Root cause (verified against the code)

1. **PostProcessing defaults are never re-applied per asset type.** The shared
   settings reducer exposes `resetToDefaults(assetType)`
   (`client/src/context/settingsContext.ts`), but it is called **only for OpenAI
   settings** (`OpenAISettingsSection.tsx:19-21`). **`PostProcessingContext`'s
   `resetToDefaults` is never called anywhere.** So post-processing stays at its
   initial value (`removeBackground: true, crop: Edges` — the Sprite defaults) for
   the whole session, which is why a Background still gets its background removed.
2. **The size-lock path is dormant.** Background/Tile sizes are only applied by
   `AssetOptionsSelection`'s `fixedSize` effect, which runs **only when
   `showSize` is true** (`AssetOptionsSelection.tsx:110-116` →
   `SizeInputs.tsx:21-36`). `GenerationControls` renders it with
   **`showSize={false}`** (`GenerationControls.tsx:204`), so that effect never
   runs in the live flow and the canvas size stays at the context default (16×16)
   regardless of type.
3. **`DEFAULT_PROCESS_SIZE` is dead code** (no references) and `stageSource` does
   **not** touch canvas size (`useImageFileHandler.ts:73-79`).

## Goals

1. One **single source of truth** for every per-asset-type default (size + the
   post-processing trio: removeBackground, crop/fit, tolerance).
2. **Apply it on asset-type change** so generation, upload, and the Resize &
   Process modal all use the correct values for the chosen type.
3. Make asset type a **first-class, prominent** choice: top-level tabs
   (Sprite | Background | Tile) shared across all input methods.

## Non-goals

- No wire-contract change. `assetType` and `size` already travel to the server.
  `shared/` and `server/` are untouched.
- No new asset types in the UI (`Tilemap`/`Animation` stay out of the tabs).
- No rework of the Resize & Process modal beyond adding an 8×8 preset chip.
- No resurrection of the (currently dead) pre-generation size picker.

## Decisions (from brainstorming)

| Question | Decision |
|---|---|
| Selector UX | **Top-level tabs**, shared across AI Generate / Upload / Draw Blank |
| Strictness | **Smart defaults, overridable** in the Resize & Process modal |
| Tile sizes | **Default 16×16, with a one-click 8×8** (added to the Resize modal presets) |
| Storage/apply | **Approach A** — single `ASSET_PRESETS` map + one apply hook (no new provider) |
| Tile fit | Tile gets **`crop: Fill`** (opaque squares that fill the cell) — new vs. today |
| Sprite default size | **64×64** — sensible default for the common case; chips in the Resize modal still offer 8/16/24/32/48/64 |

## Design

### 1. Data model — single source of truth

New client-only module `client/src/config/assetPresets.ts` (neutral location so a
top-level context and a component can both import it without a context→feature
dependency).

```ts
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

/** Lookup with a Sprite fallback for any type not in the map (Tilemap/Animation). */
export function getAssetPreset(type: AssetType): AssetPreset {
  return ASSET_PRESETS[type] ?? ASSET_PRESETS[AssetType.Sprite]!;
}
```

The interface is intentionally just `defaultSize + postProcessing` — there is no
pre-generation size picker to feed size-chip/free-size metadata, so adding those
fields now would be unused (YAGNI). Note `pixel.ts` constants use `{ x, y }`; the
preset uses `{ width, height }` to match the canvas-size context and the wire.

**What folds into the map (de-duplication that removes the drift bug):**

| Today (scattered / dead) | After |
|---|---|
| `pixel.ts`: `BACKGROUND_SIZE`, `TILE_SIZE`, `DEFAULT_PROCESS_SIZE` | removed — sizes live in `ASSET_PRESETS` (the first two were only read by the deleted size UI; the third was dead) |
| `getDefaultSettings.ts` (PostProcessing): per-type `if` branches | `return getAssetPreset(assetType).postProcessing` |
| Background/Tile size-lock in `AssetOptionsSelection` (dead via `showSize={false}`) | gone — `applyAssetPreset` sets size on type change |

### 2. UI

- **New `AssetTypeTabs`** (`client/src/components/GenerationControls/AssetTypeTabs.tsx`)
  — a `SegmentedControl<AssetType>` of Sprite | Background | Tile, rendered at the
  **top of `GenerationControls`**, above the AI / Upload / Draw method toggle. It
  shows on both surfaces (hero card + Studio Generate modal) and across all input
  methods. It is **not** on the Studio editor toolbar, so switching type sets up
  the next stage/generation and never resizes live artwork.
- **`GenerationControls`** renders `<AssetTypeTabs />` at the top and **drops**
  the old `<AssetOptionsSelection showSize={false} />` line.
- **Delete** the now-unused `AssetOptionsSelection.tsx` and its now-orphaned
  `SizeInputs.tsx` / `SizeInput.tsx` (verified: `AssetOptionsSelection` is imported
  only by `GenerationControls`; `SizeInputs`/`SizeInput` are used only by it).
  `DefaultDropDown` stays (also used by `PalettePanel`).
- **Resize & Process modal**: add `{ w: 8, h: 8 }` to its `PRESETS` array so a tile
  user can one-click 8×8 (the modal is where size is chosen).

### 3. Data flow — one apply path

A small hook `useApplyAssetPreset()` (`client/src/hooks/useApplyAssetPreset.ts`)
returns a stable `applyAssetPreset(type)` that:

1. `setWidth(preset.defaultSize.width)` / `setHeight(preset.defaultSize.height)`
   on `CanvasSizeContext`.
2. `postProcessing.resetToDefaults(type)` — **the fix**: post-processing now tracks
   the asset type (defaults sourced from `ASSET_PRESETS` via `getDefaultSettings`).
3. `openAISettings.resetToDefaults(type)` — keeps the wire `assetType` field synced
   and preserves the typed prompt (`getDefaultOpenAISettings` preserves it).

`AssetTypeTabs` drives it with a single effect, mirroring the existing pattern in
`OpenAISettingsSection`:

```tsx
const { selectedAsset, setSelectedAsset } = useAssetType();
const applyAssetPreset = useApplyAssetPreset();
useEffect(() => { applyAssetPreset(selectedAsset); }, [selectedAsset, applyAssetPreset]);
```

This single effect covers every consumer: it sets canvas size (read by the
generate call and by the Resize modal's seed) and resets post-processing + OpenAI
on every type set, including initial mount (applies the Sprite 64×64 default).
Because the effect lives in the always-mounted tabs, **the redundant
`resetToDefaults` effect in `OpenAISettingsSection` is removed** so there is one
apply path, not two.

**Persistence (hero → studio):** `AssetTypeContext`, `CanvasSizeContext`,
`PostProcessingContext`, `OpenAISettingsContext` all live in `GlobalProviders`
(above the router — verified), so the hero's choice carries into the Studio.

## Edge cases

- **Unknown asset type** (`Tilemap`/`Animation`) → `getAssetPreset` falls back to
  the Sprite preset. Tabs only expose the 3.
- **Switching type** resets size/fit/bg to that type's defaults — intended; affects
  only the next stage/generation, never live artwork (tabs live in the generation
  surface; only `CanvasSizeContext` — the *target* — is set, not `SpriteContext`).
- **Manual override survives once the modal is open** — `applyAssetPreset` seeds the
  starting values; the Resize & Process controls still let the user change anything
  before Apply.
- **Opening the Studio Generate modal** re-applies the current type's preset on
  mount (sets the target size + post-processing). Desirable — the modal presents
  type defaults — and it does not touch the existing edited sprite.

## Testing

The client suite was removed in the redesign, but the harness (happy-dom + RTL +
`bun:test`) is live; new specs drop in beside components.

- **Pure-logic:** `getAssetPreset` — each type yields the right size + post-processing;
  fallback returns the Sprite preset.
- **Parity:** `getDefaultPostProcessingSettings(type)` returns the same values as
  before the refactor, except the intended Tile `crop: Fill` change.
- **One RTL test:** rendering `AssetTypeTabs` and clicking a tab applies the preset
  to the canvas-size + post-processing contexts.
- Run full `bun run test` + `bun run typecheck` to confirm `shared`/`server` are
  unaffected and nothing imports the deleted modules.

## Files touched

- **New:** `client/src/config/assetPresets.ts`
- **New:** `client/src/hooks/useApplyAssetPreset.ts`
- **New:** `client/src/components/GenerationControls/AssetTypeTabs.tsx` (+ test)
- **Modify:** `client/src/context/PostProcessingContext/getDefaultSettings.ts` — delegate to preset
- **Modify:** `client/src/components/GenerationControls/GenerationControls.tsx` — mount the tabs, drop the dropdown
- **Modify:** `client/src/features/.../OpenAISettingsSection.tsx` — remove the redundant reset effect
- **Modify:** `client/src/pages/StudioPage/modals/ResizeProcessModal.tsx` — add the 8×8 preset chip
- **Modify:** `client/src/types/pixel.ts` — remove `BACKGROUND_SIZE`, `TILE_SIZE`, `DEFAULT_PROCESS_SIZE`
- **Delete:** `client/src/features/InputSection/components/AssetOptionsSelection.tsx`, `SizeInputs.tsx`, `SizeInput.tsx`
