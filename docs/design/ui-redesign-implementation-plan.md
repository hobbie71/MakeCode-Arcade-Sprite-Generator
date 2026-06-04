# UI Redesign — Implementation Plan

The phased build plan for the **client-only** redesign. Execute **after** the visual design is locked (see `redesign-mockup.tsx`). Builds to the decisions in [ADR-0006](../adr/0006-client-ui-redesign.md).

## Context

The app works but the UI reads as amateur: it drops straight into a dense single screen with a cramped seven-section left settings rail, the editor in the middle, and a tall always-on export section below the fold — everything visible at once, no framing of what the product is. We are redesigning the **entire workflow and visual identity** of the client (React 19 + TS, Bun bundler, Tailwind 3) into a modern, high-quality experience.

This is a **client-only** change. The server and the `shared/` Zod wire contract are **untouched**. No database, no auth (the app stays stateless/browser-only).

## Target architecture

### Routing (new)

Add `react-router-dom` (component API: `BrowserRouter` + `Routes` + `Route`). Real routes give the hero its own title/meta for SEO + ad-landing. All three serve paths (`bun index.html` dev, `serve.ts` Docker, `serve -s dist` start) already do SPA fallback — **no build/serve changes needed**.

```
/         → HeroPage    (markets + inline entry widget; redirects to /studio if hasVisited)
/studio   → StudioPage  (the editor shell; owns the three modals)
*         → redirect to /
```

### Page & shell structure

- `main.tsx` — wrap in `<BrowserRouter>`; import `base.css` **before** `tailwind.gen.css` (tokens must precede utilities in the cascade).
- `App.tsx` — becomes a thin route shell: `<GlobalProviders>` + `<Routes>` + global overlays (`LoadingOverlay`, `Error`) rendered outside routes so they survive navigation.
- `pages/HeroPage/` — `HeroPage.tsx` (+ `HeroEntryWidget`, `ExampleGallery`, `HowItWorks`). `hasVisited` redirect on mount.
- `pages/StudioPage/` — `StudioPage.tsx` owns the three modals' open/close state; renders the editor (`EditorSurface`) and passes `onOpenGenerate` / `onOpenResize` / `onOpenExport` callbacks into it.

### Providers

Split `providers/AppProviders.tsx` → `providers/GlobalProviders.tsx` (everything that must survive hero→studio navigation: Sprite, CanvasSize, PaletteSelected, Canvas, Loading, Error, ImageImport, PostProcessing, OpenAISettings, AssetType, GenerationMethod, AiModel, PreviewCanvas, **+ new TokenContext stub**). Editor-local contexts (Tool, Color, Zoom, Selection, MouseCoords, StrokeSize, + new optional ShapeMode) stay inside `SpriteEditorProvider`.

### Design tokens (the visual core)

- Declare semantic tokens as CSS variables in `base.css`: `:root` = **light** values; `[data-theme="dark"]` = dark values (stub for the future toggle). Token groups: `--surface-{base,raised,overlay,sunken,stage}`, `--text-{primary,secondary,muted,disabled,inverse}`, `--accent{,-hover,-subtle}`, `--state-{danger,warning,success,info}`, `--border-{subtle,default,strong}`, `--canvas-checker-{a,b}`, `--shadow-{sm,md,lg}`, `--radius-{card,modal,pill}`.
- **`--surface-stage` (the canvas backdrop) is a LIGHT neutral now** (e.g. a soft gray) with the transparency checkerboard reading clearly; its dark value is reserved under `[data-theme="dark"]`.
- Rewrite `tailwind.config.js` color/shadow/radius maps to point at `var(--token)`; **remove the `body.light` plugin variant**.
- Migrate `tailwind.src.css` `@layer components` classes from old scale names (`default-200`, `text-default-*`) to new semantic names; add new layout classes (modal, floating-action-layer, action-pill, size-chip, token-chip, left-rail, tool-options-strip, canvas-stage, right-dock, dock-section, hero-*).
- CSS build command is unchanged; `tailwind.gen.css` stays generated (never edit).
- **Note:** Phase 1 flips the live theme from today's dark to the new light theme by design.

