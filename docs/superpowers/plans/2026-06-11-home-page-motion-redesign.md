# Home Page Motion Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the home page feel alive by adding loop-on-reveal Remotion demo clips — a flagship hero loop plus per-benefit step demos — where every animation demonstrates a real product action (the family.co principle).

**Architecture:** Author short, loop-friendly Remotion compositions in the sibling `makespritecode-export-gif` project, render each to `webm` + `mp4` + a poster PNG, and copy the artifacts into `client/public/`. On the client, a single reusable `DemoClip` component plays each video on scroll-into-view (paused off-screen, poster-only under reduced motion). `DemoSection` pairs one benefit headline with one `DemoClip` in an alternating left/right rhythm. Built in three independently-shippable phases.

**Tech Stack:** Remotion 4 (React 19, rendered via the Remotion CLI), the client SPA (React 19 + TypeScript + Tailwind, Bun bundler), HTML5 `<video>` + `IntersectionObserver`.

---

## Environment & conventions (read first)

- **Two repos.** Client = `/Users/javiertamayo/Documents/Coding/makecode-arcade-sprite-generator` (this repo, Bun). Remotion = `/Users/javiertamayo/Documents/Coding/makespritecode-export-gif` (sibling, npm). From the Remotion project, the client public dir is `../makecode-arcade-sprite-generator/client/public/`.
- **Broken nvm in the tool shell.** Plain `npx`/`npm`/`node` segfault. In the Remotion project, invoke node tooling with absolute paths: `/opt/homebrew/bin/npx …`, `/opt/homebrew/bin/npm …`. The client uses Bun (`bun …`), which is fine.
- **No client test suite** (server-only tests, per CLAUDE.md). Client verification = `bun run --filter client lint` + `bun run --filter client build` (type-checks via `tsc -b`) + a manual browser check on the dev server. Do **not** invent a client test runner.
- **Remotion render flags.** `remotion.config.ts` forces the **gif** codec (`setCodec("gif")`, `setEveryNthFrame(2)`, `setScale(0.5)`) for the existing GIF workflow. For `webm`/`mp4`/`still` you MUST override on the CLI with explicit `--codec=…` and `--scale=1`, or you will get a half-resolution gif-pipeline render. The commands in this plan already include those flags.
- **Composition code is starter-grade.** The new `.tsx` compositions compile and render a sensible demo using the real reusable components, but exact timing/art is tuned visually in Remotion Studio. "Verify" steps for compositions confirm they *compile and render a frame*, not that they're pixel-perfect.
- **Commits live in the repo you touched.** Remotion-side tasks commit in `makespritecode-export-gif`; client-side tasks commit in this repo (binary assets in `client/public/` are committed here).

## File structure

**Remotion project (`makespritecode-export-gif`):**
- Create `src/compositions/HeroLoop.tsx` — flagship loop: prompt → sprite pops in → runs in the Arcade simulator.
- Create `src/compositions/StepDescribe.tsx` — prompt types in, sprite assembles.
- Create `src/compositions/StepRefine.tsx` — editor view: cursor picks a palette color and paints.
- Modify `src/Root.tsx` — register the three new compositions alongside `ExportFlowDemo`.
- "Ship" reuses the existing `ExportFlowDemo` render (already shipped as `export-demo.*`); only a poster still is added.

**Client (`makecode-arcade-sprite-generator`):**
- Create `client/src/pages/HeroPage/components/DemoClip.tsx` — the reusable play-on-reveal video primitive.
- Create `client/src/pages/HeroPage/components/DemoSection.tsx` — one alternating benefit row.
- Modify `client/src/pages/HeroPage/HeroPage.tsx` — add the hero clip band, replace `HowItWorks` with three `DemoSection`s.
- Delete `client/src/pages/HeroPage/components/HowItWorks.tsx` — superseded by `DemoSection`.
- Modify `client/src/pages/HeroPage/components/ExampleGallery.tsx` — swap placeholder squares for real sprite images (phase 3).
- Add binaries under `client/public/`: `demo-hero.{webm,mp4}` + `demo-hero-poster.png`, `demo-describe.*` + poster, `demo-refine.*` + poster, `export-demo-poster.png`, and `client/public/gallery/*.png` (phase 3).

---

# Phase 1 — Hero loop (independently shippable)

Builds the flagship hero loop and the `DemoClip` primitive, and places the loop on the page. After this phase the home page already looks dramatically more alive.

## Task 1: HeroLoop composition

**Files:**
- Create: `~/Documents/Coding/makespritecode-export-gif/src/compositions/HeroLoop.tsx`
- Modify: `~/Documents/Coding/makespritecode-export-gif/src/Root.tsx`

