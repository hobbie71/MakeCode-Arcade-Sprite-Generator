# Live Remotion compositions

Animations that play **live in the browser** via [`@remotion/player`](https://www.remotion.dev/docs/player), instead of being baked to a video file. Live playback renders real DOM at native resolution, so it's sharper than a compressed `.mp4`/`.webm`, scroll/visibility-aware, and reuses the exact same composition code we author for Remotion.

## Layout

```
remotion/
  theme.ts          Shared design tokens + sprite data (MSC, MC, ARCADE_PALETTE, SPRITE, JS_*).
  components/        Reusable building blocks (Cursor, BrowserFrame, MakeCodeChrome,
                     Simulator, PixelSprite, Caption, ImageEditor, fabric).
  scenes/            Multi-component scenes (SceneCopy, SceneJs, SceneMakeCode).
  compositions/      One file per composition — the things you actually play.
  registry.ts        Descriptors (component + fps + dimensions) — single source of truth.
  RemotionClip.tsx   The ONLY way to put a composition on the page. Non-interactive,
                     play-on-reveal, shape-agnostic.
```

## Adding a composition

1. Create `compositions/MyThing.tsx` exporting a React component that uses
   `useCurrentFrame()` / `interpolate()` (copy `SpriteLoop.tsx` as a starting point).
2. Register it in `registry.ts`:
   ```ts
   export const MY_THING: CompositionDescriptor = {
     component: MyThing, durationInFrames: 150, fps: 30, width: 1280, height: 720,
   };
   ```
3. Render it anywhere:
   ```tsx
   import RemotionClip from "@/remotion/RemotionClip";
   import { MY_THING } from "@/remotion/registry";
   <RemotionClip composition={MY_THING} label="what it shows" />
   ```

`durationInFrames`/`fps`/`width`/`height` must match how the composition was authored. `RemotionClip` derives the on-page aspect ratio from `width`/`height`.

## Authoring rules (so live + rendered stay identical)

- **Inline styles only** — no Tailwind classes inside compositions (they render in the
  Player's own subtree; keep them self-contained).
- **No browser-only side effects** beyond what Remotion supports; use `useCurrentFrame`
  for all motion so a frame is fully determined by its frame number.
- Author compositions to **loop seamlessly** (first frame ≈ last frame).

## Fabric (MDL2) icons

`components/fabric.tsx` loads the Office Fabric icon font via `staticFile("fabric-icons.css")`.
The font assets live in **`client/public/`** (`fabric-icons.css` + `fabricmdl2icons.woff`)
and are served at the site root, which is what `staticFile` resolves to. If you move or
rename them, update both files.

## ⚠️ Relationship to the render project (read before editing)

These compositions were ported from the standalone **`makespritecode-export-gif`** Remotion
project, which is what renders the baked `.mp4`/`.webm`/`.gif` files. **They are currently
duplicated** in two places:

- here (for **live** in-browser playback), and
- `makespritecode-export-gif/src/` (for **headless rendering** to video files).

For now, treat **this copy as the source of truth** for anything shown live on the site.
If you change a composition here, mirror it in the render project (or vice-versa) until we
consolidate. The clean long-term fix is to extract this kit into a shared workspace package
(like `@makespritecode/shared`) consumed by both — deferred until the live approach is
proven across the site.