### Reusable primitives & shared component

- `components/Modal/Modal.tsx` (+ `useModal.ts`) — portal (`createPortal` to `document.body`), focus trap, Escape-to-close, backdrop click, size variants. The three feature modals compose it. Migrate `ExportInstructions` onto it as a smoke test.
- `components/GenerationControls/GenerationControls.tsx` — the shared generation UI used by **both** the hero widget and the Generate modal. Composes existing primitives: tabs **AI Generate / Upload Image / Draw Blank**; `AiPromptInput` + `OpenAISettingsSection` (AI), `ImageUploadForm` (upload); common `AssetOptionsSelection` + `PaletteSelection` + token indicator + a context-aware primary button. Takes `onSuccess?: () => void` (hero → navigate to `/studio`; modal → close). Adds a `GenerationMethod.BlankCanvas` enum value. Keep `AiPromptInput` uncontrolled (prompt lives in `OpenAISettingsContext`).

### The three modals (in `pages/StudioPage/modals/`)

- **GenerateModal** — wraps `GenerationControls`; uses `useImageFileHandler` (`generateAIImageAndConvertToSprite`, manual import); closes when `isGenerating` falls true→false without error; renders the token-balance slot (if `!canGenerate`, swap primary for a placeholder "Watch ad to earn a token" CTA — no-op for now).
- **ResizeProcessModal** — composes existing `SizeInputs` + `PostProcessingSection`; **Apply** calls `processImageToSprite(sourceImage)` on the cached source (free, no token); never auto-applies. Live preview via `PreviewCanvasContext` (debounced offscreen preview is a nice-to-have; MVP can show current sprite + "Apply will reprocess").
- **ExportModal** — MakeCode-first: big `CodeDisplay` of `getImgCode()` with click-to-copy + "click in MakeCode, then Ctrl+V"; secondary PNG/JPEG/WEBP via `exportSpriteToImage`; tertiary JS/Python via `getJavaScriptCode` / `getPythonCode`. Folds in the old `ExportInstructions` content as a collapsible section. Reuses `useExportSpriteData`, `CodeDisplay`, `ExportButton`.

### Editor rework (in `features/SpriteEditor/`)

Replace `SpriteEditor.tsx`'s flat `Sidebar + Canvas` with `EditorSurface.tsx` composing three regions. **No logic moves — only render location changes**, plus three small additions (options registry, dock abstraction, tokens).

- `layout/LeftRail.tsx` — vertical tool buttons (reuse `ToolIcon` / `ToolIcons`), zoom controls, color chip. (Stroke size and palette move out.)
- `layout/ToolOptionsStrip.tsx` — reads `useToolSelected`, looks up `TOOL_OPTIONS_REGISTRY[tool]`, renders that tool's options. Pan/Select render none.
- `toolOptions/ToolOptionsRegistry.ts` — `Partial<Record<EditorTools, ToolOptionDescriptor[]>>`; adding an option = one registry line + one component. Option components: `StrokeSizeOption` (real, moved from Sidebar), `ShapeModeOption` (fill/outline for Rect/Circle), `FillToleranceOption` (stub), `PixelPerfectOption` (stub).
- `layout/CanvasStage.tsx` — hosts `Canvas` (unchanged) on `--surface-stage`; hosts `FloatingActionLayer` absolutely-positioned over it.
- `layout/FloatingActionLayer.tsx` — `SizeChip` (reads `useCanvasSize`, click → `onOpenResize`), `TokenIndicator` (display-only), three `ActionPill`s wired to `onOpenGenerate` / `onOpenResize` / `onOpenExport` (passed from StudioPage). Resize/Generate disabled while `isGenerating`; Resize also disabled when `sourceImage == null`.
- `layout/RightDock.tsx` — collapsible; takes `sections: DockSection[]` (`{id,label,content,defaultOpen}`) so future panels append with zero changes. First section = `PalettePanel`.
- `layout/PalettePanel.tsx` — palette swatches + selected color (moved out of Sidebar; contexts unchanged).
- `Canvas.tsx` — two minimal changes: add `onWheel` scroll-zoom (via `ZoomContext`; attach as a **non-passive native listener in `useEffect`** to avoid React 19 passive-wheel issues + page-scroll conflict) and set the container background to `var(--surface-stage)`; change `canvas-container` height to `h-full` inside the stage; drop the dead `width` / `height` props at the call site.