- [ ] **Step 1: Create the HeroLoop composition**

Create `src/compositions/HeroLoop.tsx`:

```tsx
import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from "remotion";
import { PixelSprite } from "../components/PixelSprite";
import { Simulator } from "../components/Simulator";
import { MSC } from "../theme";

const PROMPT = "blue ninja warrior";
const font =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

/**
 * Hero loop (starter — tune timing in Remotion Studio). 240f @ 30fps.
 *   0–48    prompt types into the generate bar
 *   48–60   "Generate" button presses
 *   62+     sprite pops in pixel-by-pixel
 *   120–165 sprite glides toward the Arcade simulator
 *   150–168 simulator shows the running sprite
 *   225–240 fade out for a clean loop back to frame 0
 */
export const HeroLoop: React.FC = () => {
  const frame = useCurrentFrame();

  const chars = Math.round(
    interpolate(frame, [6, 48], [0, PROMPT.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  const caretOn = frame % 16 < 8;
  const btn = interpolate(frame, [48, 54, 60], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const glide = interpolate(frame, [120, 165], [0, 1], {
    easing: Easing.bezier(0.4, 0, 0.2, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fade = interpolate(frame, [225, 240], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{ background: MSC.bg, opacity: fade, fontFamily: font }}
    >
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 180,
          width: 420,
          background: MSC.white,
          border: `1px solid ${MSC.border}`,
          borderRadius: 18,
          padding: 28,
          boxShadow: "0 18px 50px rgba(15,23,42,0.10)",
        }}
      >
        <div style={{ color: MSC.slate, fontSize: 20, fontWeight: 700 }}>
          Describe your sprite
        </div>
        <div
          style={{
            marginTop: 14,
            height: 56,
            borderRadius: 12,
            border: `2px solid ${MSC.blue}`,
            background: MSC.blueTint,
            display: "flex",
            alignItems: "center",
            padding: "0 18px",
            color: MSC.ink,
            fontSize: 24,
            fontWeight: 600,
          }}
        >
          {PROMPT.slice(0, chars)}
          <span style={{ opacity: caretOn ? 1 : 0 }}>|</span>
        </div>
        <div
          style={{
            marginTop: 16,
            height: 52,
            borderRadius: 12,
            background: MSC.blue,
            color: MSC.white,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
            fontWeight: 800,
            transform: `scale(${1 - btn * 0.04})`,
          }}
        >
          ✦ Generate sprite
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: interpolate(glide, [0, 1], [610, 980]),
          top: 250,
          transform: `scale(${interpolate(glide, [0, 1], [1, 0.42])})`,
          transformOrigin: "top left",
          opacity: interpolate(frame, [160, 168], [1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <PixelSprite cell={6} paintAt={62} />
      </div>

      <div
        style={{
          position: "absolute",
          right: 70,
          top: 150,
          opacity: interpolate(frame, [115, 140], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <Simulator
          showHeart
          heartIn={interpolate(frame, [150, 168], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}
        />
      </div>
    </AbsoluteFill>
  );
};
```

- [ ] **Step 2: Register HeroLoop in Root.tsx**

Replace the entire contents of `src/Root.tsx` with:

```tsx
import "./index.css";
import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { HeroLoop } from "./compositions/HeroLoop";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ExportFlowDemo"
        component={MyComposition}
        durationInFrames={705}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="HeroLoop"
        component={HeroLoop}
        durationInFrames={240}
        fps={30}
        width={1280}
        height={720}
      />
    </>
  );
};
```

- [ ] **Step 3: Type-check the Remotion project**

Run (from the Remotion project root):
```bash
cd ~/Documents/Coding/makespritecode-export-gif && /opt/homebrew/bin/npx tsc --noEmit
```
Expected: no output (exit 0). If it errors on `HeroLoop` imports, fix the import paths before continuing.

- [ ] **Step 4: Verify the composition renders a frame**

Run:
```bash
cd ~/Documents/Coding/makespritecode-export-gif && /opt/homebrew/bin/npx remotion still HeroLoop out/_check-hero.png --frame=120 --scale=1
```
Expected: writes `out/_check-hero.png` with no error (this proves the composition mounts and renders). Optionally open it to eyeball the sprite + panel. Then delete it: `rm out/_check-hero.png`.

- [ ] **Step 5: Commit (Remotion repo)**

```bash
cd ~/Documents/Coding/makespritecode-export-gif && git add src/compositions/HeroLoop.tsx src/Root.tsx && git commit -m "feat: add HeroLoop composition for the home page hero"
```

## Task 2: Render the hero loop and ship it to the client