## File change map

**Create**

```
client/FRONTEND_STYLE.md
client/src/hooks/useHasVisited.ts
client/src/components/Modal/{Modal.tsx,useModal.ts}
client/src/components/GenerationControls/GenerationControls.tsx
client/src/context/TokenContext/{TokenContext.tsx,useToken.ts}
client/src/providers/GlobalProviders.tsx                 (from AppProviders.tsx)
client/src/pages/HeroPage/HeroPage.tsx
client/src/pages/HeroPage/components/{HeroEntryWidget,ExampleGallery,HowItWorks}.tsx
client/src/pages/StudioPage/StudioPage.tsx
client/src/pages/StudioPage/components/{StudioNav,RightDockHost}.tsx   (as needed)
client/src/pages/StudioPage/modals/{GenerateModal,ResizeProcessModal,ExportModal}.tsx
client/src/features/SpriteEditor/EditorSurface.tsx
client/src/features/SpriteEditor/layout/{LeftRail,ToolOptionsStrip,CanvasStage,FloatingActionLayer,RightDock,PalettePanel}.tsx
client/src/features/SpriteEditor/toolOptions/{ToolOptionsRegistry.ts,StrokeSizeOption,ShapeModeOption,FillToleranceOption,PixelPerfectOption}.tsx
```

**Modify**

```
client/package.json                        add react-router-dom
client/src/main.tsx                        BrowserRouter; CSS import order (base.css first)
client/src/App.tsx                         route shell + GlobalProviders + global overlays
client/src/base.css                        :root light tokens + [data-theme="dark"] stubs
client/tailwind.config.js                  colors/shadow/radius → var(--token); remove body.light plugin
client/src/tailwind.src.css                migrate to semantic token names; add new layout classes
client/src/context/ImageImportContext/ImageImportContext.tsx   add sourceImage + setSourceImage
client/src/features/InputSection/hooks/useImageFileHandler.ts  set sourceImage in both gen/upload paths; expose it
client/src/features/SpriteEditor/SpriteEditor.tsx              re-export EditorSurface; add onOpen* props
client/src/features/SpriteEditor/components/Canvas.tsx         onWheel zoom; --surface-stage bg; h-full; drop dead props
```

**Delete (after migration, Phase 9)**

```
client/src/features/InputSection/InputSection.tsx (+ the old left-rail composition), ExportSection/ExportSection.tsx,
ExportInstructions, NavBar, MobileSidebar, useSidebar, Sidebar/Sidebar.tsx + {StrokeIcons,StrokeIcon,ColorIcons,ZoomIcons}.
```

Survivors reused verbatim: `ToolIcon`, `ToolIcons`, `ColorIcon`, `SelectedColorIcons`, `CodeDisplay`, `ExportButton`, `useExportSpriteData`, all `InputSection/utils/` processing, `AiPromptInput`, `ImageUploadForm`, `AssetOptionsSelection`, `PaletteSelection`, `PostProcessingSection`, `SizeInputs`, `OpenAISettingsSection`, `SpriteDataResizer`.

## Key reuse pointers

- Generation/processing orchestrator: `client/src/features/InputSection/hooks/useImageFileHandler.ts` — `generateAIImageAndConvertToSprite()` and `processImageToSprite(file)` → `pasteCanvas()` → `SpriteContext.setSpriteData()`. All three modals route through this.
- **Source-image cache fix** (enables free re-processing): `ImageImportContext` currently holds only `importedImage`. Add `sourceImage: File | null` set once per generation/upload and never overwritten by re-processing; ResizeProcessModal passes it explicitly to `processImageToSprite`.
- Export generators: `client/src/features/SpriteEditor/hooks/useExportSpriteData.ts`.

## Build sequence (phased)

1. **Tokens & CSS foundation** — add tokens to `base.css`, rewire `tailwind.config.js`, migrate `tailwind.src.css`, write `FRONTEND_STYLE.md`, run `css:build`. (Flips theme to light.)
2. **Routing scaffold** — `bun add react-router-dom`; `main.tsx` BrowserRouter; rename providers → `GlobalProviders` + add `TokenContext` stub; `App.tsx` route shell with placeholder pages; `useHasVisited`. Verify build bundles router.
3. **Modal primitive** — `Modal` + `useModal`; migrate `ExportInstructions` as smoke test.
4. **Source-image cache fix** — `ImageImportContext` + `useImageFileHandler`.
5. **Three modals** — ExportModal (simplest) → GenerateModal → ResizeProcessModal.
6. **GenerationControls** — extract shared component; add Draw-Blank tab + enum value.
7. **Editor rework** — tokens already exist; build `toolOptions/*` registry + options, `LeftRail`, `PalettePanel`, `RightDock`, `FloatingActionLayer`, `CanvasStage`, then `EditorSurface`; modify `Canvas.tsx`.
8. **Studio + Hero pages** — assemble `StudioPage` (wire modal state + callbacks into EditorSurface) and `HeroPage` (entry widget via GenerationControls + marketing sections + redirect).
9. **Cleanup** — delete dead components; final lint/typecheck/build + Docker smoke.

## Risks & gotchas

- **Bun bundler** handles `react-router-dom` v7 (component API) and `createPortal` fine; any new env var must be `VITE_`-prefixed (none anticipated).
- **CSS import order** — `base.css` (tokens) must load before `tailwind.gen.css`.
- **Theme migration** — moving every component off `default-*` / `text-default-*` to semantic tokens is the bulk of Phase 1; do it as a mechanical rename, verify nothing looks broken.
- **Wheel-zoom** — use a non-passive native listener (React 19 passive default) and `preventDefault` to stop page scroll over the canvas.
- **Pre-existing `SelectionOverlay` bug** — it positions by raw `minX * PIXEL_SIZE` ignoring the canvas zoom/offset transform; a bigger canvas makes the misalignment obvious. Fix by passing `zoom` / `offset` and applying the same transform (do before shipping the Select tool).
- **Right dock on small screens** — hide below `lg` (mirror today's `hidden sm:block` toolbox) with a mobile palette fallback, or punt the mobile dock to a later phase.
- **StrokeSizeContext stays app-level** (also read by `useExportSpriteData`) — don't move it into the editor providers even though its UI moves to the options strip.

## Verification

- `bun install` then `bun run dev` (client+server). Hard-refresh `localhost:3100`.
- **Hero**: first visit shows the hero at `/`; the inline widget generates (or uploads) a sprite and navigates to `/studio`; reload `/` now redirects to `/studio` (hasVisited). Clearing the cookie restores the hero.
- **Studio**: tools-left rail + contextual options strip change with the selected tool; big canvas with light stage + transparency checkerboard; floating pills + size chip visible; right dock shows the palette and collapses.
- **Generate modal**: AI prompt path runs moderate→generate→process; upload path converts; blank path makes an empty canvas at the chosen size; loading overlay shows; token slot renders.
- **Resize & Process modal**: opened via the size chip; changing size + crop/fit + remove-bg and pressing **Apply** re-processes the cached source with **no** new AI call; closing without Apply changes nothing.
- **Export modal**: "Copy for MakeCode" copies the `img` literal; pasting into MakeCode Arcade renders the sprite; PNG/JPEG/WEBP download; JS/Python copy.
- **Theme readiness**: setting `document.documentElement.dataset.theme = 'dark'` in devtools flips the whole app via tokens (proves the toggle is trivial later).
- `bun run --filter client lint`, `bun run --filter client build`, `bun run --filter server typecheck`, `bun test` (server) all pass. `docker compose up` smoke test.