**Files:**
- Create (binaries): `client/public/demo-hero.webm`, `client/public/demo-hero.mp4`, `client/public/demo-hero-poster.png`

- [ ] **Step 1: Render webm**

```bash
cd ~/Documents/Coding/makespritecode-export-gif && /opt/homebrew/bin/npx remotion render HeroLoop out/demo-hero.webm --codec=vp9 --scale=1
```
Expected: `out/demo-hero.webm` written.

- [ ] **Step 2: Render mp4**

```bash
cd ~/Documents/Coding/makespritecode-export-gif && /opt/homebrew/bin/npx remotion render HeroLoop out/demo-hero.mp4 --codec=h264 --scale=1
```
Expected: `out/demo-hero.mp4` written.

- [ ] **Step 3: Render the poster (first frame)**

```bash
cd ~/Documents/Coding/makespritecode-export-gif && /opt/homebrew/bin/npx remotion still HeroLoop out/demo-hero-poster.png --frame=0 --scale=1
```
Expected: `out/demo-hero-poster.png` written.

- [ ] **Step 4: Copy artifacts into the client public dir**

```bash
cd ~/Documents/Coding/makespritecode-export-gif && cp out/demo-hero.webm out/demo-hero.mp4 out/demo-hero-poster.png ../makecode-arcade-sprite-generator/client/public/
```
Expected: three files now in `client/public/`. Sanity-check sizes: `ls -lh ../makecode-arcade-sprite-generator/client/public/demo-hero.*` — the webm should be well under 1.5 MB; if it's large, re-render with a smaller scale or shorter duration later (not blocking).

- [ ] **Step 5: Commit (client repo)**

```bash
cd ~/Documents/Coding/makecode-arcade-sprite-generator && git add client/public/demo-hero.webm client/public/demo-hero.mp4 client/public/demo-hero-poster.png && git commit -m "chore: add rendered hero loop demo assets"
```

## Task 3: DemoClip component (play-on-reveal video primitive)

**Files:**
- Create: `client/src/pages/HeroPage/components/DemoClip.tsx`

- [ ] **Step 1: Create DemoClip**

Create `client/src/pages/HeroPage/components/DemoClip.tsx`:

```tsx
import { useEffect, useRef, useState } from "react";

interface DemoClipProps {
  /** Path base without extension, e.g. "/demo-hero" → /demo-hero.webm + /demo-hero.mp4 */
  src: string;
  /** Poster image path, e.g. "/demo-hero-poster.png" */
  poster: string;
  /** Accessible description of what the clip shows. */
  label: string;
  className?: string;
}

/**
 * A muted, looping demo video that plays only while it's on screen (paused
 * off-screen to save CPU) and never preloads until first revealed. Under
 * `prefers-reduced-motion`, it renders the poster image only — no autoplay.
 */
export default function DemoClip({
  src,
  poster,
  label,
  className = "",
}: DemoClipProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [reduced, setReduced] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.35 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || reduced) return;
    if (visible) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [visible, reduced]);

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden rounded-card border border-line bg-surface shadow-sm ${className}`}>
      {reduced ? (
        <img
          src={poster}
          alt={label}
          className="aspect-video w-full object-cover"
        />
      ) : (
        <video
          ref={videoRef}
          className="aspect-video w-full object-cover"
          poster={poster}
          muted
          loop
          playsInline
          preload="none"
          aria-label={label}>
          <source src={`${src}.webm`} type="video/webm" />
          <source src={`${src}.mp4`} type="video/mp4" />
        </video>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Type-check + lint the client**

```bash
cd ~/Documents/Coding/makecode-arcade-sprite-generator && bun run --filter client lint && bun run --filter client build
```
Expected: lint passes, build completes (this compiles `tsc -b` and the bundle). DemoClip isn't imported yet, so the build only proves it type-checks; visual verification happens in Task 4.

- [ ] **Step 3: Commit (client repo)**

```bash
cd ~/Documents/Coding/makecode-arcade-sprite-generator && git add client/src/pages/HeroPage/components/DemoClip.tsx && git commit -m "feat: add DemoClip play-on-reveal video component"
```

## Task 4: Place the hero loop on the page

**Files:**
- Modify: `client/src/pages/HeroPage/HeroPage.tsx`

- [ ] **Step 1: Import DemoClip**

In `client/src/pages/HeroPage/HeroPage.tsx`, add this import after the existing `HeroEntryWidget` import (line 4):

```tsx
import DemoClip from "./components/DemoClip";
```

- [ ] **Step 2: Add the hero clip band under the hero section**

Find the hero `</section>` that closes right after the `<HeroEntryWidget … />` block (currently around line 131). Immediately after that closing `</section>` and before `<ExampleGallery onExplore={enterStudio} />`, insert:

```tsx
      {/* Hero loop — the whole arc in motion: prompt → sprite → game */}
      <section className="mx-auto max-w-6xl px-6 pb-6">
        <DemoClip
          src="/demo-hero"
          poster="/demo-hero-poster.png"
          label="Demo: turning a text prompt into a sprite running in a MakeCode Arcade game"
        />
      </section>
```

- [ ] **Step 3: Build to type-check**

```bash
cd ~/Documents/Coding/makecode-arcade-sprite-generator && bun run --filter client build
```
Expected: build succeeds.

- [ ] **Step 4: Verify in the browser**

Start the client dev server:
```bash
cd ~/Documents/Coding/makecode-arcade-sprite-generator && bun run dev:client
```
Open the URL it prints (note: the port can vary — read it from the terminal output). On the home page, confirm:
- The hero loop renders below the hero as a 16:9 panel and **autoplays + loops** when scrolled into view.
- Scrolling it out of view and back pauses/resumes it (check via DevTools that the `<video>` pauses).
- No console errors referencing `/demo-hero.*`.
- Toggle reduced motion (macOS: System Settings → Accessibility → Display → Reduce motion, or emulate in DevTools rendering) and confirm the poster image shows with no autoplay.

If using the harness preview tools instead: `preview_start`, then `preview_snapshot` to confirm the `<video aria-label="Demo: turning a text prompt…">` is present, and `preview_screenshot` for a visual.

- [ ] **Step 5: Commit (client repo)**

```bash
cd ~/Documents/Coding/makecode-arcade-sprite-generator && git add client/src/pages/HeroPage/HeroPage.tsx && git commit -m "feat: show the hero loop on the home page"
```

**✅ Phase 1 complete and shippable.** The hero is now in motion. Stop here if you want to ship before building the step demos.

---

# Phase 2 — Step demos (Describe → Refine → Ship)

Replaces the text-only `HowItWorks` with three alternating `DemoSection`s, each proving one benefit. "Describe" and "Refine" are new compositions; "Ship" reuses the existing `export-demo.*` (already in `client/public/`), adding only a poster.

## Task 5: StepDescribe composition

**Files:**
- Create: `~/Documents/Coding/makespritecode-export-gif/src/compositions/StepDescribe.tsx`
- Modify: `~/Documents/Coding/makespritecode-export-gif/src/Root.tsx`

- [ ] **Step 1: Create StepDescribe**

Create `src/compositions/StepDescribe.tsx`:

```tsx
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { PixelSprite } from "../components/PixelSprite";
import { MSC } from "../theme";

const PROMPT = "spinning gold coin";
const font =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

/** Step 1 "Describe" (starter). 150f @ 30fps: prompt types, then the sprite pops in. */
export const StepDescribe: React.FC = () => {
  const frame = useCurrentFrame();
  const chars = Math.round(
    interpolate(frame, [10, 60], [0, PROMPT.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  const caretOn = frame % 16 < 8;
  const fade = interpolate(frame, [135, 150], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: MSC.bg,
        opacity: fade,
        fontFamily: font,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: 560,
          background: MSC.white,
          border: `1px solid ${MSC.border}`,
          borderRadius: 18,
          padding: 30,
          boxShadow: "0 18px 50px rgba(15,23,42,0.10)",
        }}
      >
        <div
          style={{
            height: 60,
            borderRadius: 12,
            border: `2px solid ${MSC.blue}`,
            background: MSC.blueTint,
            display: "flex",
            alignItems: "center",
            padding: "0 20px",
            color: MSC.ink,
            fontSize: 26,
            fontWeight: 600,
          }}
        >
          {PROMPT.slice(0, chars)}
          <span style={{ opacity: caretOn ? 1 : 0 }}>|</span>
        </div>
        <div
          style={{ marginTop: 26, display: "flex", justifyContent: "center" }}
        >
          <PixelSprite cell={9} paintAt={72} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
```

- [ ] **Step 2: Register StepDescribe in Root.tsx**

In `src/Root.tsx`, add the import after the `HeroLoop` import:
```tsx
import { StepDescribe } from "./compositions/StepDescribe";
```
And add this `<Composition>` inside the fragment, after the `HeroLoop` one:
```tsx
      <Composition
        id="StepDescribe"
        component={StepDescribe}
        durationInFrames={150}
        fps={30}
        width={1280}
        height={720}
      />
```

- [ ] **Step 3: Type-check + render-check**

```bash
cd ~/Documents/Coding/makespritecode-export-gif && /opt/homebrew/bin/npx tsc --noEmit && /opt/homebrew/bin/npx remotion still StepDescribe out/_check-describe.png --frame=110 --scale=1 && rm out/_check-describe.png
```
Expected: no type errors; the still renders without error.

- [ ] **Step 4: Commit (Remotion repo)**

```bash
cd ~/Documents/Coding/makespritecode-export-gif && git add src/compositions/StepDescribe.tsx src/Root.tsx && git commit -m "feat: add StepDescribe composition"
```

## Task 6: StepRefine composition

**Files:**
- Create: `~/Documents/Coding/makespritecode-export-gif/src/compositions/StepRefine.tsx`
- Modify: `~/Documents/Coding/makespritecode-export-gif/src/Root.tsx`

- [ ] **Step 1: Create StepRefine**

Create `src/compositions/StepRefine.tsx`:

```tsx
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { PixelSprite } from "../components/PixelSprite";
import { Cursor } from "../components/Cursor";
import { ARCADE_PALETTE, MC, SPRITE_W, SPRITE_H } from "../theme";

const font =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
const CELL = 16;

/** Step 2 "Refine" (starter). 150f @ 30fps: editor view, cursor picks a color, paints down a column. */
export const StepRefine: React.FC = () => {
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [135, 150], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const gridW = SPRITE_W * CELL;
  const gridH = SPRITE_H * CELL;
  const originX = 640 - gridW / 2;
  const originY = 80;

  return (
    <AbsoluteFill
      style={{ background: MC.editorBg, opacity: fade, fontFamily: font }}
    >
      <div
        style={{
          position: "absolute",
          left: originX,
          top: originY,
          width: gridW,
          height: gridH,
          backgroundImage: `conic-gradient(${MC.checkerDark} 90deg, ${MC.checkerLight} 90deg 180deg, ${MC.checkerDark} 180deg 270deg, ${MC.checkerLight} 270deg)`,
          backgroundSize: `${CELL * 2}px ${CELL * 2}px`,
        }}
      >
        <PixelSprite cell={CELL} />
        <div
          style={{
            position: "absolute",
            left: 6 * CELL,
            top: 0,
            width: CELL,
            height: interpolate(frame, [55, 110], [0, gridH], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            background: "rgba(255,255,255,0.22)",
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 60,
          display: "flex",
          justifyContent: "center",
          gap: 8,
        }}
      >
        {Object.values(ARCADE_PALETTE).map((c, i) => (
          <div
            key={i}
            style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              background: c,
              border: "2px solid rgba(255,255,255,0.25)",
            }}
          />
        ))}
      </div>

      <Cursor
        path={[
          { frame: 0, x: 640, y: 360 },
          { frame: 30, x: 372, y: 620 },
          { frame: 52, x: originX + 6 * CELL, y: originY + 1 * CELL },
          { frame: 110, x: originX + 6 * CELL, y: originY + gridH },
        ]}
        clicks={[34, 54]}
      />
    </AbsoluteFill>
  );
};
```

- [ ] **Step 2: Register StepRefine in Root.tsx**

In `src/Root.tsx`, add the import after the `StepDescribe` import:
```tsx
import { StepRefine } from "./compositions/StepRefine";
```
And add this `<Composition>` after the `StepDescribe` one:
```tsx
      <Composition
        id="StepRefine"
        component={StepRefine}
        durationInFrames={150}
        fps={30}
        width={1280}
        height={720}
      />
```

- [ ] **Step 3: Type-check + render-check**

```bash
cd ~/Documents/Coding/makespritecode-export-gif && /opt/homebrew/bin/npx tsc --noEmit && /opt/homebrew/bin/npx remotion still StepRefine out/_check-refine.png --frame=90 --scale=1 && rm out/_check-refine.png
```
Expected: no type errors; the still renders without error.

- [ ] **Step 4: Commit (Remotion repo)**

```bash
cd ~/Documents/Coding/makespritecode-export-gif && git add src/compositions/StepRefine.tsx src/Root.tsx && git commit -m "feat: add StepRefine composition"
```

## Task 7: Render the step clips + ship-poster to the client

**Files:**
- Create (binaries): `client/public/demo-describe.{webm,mp4}`, `client/public/demo-describe-poster.png`, `client/public/demo-refine.{webm,mp4}`, `client/public/demo-refine-poster.png`, `client/public/export-demo-poster.png`

- [ ] **Step 1: Render StepDescribe (webm, mp4, poster)**

```bash
cd ~/Documents/Coding/makespritecode-export-gif && \
  /opt/homebrew/bin/npx remotion render StepDescribe out/demo-describe.webm --codec=vp9 --scale=1 && \
  /opt/homebrew/bin/npx remotion render StepDescribe out/demo-describe.mp4 --codec=h264 --scale=1 && \
  /opt/homebrew/bin/npx remotion still StepDescribe out/demo-describe-poster.png --frame=120 --scale=1
```
Expected: three `out/demo-describe.*` files.

- [ ] **Step 2: Render StepRefine (webm, mp4, poster)**

```bash
cd ~/Documents/Coding/makespritecode-export-gif && \
  /opt/homebrew/bin/npx remotion render StepRefine out/demo-refine.webm --codec=vp9 --scale=1 && \
  /opt/homebrew/bin/npx remotion render StepRefine out/demo-refine.mp4 --codec=h264 --scale=1 && \
  /opt/homebrew/bin/npx remotion still StepRefine out/demo-refine-poster.png --frame=90 --scale=1
```
Expected: three `out/demo-refine.*` files.

- [ ] **Step 3: Render the Ship poster from the existing ExportFlowDemo**

```bash
cd ~/Documents/Coding/makespritecode-export-gif && /opt/homebrew/bin/npx remotion still ExportFlowDemo out/export-demo-poster.png --frame=0 --scale=1
```
Expected: `out/export-demo-poster.png` (the existing `export-demo.webm/.mp4` are already in `client/public/`, so only the poster is new).

- [ ] **Step 4: Copy all into the client public dir**

```bash
cd ~/Documents/Coding/makespritecode-export-gif && cp \
  out/demo-describe.webm out/demo-describe.mp4 out/demo-describe-poster.png \
  out/demo-refine.webm out/demo-refine.mp4 out/demo-refine-poster.png \
  out/export-demo-poster.png \
  ../makecode-arcade-sprite-generator/client/public/
```
Expected: seven files copied. Verify: `ls -lh ../makecode-arcade-sprite-generator/client/public/demo-*.* ../makecode-arcade-sprite-generator/client/public/export-demo-poster.png`.

- [ ] **Step 5: Commit (client repo)**

```bash
cd ~/Documents/Coding/makecode-arcade-sprite-generator && git add client/public/demo-describe.* client/public/demo-refine.* client/public/export-demo-poster.png && git commit -m "chore: add rendered step-demo assets + ship poster"
```

## Task 8: DemoSection component

**Files:**
- Create: `client/src/pages/HeroPage/components/DemoSection.tsx`

- [ ] **Step 1: Create DemoSection**

Create `client/src/pages/HeroPage/components/DemoSection.tsx`:

```tsx
import DemoClip from "./DemoClip";

interface DemoSectionProps {
  eyebrow: string;
  title: string;
  body: string;
  clipSrc: string;
  clipPoster: string;
  clipLabel: string;
  /** When true, the clip sits on the left and text on the right (desktop). */
  reversed?: boolean;
  /** Optional anchor id (the nav "How it works" link targets the first one). */
  id?: string;
}

/** One benefit row: a headline + body paired with a demo clip of that exact benefit. */
export default function DemoSection({
  eyebrow,
  title,
  body,
  clipSrc,
  clipPoster,
  clipLabel,
  reversed = false,
  id,
}: DemoSectionProps) {
  return (
    <section id={id} className="mx-auto max-w-5xl px-6 py-12 lg:py-16">
      <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
        <div className={reversed ? "lg:order-2" : ""}>
          <p className="text-2xs font-semibold uppercase tracking-wide text-accent">
            {eyebrow}
          </p>
          <h2 className="mt-2 text-h2 font-bold text-ink">{title}</h2>
          <p className="mt-3 max-w-md text-ink-muted">{body}</p>
        </div>
        <DemoClip
          src={clipSrc}
          poster={clipPoster}
          label={clipLabel}
          className={reversed ? "lg:order-1" : ""}
        />
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Type-check the client**

```bash
cd ~/Documents/Coding/makecode-arcade-sprite-generator && bun run --filter client build
```
Expected: build succeeds.

- [ ] **Step 3: Commit (client repo)**

```bash
cd ~/Documents/Coding/makecode-arcade-sprite-generator && git add client/src/pages/HeroPage/components/DemoSection.tsx && git commit -m "feat: add DemoSection benefit row component"
```

## Task 9: Replace HowItWorks with the three demo sections

**Files:**
- Modify: `client/src/pages/HeroPage/HeroPage.tsx`
- Delete: `client/src/pages/HeroPage/components/HowItWorks.tsx`

- [ ] **Step 1: Swap the imports**

In `client/src/pages/HeroPage/HeroPage.tsx`, remove the line:
```tsx
import HowItWorks from "./components/HowItWorks";
```
and add (next to the `DemoClip` import):
```tsx
import DemoSection from "./components/DemoSection";
```

- [ ] **Step 2: Add the demo-step data**

Near the top of the file, after the existing `NAV_LINKS` array, add:

```tsx
const DEMO_STEPS = [
  {
    id: "how-it-works",
    eyebrow: "Describe it",
    title: "Type it, watch it appear",
    body: "Describe any sprite in plain words. The AI draws it on the Arcade palette in seconds — no art skills required.",
    clipSrc: "/demo-describe",
    clipPoster: "/demo-describe-poster.png",
    clipLabel:
      "Demo: typing a prompt and the sprite appearing pixel by pixel",
    reversed: false,
  },
  {
    eyebrow: "Refine it",
    title: "Tune every single pixel",
    body: "Open the studio to nudge pixels, swap palette colors, resize, and clean up the background until it's exactly right.",
    clipSrc: "/demo-refine",
    clipPoster: "/demo-refine-poster.png",
    clipLabel:
      "Demo: painting pixels and swapping palette colors in the editor",
    reversed: true,
  },
  {
    eyebrow: "Ship it",
    title: "Paste straight into MakeCode",
    body: "Copy the img code literal and paste it into MakeCode Arcade with Ctrl+V. Your sprite is in the game instantly.",
    clipSrc: "/export-demo",
    clipPoster: "/export-demo-poster.png",
    clipLabel:
      "Demo: copying the sprite and pasting it into MakeCode Arcade",
    reversed: false,
  },
];
```

- [ ] **Step 3: Render the sections**

Replace the single line:
```tsx
      <HowItWorks />
```
with:
```tsx
      {DEMO_STEPS.map((step) => (
        <DemoSection key={step.title} {...step} />
      ))}
```

- [ ] **Step 4: Delete the dead HowItWorks component**

```bash
cd ~/Documents/Coding/makecode-arcade-sprite-generator && git rm client/src/pages/HeroPage/components/HowItWorks.tsx
```
Expected: file removed. (Confirm nothing else imports it: `grep -rn "HowItWorks" client/src` should return no results after the import swap.)

- [ ] **Step 5: Build to type-check**

```bash
cd ~/Documents/Coding/makecode-arcade-sprite-generator && bun run --filter client lint && bun run --filter client build
```
Expected: lint + build succeed.

- [ ] **Step 6: Verify in the browser**

Start `bun run dev:client` and open the printed URL. Confirm:
- The old three text cards are gone; in their place are three full-width sections, each with a headline and a looping demo clip.
- The middle section ("Refine it") has the clip on the **left**, the others on the right (desktop width).
- The nav "How it works" link still scrolls to the first demo section (anchor `#how-it-works`).
- Each clip plays when scrolled into view and pauses when off-screen; no console errors for `/demo-describe.*`, `/demo-refine.*`, `/export-demo.*`.

- [ ] **Step 7: Commit (client repo)**

```bash
cd ~/Documents/Coding/makecode-arcade-sprite-generator && git add client/src/pages/HeroPage/HeroPage.tsx client/src/pages/HeroPage/components/HowItWorks.tsx && git commit -m "feat: replace HowItWorks text cards with animated demo sections"
```

**✅ Phase 2 complete and shippable.** The page now demonstrates every step in motion.

---

# Phase 3 — Real sprite gallery

Swaps the placeholder color squares for real generated sprites. **Depends on the user supplying sprite PNGs.** Drop them in `client/public/gallery/` before starting.

## Task 10: Swap ExampleGallery placeholders for real sprites

**Files:**
- Modify: `client/src/pages/HeroPage/components/ExampleGallery.tsx`
- Add (binaries, user-supplied): `client/public/gallery/*.png`

- [ ] **Step 1: Add the sprite assets**

Place the real exported sprite PNGs in `client/public/gallery/` (e.g. `ninja.png`, `slime.png`, `coin.png`, `heart.png`, `gem.png`, `potion.png`, `star.png`, `sword.png`, `mushroom.png`). They'll be served at `/gallery/<name>.png`. Confirm: `ls client/public/gallery`.

- [ ] **Step 2: Update the EXAMPLES data**

In `client/src/pages/HeroPage/components/ExampleGallery.tsx`, replace the `EXAMPLES` array (the `{ label, color, size }` objects) with `{ label, src, size }` pointing at the real files. Update the comment too:

```tsx
// Real generated sprites exported from the studio, served from public/gallery/.
const EXAMPLES = [
  { label: "blue ninja warrior", src: "/gallery/ninja.png", size: "32×32" },
  { label: "green dungeon slime", src: "/gallery/slime.png", size: "16×16" },
  { label: "spinning gold coin", src: "/gallery/coin.png", size: "16×16" },
  { label: "health pickup heart", src: "/gallery/heart.png", size: "16×16" },
  { label: "teal crystal gem", src: "/gallery/gem.png", size: "16×16" },
  { label: "purple magic potion", src: "/gallery/potion.png", size: "16×16" },
  { label: "power-up star", src: "/gallery/star.png", size: "16×16" },
  { label: "hero's short sword", src: "/gallery/sword.png", size: "16×16" },
  { label: "spotted forest mushroom", src: "/gallery/mushroom.png", size: "16×16" },
];
```

- [ ] **Step 3: Render real images instead of color squares**

In the same file, replace the tile's inner color `<span>` (the `style={{ backgroundColor: color, … }}` element) with an `<img>`. Change the `EXAMPLES.map(({ label, color, size }) => …)` destructure to `({ label, src, size })`, and swap the tile body:

```tsx
        {EXAMPLES.map(({ label, src, size }) => (
          <div
            key={label}
            className="overflow-hidden rounded-card border border-line bg-surface-raised shadow-sm">
            <div className="transparent flex aspect-square items-center justify-center">
              <img
                src={src}
                alt={label}
                className="h-full w-full object-contain p-3"
                style={{ imageRendering: "pixelated" }}
              />
            </div>
            <div className="flex items-center justify-between gap-2 border-t border-line px-3 py-2">
              <span className="truncate font-mono text-xs text-ink-muted">
                {label}
              </span>
              <span className="shrink-0 font-mono text-2xs text-ink-subtle">
                {size}
              </span>
            </div>
          </div>
        ))}
```

- [ ] **Step 4: Build + verify**

```bash
cd ~/Documents/Coding/makecode-arcade-sprite-generator && bun run --filter client lint && bun run --filter client build
```
Then `bun run dev:client`, open the page, and confirm the gallery shows crisp pixel-art sprites (not blurred — `imageRendering: pixelated` is working) with their labels and size badges. No 404s for `/gallery/*.png` in the console.

- [ ] **Step 5: Commit (client repo)**

```bash
cd ~/Documents/Coding/makecode-arcade-sprite-generator && git add client/public/gallery client/src/pages/HeroPage/components/ExampleGallery.tsx && git commit -m "feat: replace gallery placeholders with real sprites"
```

**✅ Phase 3 complete.** The full-motion home page is done.

---

## Self-review

**Spec coverage:**
- Guiding principle (benefit + demo per section) → `DemoSection` (Task 8) + the three `DEMO_STEPS` (Task 9). ✓
- Loop-on-reveal mechanism (autoplay/muted/loop, pause off-screen, lazy preload, reduced-motion poster) → `DemoClip` (Task 3). ✓
- `DemoClip` + `DemoSection` client pieces → Tasks 3, 8. ✓
- `HeroLoop`, `StepDescribe`, `StepRefine` compositions → Tasks 1, 5, 6. ✓
- `StepShip` = existing `ExportFlowDemo` reused → Task 7 step 3 + Task 9 ("Ship it" points at `/export-demo` with a new poster). ✓ (Deviation from spec, called out: we reuse the already-shipped render instead of re-rendering a retrimmed clip — same content, zero extra render. A retrim is an optional later polish.)
- HeroPage: hero clip + replace HowItWorks → Tasks 4, 9. ✓
- ExampleGallery real assets → Task 10. ✓
- Render → ship pipeline (webm + mp4 + poster → client/public) → Tasks 2, 7. ✓
- Performance / a11y / autoplay constraints → baked into `DemoClip` (Task 3). ✓
- Phasing (each phase shippable) → Phase 1 ends at Task 4, Phase 2 at Task 9, Phase 3 at Task 10. ✓

**Placeholder scan:** No "TBD"/"handle edge cases"/"similar to Task N". Every code step shows complete code; every command shows the exact invocation and expected result. Composition code is explicitly labeled starter-grade with a visual-tuning note — it still compiles and renders as written.

**Type consistency:** `DemoClip` props `{ src, poster, label, className }` are passed identically by the hero band (Task 4) and by `DemoSection` (Task 8). `DemoSection` props `{ eyebrow, title, body, clipSrc, clipPoster, clipLabel, reversed, id }` match the `DEMO_STEPS` object keys (Task 9) exactly. Composition ids (`HeroLoop`, `StepDescribe`, `StepRefine`, `ExportFlowDemo`) are consistent between `Root.tsx` registration and every render/still command. `EXAMPLES` destructure changes from `{label,color,size}` to `{label,src,size}` in both the data and the `.map` (Task 10).
