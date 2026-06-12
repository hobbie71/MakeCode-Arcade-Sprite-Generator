// =============================================================================
// EXAMPLES — maintainer-curated home-page gallery (NOT the live Showcase)
// =============================================================================
// Per CONTEXT.md, "Examples" are hand-picked sprites baked into the build to
// demonstrate the app. They are stored as MakeCode `img` literals (the app's
// native artifact) and rendered to a <canvas> at load time — see GallerySprite.
// Storing the literal (not a PNG) keeps them tiny, palette-accurate, crisp at
// any scale, and trivially editable: re-open in the studio, tweak, Copy, paste
// the new string back here. See ADR-0008 / the storage decision discussion.
//
// HOW TO FILL THIS IN:
//   1. Generate (or draw) the sprite in the studio.
//   2. Export → Copy the MakeCode `img`...`` string.
//   3. Paste the pixel rows into the `literal` field below, between BACKTICKS
//      (a template string). Multi-line text MUST use backticks `...`, never
//      "..." or '...'. Drop the `img` / surrounding backticks; bare rows parse
//      fine (GallerySprite wraps them for you).
//   4. An empty literal renders a neutral placeholder, so the grid never looks
//      broken while you fill it in one at a time.
//
// The grid climbs 16×16 → 32×32 → 64×64 → 160×120 (a full Arcade screen).
// Dimensions are derived from the literal at render time; `size` is only the
// badge label, so keep it in sync with the sprite you paste.

export type Example = {
  /** Public caption shown under the tile (e.g. "spinning gold coin"). */
  label: string;
  /** Badge label, e.g. "16×16". Display-only; real dims come from `literal`. */
  size: string;
  /** MakeCode `img` literal. Empty string → neutral placeholder tile. */
  literal: string;
};

export const EXAMPLES: Example[] = [
  // --- 16×16 — tiny, iconic single items -----------------------------------
  {
    label: "spinning gold coin",
    size: "16×16",
    literal: `
. . . . . f f f f f f . . . . .
. . . . f 5 5 5 5 5 5 f . . . .
. . . f 4 4 5 5 5 5 5 5 f . . .
. . f 4 5 5 5 5 5 5 4 5 4 f . .
. f 4 5 5 5 5 4 5 5 5 4 5 4 f .
f 5 5 1 5 5 1 5 5 5 5 5 5 4 4 f
f 5 5 5 5 5 5 5 4 5 5 5 5 5 4 f
f 4 5 5 5 1 5 1 5 4 5 5 4 5 4 f
f 4 5 5 4 5 1 1 5 4 4 5 4 5 4 f
f 4 5 5 5 5 5 5 5 5 5 5 4 5 4 f
f 5 5 5 5 5 1 5 5 5 5 5 5 4 4 f
. f 4 5 5 5 5 4 5 5 1 4 5 4 f .
. . f 4 5 5 5 5 5 5 4 5 4 f . .
. . . f 4 4 5 5 5 5 5 5 f . . .
. . . . f 5 5 5 5 5 5 f . . . .
. . . . . f f f f f f . . . . .
`,
  },
  {
    label: "health pickup heart",
    size: "16×16",
    literal: `
      . . f f f f . . . . f f f f . .
      . f 2 2 2 2 f . . f 2 2 2 2 f .
      f 2 1 1 2 2 2 f f 2 2 2 2 2 2 f
      f 2 1 1 2 2 2 2 2 2 2 2 2 2 2 f
      f 2 2 1 2 2 2 2 2 2 2 2 2 2 2 f
      f 2 2 2 2 2 2 2 2 2 2 2 2 2 2 f
      f 2 2 2 2 2 2 2 2 2 2 2 2 2 2 f
      f 2 2 2 2 2 2 2 2 2 2 2 2 2 2 f
      . f 2 2 2 2 2 2 2 2 2 2 2 2 f .
      . . f 2 2 2 2 2 2 2 2 2 2 f . .
      . . . f 2 2 2 2 2 2 2 2 f . . .
      . . . . f 2 2 2 2 2 2 f . . . .
      . . . . . f 2 2 2 2 f . . . . .
      . . . . . . f 2 2 f . . . . . .
      . . . . . . . f f . . . . . . .
      . . . . . . . . . . . . . . . .`,
  },
  {
    label: "green dungeon slime",
    size: "16×16",
    literal: `
      . . . . . . . . . . . . . . . .
      . . . . f f f f f f f f . . . .
      . . . f 7 7 7 7 7 7 7 7 f . . .
      . . f 7 1 1 1 7 7 7 7 7 7 f . .
      . f 7 1 1 7 7 7 7 7 7 7 7 7 f .
      f 7 7 7 7 7 7 7 7 7 7 7 7 7 7 f
      f 7 7 7 7 f 7 7 7 7 f 7 7 7 7 f
      f 7 7 7 7 f 7 7 7 7 f 7 7 7 7 f
      f 7 7 7 7 f 7 7 7 7 f 7 7 7 7 f
      f 7 7 7 7 f 7 7 7 7 f 7 7 7 7 f
      f 7 7 7 7 7 7 7 7 7 7 7 7 7 7 f
      f 7 7 7 7 7 7 7 7 7 7 7 7 7 7 f
      . f 7 7 7 7 7 7 7 7 7 7 7 7 f .
      . . f f f f f f f f f f f f . .
      . . . . . . . . . . . . . . . .
      . . . . . . . . . . . . . . . . 
    `,
  },

  // --- 32×32 — characters & loot with a clear silhouette -------------------
  {
    label: "wooden treasure chest",
    size: "32×32",
    literal: `
      . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
      . . . f f f f . . . . . . . . . . . . . . . . . . f f f f . . .
      . . f 5 5 5 f f f f f f f f f f f f f f f f f f f f 5 5 5 f . .
      . . f 5 5 5 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 5 5 5 f . .
      . f 5 5 5 f f f f f f f f f f f f f f f f f f f f f f 5 5 5 f .
      . f 5 5 5 f 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 f 5 5 5 f .
      f 5 5 5 f 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 f 5 5 5 f
      f 5 5 4 f 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 f 5 5 5 f
      f 5 4 5 f 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 f 5 4 5 f
      f 5 5 5 f 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 f 5 5 5 f
      f 5 5 5 f 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 f 5 5 5 f
      f 5 5 5 f 4 4 4 4 f 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 f 5 5 5 f
      f 5 5 5 f 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 f 5 5 5 f
      f 5 5 5 f 4 4 4 4 4 4 4 4 4 f f f f 4 4 4 4 4 4 4 4 4 f 5 5 5 f
      f 5 4 5 f 4 4 4 4 4 4 4 4 f 5 5 5 5 f 4 4 4 4 4 4 4 4 f 5 4 5 f
      f 5 5 5 f f f f f f f f f f 5 5 5 5 5 f f f f f f f f f 5 5 5 f
      f 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 f
      f 5 5 5 5 5 5 5 5 5 5 5 5 f f 5 5 f f 5 5 5 5 5 5 5 5 5 5 5 5 f
      f 4 4 4 f f f f f f f f f 5 5 f f 5 5 f f f f f f f f f 4 4 4 f
      f 5 5 5 4 4 4 4 4 4 4 4 f 5 5 f f 5 5 f 4 4 4 4 4 4 4 4 5 5 5 f
      f 5 5 5 4 4 4 4 4 4 4 4 f 5 5 f f 5 5 f 4 4 4 4 4 4 4 4 5 5 5 f
      f 5 4 5 f f f f f f f f f 5 5 f f 5 5 f f f f f f f f f 5 4 5 f
      f 5 5 5 4 4 4 4 4 4 4 4 f f 5 5 5 5 f f 4 4 4 4 4 4 4 4 5 5 5 f
      f 5 5 5 4 4 4 4 4 4 4 4 4 4 f f f f 4 4 4 4 4 4 4 4 4 4 5 5 5 f
      f f f 5 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 5 f f f
      f 5 5 5 f f f f f f f f f f f f f f f f f f f f f f f f 5 5 5 f
      f 5 5 5 f 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 f 5 5 5 f
      f 5 5 5 5 5 f 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 f 5 5 5 5 5 f
      f 5 5 5 5 5 f f f f f f f f f f f f f f f f f f f f 5 5 5 5 5 f
      f 5 5 5 5 5 f 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 f 5 5 5 5 5 f
      f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f
      . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
    `,
  },
  {
    label: "spotted mushroom",
    size: "32×32",
    literal: `
. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
. . . . . . . . . . . . f f f f f f f f . . . . . . . . . . . .
. . . . . . . . . . f f 2 1 1 1 1 1 1 2 f f . . . . . . . . . .
. . . . . . . . f f 2 2 1 1 1 1 1 1 1 1 2 2 f f . . . . . . . .
. . . . . . . f 2 2 2 2 1 1 1 1 1 1 1 1 2 2 2 2 f . . . . . . .
. . . . . . f 2 2 2 2 2 2 1 1 1 1 1 1 2 2 2 2 2 2 f . . . . . .
. . . . . f 2 2 2 2 2 2 2 2 1 1 1 1 2 2 2 2 2 2 2 2 f . . . . .
. . . . f 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 f . . . .
. . . f 1 1 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 1 1 f . . .
. . f 1 1 1 1 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 1 1 1 1 f . .
. . f 1 1 1 1 2 2 2 2 2 2 2 1 1 1 1 2 2 2 2 2 2 1 1 1 1 1 f . .
. f 1 1 1 1 1 2 2 2 2 2 2 1 1 1 1 1 1 2 2 2 2 2 1 1 1 1 1 1 f .
. f 1 1 1 1 1 2 2 2 2 2 1 1 1 1 1 1 1 1 2 2 2 2 1 1 1 1 1 1 f .
. f 1 1 1 1 1 2 2 2 2 1 1 1 1 1 1 1 1 1 1 2 2 2 2 1 1 1 1 1 f .
f 2 1 1 1 1 2 2 2 2 2 1 1 1 1 1 1 1 1 1 1 2 2 2 2 2 1 1 1 1 2 f
f 2 2 1 1 2 2 2 2 2 2 1 1 1 1 1 1 1 1 1 1 2 2 2 2 2 2 1 1 2 2 f
f 2 2 2 2 2 2 2 2 2 2 1 1 1 1 1 1 1 1 1 1 2 2 2 2 2 2 2 2 2 2 f
f 2 2 2 2 2 2 2 2 2 2 2 1 1 1 1 1 1 1 1 2 2 2 2 2 2 2 2 2 2 2 f
f 2 2 2 2 2 2 2 2 2 2 2 2 1 1 1 1 1 1 2 2 2 2 2 2 2 2 2 2 2 2 f
f 1 2 2 2 2 2 2 2 2 2 2 2 2 1 1 1 1 2 2 2 2 2 2 2 2 2 2 2 2 1 f
f 1 1 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 1 1 f
. f 1 1 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 1 1 f .
. . f 5 e 2 2 e e f f f f f f f f f f f f f e e 2 2 2 e 5 f . .
. . . . . f f f d d d d d d d d d d d d d d d f f f f . . . . .
. . . . . . . f d d d f f d d d d d f f d d d f . . . . . . . .
. . . . . . . f d d d f f d d d d d f f d d d f . . . . . . . .
. . . . . . . f d d d f f d d d d d f f d d d f . . . . . . . .
. . . . . . . f d d d d d d d d d d d d d d d f . . . . . . . .
. . . . . . . . f d d d d d d d d d d d d d f . . . . . . . . .
. . . . . . . . . f d d d d d d d d d d d f . . . . . . . . . .
. . . . . . . . . . f f f f f f f f f f f . . . . . . . . . . .
. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
`,
  },
  {
    label: "Pufferfish",
    size: "32×32",
    literal: `
. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . f . . . . . . . . . . . . . . . . .
. . . . . . . . f . . . . f 5 f . . . . f . . . . . . . . . . .
. . . . . . . f 5 f f f f f 5 f f f f f 5 f . . . . . . . . . .
. . . . . . . f 5 f 4 4 4 4 4 4 4 4 4 5 5 f . . . . . . . . . .
. . . . . . f f f 4 4 4 4 f 4 4 4 4 4 4 f f f . . . . . . . . .
. . . . f f 4 4 4 4 4 4 f 5 f 4 4 4 4 4 4 4 4 f . . . . . . . .
. . . f 5 f 4 4 4 4 4 4 4 5 4 4 4 4 4 4 4 4 4 4 f . . . . . . .
. . . f 5 f 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 f f . . . . . .
. . . f f 4 4 4 4 4 4 4 4 4 4 4 4 4 4 5 f 4 4 4 5 f . . . . . .
. . f 4 4 4 4 f f 4 4 4 4 4 4 4 4 4 4 5 f 4 4 4 4 f . . . f f .
. . f 4 4 f 1 1 1 1 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 f . f 4 4 f
. f f 4 4 f 1 f 1 1 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 f f 4 4 4 f
f 2 2 4 4 f 1 f f 1 4 4 4 4 4 4 f f 4 4 4 4 4 4 4 4 f 4 4 4 4 f
. f 2 4 4 4 f 1 1 f 4 4 4 4 f 5 4 4 f 4 4 4 4 4 4 4 4 4 4 4 4 f
. f 2 4 4 4 4 f f 4 4 4 4 4 5 5 4 5 5 f 4 4 4 4 4 4 f 4 4 4 4 f
f 2 2 4 4 4 4 4 4 4 4 4 4 4 5 4 4 4 4 f 4 4 4 4 4 4 f 4 4 4 4 f
. f f d d 4 4 4 4 4 4 4 4 4 f 4 5 5 f 4 4 4 4 5 f 4 f f 4 4 4 f
. . f d d d d d 4 4 5 4 4 4 4 4 f f 4 4 4 4 4 f 4 4 f . f 4 4 f
. . f d d d d d d f 5 4 4 4 4 4 4 4 4 4 4 4 4 4 4 f f . . f f .
. . . f d d d d d d f 4 4 4 4 4 4 4 4 4 4 4 4 4 f . . . . . . .
. . f 5 4 d d d d d d d d 4 4 4 4 4 4 4 4 4 4 4 5 f . . . . . .
. . . f f d d d d d d d d d 4 4 4 4 4 4 4 4 4 4 f f . . . . . .
. . . . . f d d d d d d d d d 4 4 4 f f 4 4 f f . . . . . . . .
. . . . . . f 4 d d f f d d d d 4 4 4 4 4 f . . . . . . . . . .
. . . . . . . f f d f f d d d d d d 4 4 f . . . . . . . . . . .
. . . . . . . . f f f f f d d d f f f 5 f . . . . . . . . . . .
. . . . . . . . f . . . . f 5 f . . . f . . . . . . . . . . . .
. . . . . . . . . . . . . . f . . . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
`,
  },

  // --- 64×64 — detailed single subjects ------------------------------------
  {
    label: "armored knight",
    size: "64×64",
    literal: `
. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . f f f f f f f . . . . . . . . . . . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . f 2 2 2 2 2 e f f f . . . . . . . . . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . f 2 2 2 2 2 2 2 2 2 f f . . . . . . . . . . . . . . . . . . . . . .
. . . . . . . . . . . f . . . . . . . . . . . . . . . . . f f 2 2 2 2 2 2 2 2 2 2 f f . . . . . . . . . . . . . . . . . . . . .
. . . . . . . . . . f 1 f . . . . . . . . . . . . . . . . f 2 2 2 2 e e e 2 2 2 2 2 f . . . . . . . . . . . . . . . . . . . . .
. . . . . . . . . f 1 1 1 f . . . . . . . . . . . . . . . f 2 2 2 e e e e e 2 2 2 2 2 f f . . . . . . . . . . . . . . . . . . .
. . . . . . . . f 1 1 3 1 f . . . . . . . . . . . . . . . f 2 2 e e e f f e e e 2 2 2 2 2 f . . . . . . . . . . . . . . . . . .
. . . . . . . . f 1 1 8 2 f . . . . . . . . . . . . . . . . f 2 e e f . . f e e e 2 2 2 f f . . . . . . . . . . . . . . . . . .
. . . . . . . . f 1 1 a 1 f . . . . . . . . . . . . . . c c f 1 7 f c a . . f f e e e f f . . . . . . . . . . . . . . . . . . .
. . . . . . . . f 1 1 8 1 f . . . . . . . . . . . . c f f f 4 1 b 4 e f f f . f f f f . . . . . . . . . . . . . . . . . . . . .
. . . . . . . . f 1 1 a 1 f . . . . . . . . . . a c f f 1 1 2 1 9 9 1 d 1 7 f . . . . . . . . . . . . . . . . . . . . . . . . .
. . . . . . . . f 1 1 a 1 f . . . . . . . . . . c f b 1 1 1 2 1 1 b 1 1 1 2 f a . . . . . . . . . . . . . . . . . . . . . . . .
. . . . . . . . f 1 1 8 1 f . . . . . . . . . f f 1 1 1 1 1 2 1 a 8 1 1 1 1 5 f . . . . . . . . . . . . . . . . . . . . . . . .
. . . . . . . . f 1 1 8 1 f . . . . . . . . . f 1 1 1 1 1 1 8 f f 6 9 1 1 1 1 7 f . . . . . . . . . . . . . . . . . . . . . . .
. . . . . . . . f 1 1 a 1 f . . . . . . . . . f 1 1 1 1 1 3 f 1 7 f 1 1 1 1 1 7 f . . . . . . . . . . . . . . . . . . . . . . .
. . . . . . . . f 1 1 8 1 f . . . . . . . . f b 1 1 1 f f 1 1 1 2 5 7 f 1 1 1 8 c f . . . . . . . . . . . . . . . . . . . . . .
. . . . . . . . f 1 1 a 1 f . . . . . . . . f b 1 d f 1 1 1 1 1 b 2 a 1 f f b a 7 f . . . . . . . . . . . . . . . . . . . . . .
. . . . . . . . f 1 1 8 1 f . . . . . . . f f f 5 2 1 1 1 1 9 1 8 b 2 2 1 4 5 f f f . . . . . . . . . . . . . . . . . . . . . .
. . . . . . . . f 1 1 a 1 f . . . . . . . f 1 5 1 b 1 1 1 1 1 1 b 8 8 b 2 a 2 f 3 f . . . . . . . . . . . . . . . . . . . . . .
. . . . . . . . f 1 1 a b f . . . . . . . f a 5 1 f f f 1 b 1 1 a 2 7 f f f 2 f 2 f . . . . . . . . . . . . . . . . . . . . . .
. . . . . . . . f 1 1 a 1 f . . . . . . . c f f 1 f 1 f 1 f f f f f 9 f 9 f 9 f f c . . . . . . . . . . . . . . . . . . . . . .
. . . . . . . . f 1 1 8 1 f . . . . . . . . . f 1 f 1 f 9 f f 1 f f 8 f 8 f 2 f . . . . . . . . . . . . . . . . . . . . . . . .
. . . . . . . . f 1 1 a 1 f . . . . . . . . . f 1 f b f 1 f f 1 f f 8 f 8 f a f . . . . . . . . . . . . . . . . . . . . . . . .
. . . . . . . . f 1 1 a 1 f . . . . . . f f f . d 1 1 f 1 f f 1 f f 8 f b 2 9 f f f f . . . . . . . . . . . . . . . . . . . . .
. . . . . . . . f 1 1 a 1 f . . . . c f 9 1 7 a f 1 1 1 1 f f 1 f f a b a b f a f 1 1 f f . . . . . . . . . . . . . . . . . . .
. . . . . . . . f 1 1 8 1 f . . . f f 9 1 1 1 1 c f 9 1 1 1 f 1 f 8 8 a 5 f 8 f 1 1 1 9 9 f . . . . . . . . . . . . . . . . . .
. . . . . . . . f 1 1 8 1 f . . f 1 1 1 1 1 1 2 b 8 f f f 1 1 1 b b f f f 8 6 f 3 1 1 1 1 9 f . . . . . . . . . . . . . . . . .
. . . . . . . . f 1 1 a 1 f . . f 1 1 1 1 1 1 2 f f a a f f f 1 f f f b 5 f f f 1 1 1 1 1 1 f a . . . . . . . . . . . . . . . .
. . . . . . . . f 1 1 8 1 f . . 5 1 1 1 1 1 2 b e 9 1 f b 3 f f f 7 2 f 1 1 9 f 9 1 1 1 1 2 8 f . . . . . . . . . . . . . . . .
. . . . . c f f f b 6 f f f f f f 6 1 1 1 1 2 f 5 1 1 1 7 2 f 8 f 5 5 1 1 1 b f a 8 1 1 1 3 f f . . . . . . . . . . . . . . . .
. . . . . f 5 5 5 5 5 5 5 5 5 5 5 f 1 1 b 8 7 f 1 1 1 1 1 1 1 1 1 1 1 1 1 1 2 f f 8 9 1 1 f f f f . . . . . . . . . . . . . . .
. . . . . f 5 f f f f 5 f f f f 5 f f f f f f 8 1 1 1 1 1 1 1 1 1 1 1 1 3 b 8 b f f f f f f 1 1 1 f f f f . . . . . . . . . . .
. . . . . . c c . . e e f a a f f 1 2 5 5 7 f 8 3 1 1 1 1 1 1 1 1 2 2 b 2 b 8 b f f f 1 b 3 2 2 b 1 b 1 d f . . . . . . . . . .
. . . . . . . . a 1 1 1 e 5 f c f f 1 1 a 8 f 8 1 1 1 1 1 1 1 1 2 2 b b b b a a f 7 1 d 8 f d 2 2 3 f a b 2 e . . . . . . . . .
. . . . . . . c f 1 f f f 2 f f f 3 f f 1 a f b 1 1 1 1 9 1 1 1 b 2 b b 2 b b f 7 1 4 f 1 9 1 2 2 1 1 1 f 2 2 f c . . . . . . .
. . . . . . . f a 1 1 1 b f f 1 1 f a b f 5 f f 8 1 1 1 1 1 1 1 2 a b 2 8 e 5 f 1 2 1 1 1 1 1 2 2 1 1 1 1 2 8 2 f . . . . . . .
. . . . . . . f 8 1 7 7 5 f f 9 1 1 f 8 2 f . f b 1 1 1 1 1 1 1 b b b b 8 8 f 1 1 9 1 1 1 9 1 2 2 1 1 1 1 1 e a 1 f . . . . . .
. . . . . . . f b 1 1 7 5 f f a 8 a 1 e 7 f . f 3 2 1 1 1 1 1 1 2 b b 8 b f 3 1 f 1 1 1 1 1 1 2 2 3 1 1 1 1 1 f 2 f . . . . . .
. . . . . . . . f 8 2 8 8 8 f 8 8 b a f f c . c f f f b a f f f f f 5 e e f b 8 1 1 1 1 1 1 1 f f 9 1 1 1 1 1 9 a f . . . . . .
. . . . . . . . . f f f f f b a 2 b f f f . . f e e e e e f 5 5 5 f e e e f 1 f 1 1 1 1 1 f 1 1 1 1 f 1 1 1 1 1 a b f . . . . .
. . . . . . . . . . e e f . f f 4 b f . . . . f e 4 4 4 e f f f 5 f e e 4 f 1 e 2 2 2 2 f 1 1 1 1 9 1 f 2 2 2 2 f 2 f . . . . .
. . . . . . . . . f f 5 f f . f f f . . . . f 1 1 f f f f f 5 5 5 f f f f f 1 e 2 2 2 2 f 1 1 1 1 1 9 f 2 2 2 2 f 2 f . . . . .
. . . . . . . . . f 5 5 5 f . . . . . . . c 1 1 1 1 1 b f f f f f c f 8 8 f 1 e 2 2 2 2 f 2 1 1 1 b 2 f 2 2 2 2 f 8 f . . . . .
. . . . . . . . . . f f f . . . . . . . . f 1 f f 1 1 f 2 b e e e b 9 5 5 f 1 f 3 1 1 3 1 e b b b 2 8 1 1 1 1 1 3 2 f . . . . .
. . . . . . . . . . . . . . . . . . . . . f 1 1 1 7 f f 1 f 2 2 2 f 2 f a f 1 5 1 1 1 9 1 f f 8 8 f a 1 1 1 1 9 3 a f . . . . .
. . . . . . . . . . . . . . . . . . . . f 1 1 1 1 1 4 f 1 e 2 2 2 e 1 f a e f a f 1 1 1 1 9 1 2 2 d 1 1 1 1 1 f 8 f . . . . . .
. . . . . . . . . . . . . . . . . . . . 1 1 f 9 2 a f 1 1 e 2 2 2 e 1 c f b f a 5 1 1 1 1 1 1 2 2 1 1 1 1 1 9 9 a f . . . . . .
. . . . . . . . . . . . . . . . . . . . 6 1 1 1 9 f f 1 f e 2 2 2 e f a f 7 f f 2 f 1 1 1 1 1 2 2 1 1 1 1 1 f b f f . . . . . .
. . . . . . . . . . . . . . . . . . . . f f a 1 a f e f f 2 2 2 2 2 f f 8 f 8 f b b f 1 1 1 1 2 2 1 1 1 1 f 5 a f . . . . . . .
. . . . . . . . . . . . . . . . . . . . . . f f f b b e f 2 2 2 2 2 f e 3 e f f f 8 2 f 5 1 d 2 2 3 1 a f 8 5 f . . . . . . . .
. . . . . . . . . . . . . . . . . . . . . f 1 1 1 f e a f f 2 2 2 f f 3 f 4 1 1 7 f b b 7 b f f f f a b 2 b f . . . . . . . . .
. . . . . . . . . . . . . . . . . . . . f 1 1 1 1 1 f 8 f f f 2 f f f f f 1 1 1 1 d f f b b b 2 2 b b 7 f f . . . . . . . . . .
. . . . . . . . . . . . . . . . . . . . f 1 1 1 1 1 8 e f . f f c . f f a 1 1 1 2 4 f . f f f f f f f f . . . . . . . . . . . .
. . . . . . . . . . . . . . . . . . . . f f 1 a a a f 4 f . . . . . f f f a b 3 b f f . . . . . . . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . . . . . . . f b 5 4 f 2 f . . . . . . . f 9 f a 2 5 f . . . . . . . . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . . . . . . . f f f f 3 8 f . . . . . . . c 8 1 f f f 8 . . . . . . . . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . . . . . . . f 1 1 1 1 8 f . . . . . . . f a 1 1 b 2 7 . . . . . . . . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . . . . . . . b 1 1 1 8 8 f . . . . . . . f a 2 1 1 9 7 . . . . . . . . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . . . . . . f 1 1 1 f a b f . . . . . . . f a 8 f 1 1 1 f . . . . . . . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . . . . . f f f f 3 2 f 5 f . . . . . . . f 5 6 1 1 f f f f . . . . . . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . . . . f f 1 1 1 f a a f f . . . . . . . f f b b f 1 1 1 f f . . . . . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . . . f 1 1 1 1 8 2 f 8 e f . . . . . . . f 2 8 f 2 1 1 1 3 1 f . . . . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . . . f 1 1 1 b b 2 7 f f f . . . . . . . f f f 5 8 8 3 b a b f . . . . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . . . f f f f f f f f . . . . . . . . . . . . . f f f f f f f f . . . . . . . . . . . . . . . . . .
`,
  },
  {
    label: "robed wizard",
    size: "64×64",
    literal: `
. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . f f f . . . . . . . . . . . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . f a a a f f . . . . . . . . . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . f a a a a a a c c c f . . . . . . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . f a a a a a c a c c c c f . . . . . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . f a a a a a a c c c c c f . . . . . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . f a a a a c c a c c f c c c f . . . . . . . . . . . . . . . . . .
. . . . . . . . . . . . . f f f f f . . . . . . . . . . . . . c a a a a c c c c f . . . f c f f . . . . . . . . . . . . . . . .
. . . . . . . . . . . . f 4 4 4 4 4 . . . . . . . . . . . . f a a a a a c c c c f . . . . f f . . . . . . . . . . . . . . . . .
. . . . . . . . . . . . f 4 f f f 4 f . . . . . . . . . . . f a a a a a a c c c c f . . . . . . . . . . . . . . . . . . . . . .
. . . . . . . . . . f 4 4 f f 5 5 f 4 4 f . . . . . . . . f a a a a a a a c c c c f . . . . . . . . . . . . . . . . . . . . . .
. . . . . . . . . . f f f f . . . . f 4 4 f . . . . . . f a a a a a c c c c c c c f . . . . . . . . . . . . . . . . . . . . . .
. . . . . . . . . f f f . . 9 . 1 . f f 4 f . . . . . . f a c 5 5 5 5 c c c c c c c f . . . . . . . . . . . . . . . . . . . . .
. . . . . . . . . f f . . 5 9 9 7 . . f f f . . . . . 5 c c 5 f f c 5 f f f c c c c f . . . . . . . . . . . . . . . . . . . . .
. . . . . . . . . . f . 9 9 9 9 9 9 . f f f . . . . . f c c 5 a a c 5 c c c c c f f f . . . . . . . . . . . . . . . . . . . . .
. . . . . . . . . . . 9 9 9 1 9 9 9 5 f f f . . . . . f f f 5 5 5 5 5 f f f f c c c c . . . . . . . . . . . . . . . . . . . . .
. . . . . . . . . . 5 9 9 9 1 9 9 9 5 f f . . . . f f a a a a a a a a a a a a f f c c . . . . . . . . . . . . . . . . . . . . .
. . . . . . . . . . . . 9 9 9 9 9 9 5 f . . . f f a a a a a a a a a a a a a a a c f f f f f . . . . . . . . . . . . . . . . . .
. . . . . . . . . . 5 . . 9 9 9 9 5 f . . a a c f f f f 4 4 4 4 4 4 4 f f f f a a a c c c c c f f . . . . . . . . . . . . . . .
. . . . . . . . . . 5 f . . 9 . . f f . f f f f f f f c 1 1 4 d d 4 1 1 4 4 c f f f c c c c c c f . . . . . . . . . . . . . . .
. . . . . . . . . . f 4 f f . . f 4 f . f f f f f f f 2 d 1 1 d d 1 1 7 5 4 2 2 2 f f f f f c c c f . . . . . . . . . . . . . .
. . . . . . . . . . . f f f f f 4 f . . . f f f f f f 5 d f f d d d f d d 4 1 d d 7 a f f f f f f . . . . . . . . . . . . . . .
. . . . . . . . . . . . f f f 4 f f . . . . . f f f f 5 d f 4 d d d f d d 4 1 4 d 2 5 f f f f f f . . . . . . . . . . . . . . .
. . . . . . . . . . . . . f f f f f . . . . . . . f 4 c d d 4 d 4 d d d 4 1 d 4 d f c f f f f f . . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . 5 4 f f . . . . . . . c f 1 4 1 1 1 1 1 1 d 1 1 1 c c c c c 5 f . . . . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . f 4 f f . . . . . . c c c 1 1 1 1 3 3 1 1 1 2 1 d c c c 5 5 f f . . . . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . f 4 f f . . . . . . c c c c 1 1 2 1 1 2 4 1 3 1 1 c c 5 5 f f . . . . . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . f 5 5 4 . . . . . . . 5 c a 1 8 1 1 1 1 1 3 1 9 d f 5 4 f c c f . . . . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . f 4 4 4 . . . . . . f 4 5 f 1 1 1 1 1 1 1 2 1 1 c 5 f c c c c c f . . . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . 5 f f f . . . . . . f f 5 4 1 1 1 1 1 1 1 1 1 1 f f c c c c a a f . . . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . 5 f f f . . . . . f a c f 4 1 1 1 1 1 1 1 1 1 f 4 c c c c a a a c f . . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . f 4 f . . . . f c a c c c 1 1 1 1 1 1 1 1 a f c c c a a a a a a c f . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . 5 4 f f f f f . f a a c c c 1 1 1 1 1 1 1 3 d c c a c a c a a a a c f . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . 5 f f d c 4 a f c c c f a c 1 1 1 1 1 3 1 4 c c c a c a c a a a a c f . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . f d 4 d 4 5 a c f c c f a c 1 5 1 1 1 1 3 4 c c a c c c f a a a a c c 5 . . . . . . . . . . . . . .
. . . . . . . . . . . . . . f d d 4 4 f 5 a a c c c a c 4 f 5 1 1 1 3 5 c a a c c f f c a a a a c f . . . . . . . . . . . . . .
. . . . . . . . . . . . . . f 4 4 4 4 f 5 a a a c f a a 5 f f 1 1 1 f 4 a a a c c f f a a a a a c f . . . . . . . . . . . . . .
. . . . . . . . . . . . . . f d d 4 4 f 5 a a a c c a a 5 f c 1 1 3 f 5 a a a c c c f a a a a a c c f . . . . . . . . . . . . .
. . . . . . . . . . . . . . 5 e f f f f f c a c c c a a 5 f a a c c c 5 a a a a c c f a a a a a c c f . . . . . . . . . . . . .
. . . . . . . . . . . . . . . f f e f f f c a c c f a a 5 f c f c c c 5 a a a c c c f c a a a a a c c f . . . . . . . . . . . .
. . . . . . . . . . . . . . . f 4 f f f f c c c c f a a 5 f f 5 5 4 f 5 a a a c c c f a a a a a a c c f . . . . . . . . . . . .
. . . . . . . . . . . . . . . f 4 f f f f c c c c c a a 5 f e f f 5 f 5 a a a c c c f 4 5 5 a a a c c c f . . . . . . . . . . .
. . . . . . . . . . . . . . . f 4 f f f f c c c c c a a 5 f f 5 5 5 f 5 a a a c c c f 5 5 5 a a 5 c c c f . . . . . . . . . . .
. . . . . . . . . . . . . . . f 4 f f f 4 c c c f c a a 5 c c f f f c 5 a a a c c c 4 f f f 5 5 a c c c f . . . . . . . . . . .
. . . . . . . . . . . . . . . . f 4 f f 4 4 c f f c a a 5 c c c c 4 c 5 a a a c c c f e 4 4 f 5 a c c c c . . . . . . . . . . .
. . . . . . . . . . . . . . . . f 4 f 4 f f f 5 5 c a a 5 c c 4 2 5 c 5 a a a a c c f 4 d d 4 f f c c 4 c . . . . . . . . . . .
. . . . . . . . . . . . . . . . f 4 f c f 5 5 5 f c a a 5 c c 4 5 c c 5 a a a a c c f 4 d d 4 f f 5 c c 4 . . . . . . . . . . .
. . . . . . . . . . . . . . . . f 4 f f f 5 5 5 f c a a 5 c c f c 4 c 5 a a a a c c c 4 d 4 4 f f f 4 c 4 . . . . . . . . . . .
. . . . . . . . . . . . . . . . f 4 f 5 5 5 5 5 f a a a 5 c c f c 4 c 5 a a a a c c c c 2 e e c c f f 5 c . . . . . . . . . . .
. . . . . . . . . . . . . . . . f 4 f 5 5 5 5 f c a a c 5 c c c c 4 a 5 a a a a c c c c f f f 4 c c f 4 f . . . . . . . . . . .
. . . . . . . . . . . . . . . . . f f f 5 5 5 f c a a c 5 c c 5 c 4 c 5 a a a a c c c c c f f f 4 c 4 c f . . . . . . . . . . .
. . . . . . . . . . . . . . . . f f f f 5 5 5 f c a a c 5 c c 4 5 c c 5 c a a a a c c c c c f f f 4 f f . . . . . . . . . . . .
. . . . . . . . . . . . . . . . . f 4 4 f 5 f c c a c c 5 c c f c e a 5 c a a a a c c c c c f f f . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . . . f f f 5 5 f c a a c c 5 c c f c 5 a 5 c a a a a c c c c c f f f . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . . . f f f 5 5 f c a a c c 5 c c f c 5 a 5 c c a a a c c c c c c f f . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . . . f f f 5 f c c a c c b c c c 4 c 5 c 5 5 c c a a a c c c c c f f 5 . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . . . f f f 5 c c a a c 4 b c c c f 5 c a f 5 c 5 a a a c c c c c c f f . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . . . f f f 5 c c a a c 5 5 c c c f c 5 c f 5 5 5 c a a c c c c c c f f . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . . . . f f f c c a c 5 5 3 f c c f c 5 c f 5 c 5 c c a a c c c c c c f f . . . . . . . . . . . . .
. . . . . . . . . . . . . . . . . . 4 f c a c 5 5 c c 4 f c c 5 5 5 c f 5 c c 5 5 c c c c c c c c c f f f . . . . . . . . . . .
. . . . . . . . . . . . . . . . . . 4 f 5 c 5 f f 5 5 5 c c c c c c c f 5 5 5 5 5 5 c c c c c c c c c f f . . . . . . . . . . .
. . . . . . . . . . . . . . . . . . 4 f f 4 f f c f f 4 c c c c c c c c f f f f f 5 5 2 c c c c c c 4 4 4 f . . . . . . . . . .
. . . . . . . . . . . . . . . . . . 4 f f f f c c c c f c c c c c c c c f c c c f f f 5 5 5 c c 4 5 4 4 f . . . . . . . . . . .
. . . . . . . . . . . . . . . . . . . . . f f f f f f f f . . . . . . f f f c c c f f . . f f f f . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . f f f f f f . . . . . . . . . . . . . . . . . . . . . .
`,
  },
  {
    label: "pirate ship",
    size: "64×64",
    literal: `
. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . f f f . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . f 4 f f f f f f . . . . . . . . . . . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . f f f f f f f f c c c c . . . . . . . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . f 4 f f f 1 1 1 f f f f . . . . . . . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . f 4 f f 1 f 1 f f f f . . . . . . . . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . f 4 f f 1 f 1 f f f a . . . . . . . . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . f 4 f f f 1 1 1 f f f . . . . . . . . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . f 4 f f f f f f f f f f . . . . . . . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . f 4 f . f f f f f f f . . . . . . . . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . . . . . . . . . . f f f f f f f f f f f f f f f f . . . . . . . . . . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . . . . . . . . . a 5 f f f f f f f f f f f f f f 5 f . . . . . . . . . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . . . . . . . . . a f f f f f f f f f f f f f f f f . . . . . . . . . . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . . . . . . . . . . f f f f f f f f f f f f f f . . . . . . . . . . . . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . . . . . . . . . . f f f f f f f f f f f f f f . . . . . . . . . . . . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . . . . . . . . . . f f f f f f f f f f f f f f . . . . . . . . . . . . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . . . . . . . . . . f f f f f f f f f f f f f f f . . . . . . . . . . . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . . . . . . . . . . f f f f f f f f f f f f f f f . . . . . . . . . . . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . . . . . . . . . . . f f f f f f f f f f f f f f f . . . . . . . . . . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . f f f . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . . . . f f f f f f f f f f f f f f f f f f f f f f f f f f f f . . . . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . . . f 5 f 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 f 5 f . . . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . . . . f f f f f f f f f f f f f f f f f f f f f f f f f f f f . . . . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . . . . . f f f f f f f f 1 1 1 1 1 1 1 f f f f f f f f f f . . . . . . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . . . . f f f f f f f f 1 1 1 1 1 1 1 1 1 f f f f f f f f . . . . . . . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . . . . f f f f f f f 1 1 1 1 1 1 1 1 1 1 1 f f f f f f f . . . . . . . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . . . f f f f f f f f 1 1 f f 1 1 f f f 1 1 f f f f f f f . . . . . . . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . . . f f f f f f f f 1 1 f f 1 1 f f f 1 1 f f f f f f f . . . . . . . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . . f f f f f f f f f 1 1 f f 1 1 f f f 1 1 f f f f f f f . . . . . . . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . . f f f f f f f f f 1 1 1 1 1 f 1 1 1 1 1 f f f f f f f . . . . . . . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . . f f f f f f f f f f 1 1 1 f f 1 1 1 1 f f f f f f f f . . . . . . . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . . f f f f f f f f f f f 1 1 1 1 1 1 1 f f f f f f f f f . . . . . . . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . . f f f f f f f f 1 7 f f 1 f 1 f 1 f f 1 7 f f f f f f . . . . . . . . . . . . . . . . . . . . .
. . . . . . . . . . . . . . . . f f f f f f f 1 1 1 1 f f f f f f f 1 1 1 f f f f f f . . . . . . . . . . . . . . . . . . . . .
. . . . f f f . . . . . . . . . . f f f f f f f f 4 1 1 7 f f f 1 1 1 f f f f f f f f . . . . f f f f f f f f f f f f f f . . .
. . . f 5 5 f f . . . . . . . . . f f f f f f f f f f f 1 1 1 1 1 f f f f f f f f f f . . . . f 5 5 5 5 5 5 5 5 5 5 5 5 f . . .
. . . f 5 f 5 f f . . . . . . . . f f f f f f f f 3 1 1 1 f f f 1 1 1 f f f f f f f f f . . . f 5 f f f 5 f f 5 f f f f f . . .
. . . . . f f 4 4 f f . . . . . . . f f f f f 1 1 1 1 f f f f f f f 1 1 1 f f f f f f f . . . . 5 f a f 5 f a 5 f a f f . . . .
. . . . . . f f 4 4 f f . . . . . . . f f f f f 1 7 f f f f f f f f f 1 8 f f f f f f f . . f f f f f f f f f f f f f f f . . .
. . . . . . . f f 4 4 f f . . . . . . f f f f f f f f f f f f f f f f f f f f f f f f f f . f 5 5 5 5 5 5 5 5 5 5 5 5 5 f . . .
. . . . . . . . f f 4 4 f f f f f f . . f f f f f f f f f f f f f f f f f f f f f f f f f f f 5 5 f f f f f f f f f f f f . . .
. . . . . . . . . f 4 f 5 5 5 5 5 5 f f c . . . . . . . . . f 4 4 f . . . . . . . . . . . f 5 5 f 4 4 4 4 4 4 4 4 4 4 f . . . .
. . . . . . . . . c f f 5 f f f f 5 5 5 5 f f . . . . . . . f 4 4 f . . . . . . f f f f f 5 5 f 4 4 f f f f f f f f f f . . . .
. . . . . . . . . c 5 5 f f f f f f f 5 5 5 5 f . . . . . . f 4 4 f . . . . . . f 5 5 5 5 5 5 f 4 f f 9 6 9 9 f f f f f . . . .
. . . . . . . . . c 5 5 f f f f f f f f 5 5 5 5 f f . . . . f 4 4 f . . . . . . f 5 5 5 5 5 f 4 4 4 f 9 6 9 9 f 4 4 4 f . . . .
. . . . . . . . . . f 5 f f f f f f f f f f 5 5 5 f . . . . f 4 4 f . . . . . . . f 5 f 4 4 4 4 4 4 f 9 6 9 9 f 4 4 4 f . . . .
. . . . . . . . . . f f f f 4 4 4 4 4 4 4 4 4 f 5 5 f f f f f f f f f f f f f f f f 5 f f f f f f f f 9 6 9 9 f f f f f . . . .
. . . . . . . . . . . f f f 4 4 4 4 4 4 4 4 4 4 f 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 f f f f f f f f f f f f f f f f f . . . .
. . . . . . . . . . . . f f 4 4 4 4 4 4 4 4 4 4 4 f f f f f f f f f f f f f f f f f f 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 f f . . . .
. . . . . . . . . . . . f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f . . . . .
. . . . . . . . . . . . . f f f f f f f f f f f f f f f f f f f f f f f f f f e f f f e f f f f f f f f f f f f f f f . . . . .
. . . . . . . . . . . . . f f f f f f f f f f f f f f 5 f f f f f f f 5 f f 5 f f f f f f f f 5 f f f f f f f f f f . . . . . .
. . . . . . . . . . . . . f f f f f f f f f f f f f f 5 f f f f f f f 5 f f 5 f f f f f f f f 5 f f f f f f f f f f . . . . . .
. . . . . . . . . . . . . f f f 4 4 4 4 4 4 4 4 4 4 4 5 f f f f 4 4 4 5 f f 5 f 4 4 4 f f f f 5 4 4 4 4 4 4 4 4 f . . . . . . .
. . . . . . . . . . . . . . f f f 4 4 4 4 4 4 4 4 4 4 f 5 5 5 f 4 4 4 f 5 5 5 f 4 4 4 f 5 5 5 f 4 4 4 4 4 4 4 4 f . . . . . . .
. . . . . . . . . . . . . . f f f f 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 f f . . . . . . .
. . . . . . . . . . . . . . . f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f . . . . . . . .
. . . . . . . . . . . . . . f . f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f . . . . . . . . .
. . . . . . . . . . . . . f 9 f . f f f f f 9 f f f f f f f f f f f f f f f 1 9 f f f f f f f f f f f f f f f f . . . . . . . .
. . . . . . . . . . . . f 9 9 1 f . f f f 9 9 9 f f f f f 1 1 f f f f f f f 1 9 9 f f f f f 1 9 f f f f f 1 9 9 f . . . . . . .
. . . . . . . . . . . f 1 1 8 1 9 f f f 1 9 8 1 9 f f f 9 8 1 9 f f f f f 9 8 8 9 1 f f f 9 8 1 9 f f f 1 1 8 9 1 f . . . . . .
. . . . . . . . . . f 9 9 8 8 8 8 9 9 9 8 8 8 8 8 1 9 1 8 8 8 1 9 f f 1 9 1 8 8 8 8 9 f f 8 8 8 8 1 9 1 8 8 8 8 1 9 f . . . . .
. . . . . . . . . . . f f f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 9 1 8 8 8 8 8 8 8 8 1 1 8 8 8 8 8 8 8 8 8 8 8 8 f . . . . . .
. . . . . . . . . . . . . . . . . f f f f f f . . . . f f f 8 8 8 8 8 8 8 8 f f . . . . f f f f f f f . . . . . . . . . . . . .
. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . f f f f f f f f . . . . . . . . . . . . . . . . . . . . . . . . . .
`,
  },

  // --- 160×120 — full-screen Arcade backgrounds ----------------------------
  {
    label: "ocean sunset",
    size: "160×120",
    literal: `
a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a
a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a
a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a
a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a
a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a
a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a 3 3 3 3 3 a a a a a a a 3 3 3 3 3 3 3 3 3 a a a a a a a a 3 3 3 3 3 3 3 3 3 3 a a 3 3 3 3 3 3 3 3 3 3 a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a
a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a 3 3 3 3 3 a a a a a a a 3 3 3 3 3 3 3 3 3 a a a a a a a a 3 3 3 3 3 3 3 3 3 3 a a 3 3 3 3 3 3 3 3 3 3 a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a
a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a 3 3 3 3 3 3 3 a a a a a a 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a
a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a 3 3 3 3 3 3 3 a a a a a a 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a
a a a a a a a a a a a a a a a a a a a a a a a a a 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 a a a a a a a a a a a a a a a a a a a a a a a a a a a a
a a a a a a a a a a a a a a a a a a 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 a a a a a a a a a a a a a a a a a a a
a a a a a a a a a a a a a a a a a a 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 a a a a a a a a a a a a a a a a a a a
a a a a a a a a a a a 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 a a a a a a a a a a a a a a
a a a a a a a a a a a 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 a a a a a a a a a a a a a a
a a 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 a a
a a 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 a a
3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3
3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3
3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3
3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3
3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3
3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3
3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3
3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3
3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3
3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3
3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3
3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 2 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 2 2 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3
3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 2 3 2 2 2 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 2 3 3 3 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 3 2 2 2 2 2 2 3 2 3 3 2 3 2 2 2 2 2 2 3 3 2 2 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3
3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 2 1 1 1 1 3 2 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 2 2 2 2 2 3 4 4 4 4 4 4 4 2 2 2 2 2 2 2 2 2 4 4 4 4 4 4 3 2 2 2 2 3 4 4 4 4 4 4 3 2 2 2 2 2 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3
3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 1 1 1 1 1 3 3 3 2 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 4 4 4 4 4 4 3 2 3 2 4 4 4 4 4 2 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 2 4 4 4 4 4 4 4 4 4 4 4 2 4 4 4 4 4 4 4 4 3 2 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 2 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3
3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 1 1 1 1 1 1 1 1 1 1 1 2 3 3 3 3 3 3 3 3 3 2 3 3 3 3 3 3 3 3 3 3 3 4 4 4 4 4 4 3 3 3 2 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 2 3 2 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3
3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 1 1 1 1 1 1 1 1 1 1 1 2 3 3 3 3 3 3 3 3 3 2 4 4 4 4 4 4 4 3 2 2 2 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 2 2 2 3 2 4 4 4 4 4 2 2 3 3 3 3 3 3 1 1 1 1 1 1 1 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3
3 3 3 3 3 3 3 3 3 3 3 3 2 3 3 2 2 3 3 1 1 1 1 1 1 1 1 1 1 1 3 3 3 3 3 3 3 3 3 3 2 4 4 4 4 4 4 4 3 2 2 2 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 2 2 2 2 2 4 4 4 4 4 2 2 3 3 3 3 3 3 1 1 1 1 1 1 1 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3
3 3 3 3 3 3 3 3 3 3 3 3 3 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 3 2 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 3 1 1 1 1 1 1 1 1 1 1 1 3 2 3 3 3 3 3 3 3 3 3 3 3 3 3 3
3 3 3 3 3 3 3 3 3 2 2 3 3 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 3 2 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 3 1 1 1 1 1 1 1 1 1 1 1 3 3 3 2 3 3 3 3 3 3 3 3 3 3 3 3
3 3 3 3 3 3 3 3 3 3 3 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 2 4 2 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 2 3 1 1 1 1 1 1 1 1 1 1 1 3 3 3 3 2 2 3 3 3 3 3 3 3 3 3 3
3 3 3 3 3 3 3 3 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 2 3 2 3 3 3 3 3 3 3 3 3
3 3 3 3 3 3 3 3 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 2 2 2 2 2 2 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 2 3 3 3 3 2 3 3 3 3 3 3
3 3 3 3 3 3 2 2 3 3 3 3 3 3 2 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 2 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 2 3 3 3 3 3 3
3 3 3 3 3 2 2 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 2 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 2 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 2 2 3 3 3 3
3 3 3 3 2 2 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 2 2 3 3 3 3
2 2 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 3 3
2 2 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 2 2
4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4
4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4
4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4
4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4
4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4
4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4
4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 1 1 1 1 1 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4
4 4 4 4 4 4 4 4 4 4 4 4 4 2 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 1 1 1 1 1 1 1 1 1 1 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4
4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 1 1 1 1 1 1 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 5 5 5 5 5 5 4 4 4 4 4 4 5 5 5 5 5 5 5 4 4 4 5 5 5 5 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 1 1 1 1 1 1 1 1 1 1 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4
4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 1 1 1 1 1 1 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 5 5 5 5 5 5 4 4 4 4 4 4 5 5 5 5 5 5 5 4 4 4 5 5 5 5 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4
4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 1 1 1 1 1 1 1 1 1 1 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 4 4 4 4 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4
4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 2 2 2 2 2 1 1 1 1 1 1 1 1 1 1 2 2 2 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 4 4 4 4 4 4 4 4 4 4 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4
4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 4 4 4 4 4 4 4 4 4 4 4 4 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4
4 4 4 4 4 4 4 4 4 4 4 4 2 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 4 4 4 4 4 4 4 4 4 4 4 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4
4 4 4 4 4 4 4 4 4 4 4 4 2 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 4 4 4 4 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4
4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 4 4 4 4 4 4 4 4 f f f f 5 4 4 4 4 4 f f f f 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4
4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 4 4 4 f f f 4 4 4 4 f f f f 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4
4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 4 4 4 4 f f f 4 4 4 f f f 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4
4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 f f f f f f f f f 4 f f 5 5 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4
4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 f f f f f f f f f f 4 f f f f f f f f 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4
4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 f f f f f f f f f f f f f f f f f f f f f 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4
4 4 4 4 4 4 4 4 4 4 4 4 4 4 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 f f 5 5 5 5 5 5 5 f f f f f f f f f f f f f f 5 5 5 4 4 4 4 4 4 4 4 4 4 4 4
4 4 4 4 4 4 4 4 4 4 4 4 4 4 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 f 5 5 5 5 5 f f f f f f f f f f f f 5 5 5 5 f 5 5 5 4 4 4 4 4 4 4 4 4 4 4 4
4 4 4 4 4 4 4 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 f f f f f f f f f f f f f f 5 5 5 5 5 5 5 5 5 5 5 5 4 4 4 4 4 4 4
4 4 4 4 4 4 4 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 f f f f f f f f f f 5 5 f f f f 5 5 5 5 5 5 5 5 5 5 5 5 4 4 4 4 4 4
4 4 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 f f f f f 5 5 f f f f 5 5 5 f f f 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 4 4
5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 f f f f 5 5 5 f f f f f 5 5 5 f f 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5
5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 f f 5 5 5 5 5 f 5 5 f f 5 5 5 5 f 5 5 5 5 f f f 5 5 5 5 5 5 5 5 5 5 5
5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 f 4 5 5 5 5 5 5 5 5 f f f 5 5 5 5 5 5 5 5 5 f f f 5 f f 5 5 5 5 5 5 5
5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 f 5 5 5 5 5 5 5 5 5 5 f f 5 5 5 5 5 5 f f f f f f f f 5 5 5 5 5 5 5 5
5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 f f f 5 5 5 5 f f f f f f f f f 5 5 5 5 5 5 5 5
5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 f f f 5 5 5 f f 5 5 f f f f f f f 5 5 5 5 5 5 5
5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 f f 5 5 5 f 5 5 5 f f f f f f f f f 5 5 5 5 5
5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 f f 4 5 5 5 5 5 f f 5 f 5 f f 5 f f 5 5 5 5 5
5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 f f f f 5 5 5 5 4 5 f f 5 f f 5 5 5 5 5 5 5 5
5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 f f f 5 5 5 5 5 5 f 5 5 5 f 5 5 5 5 5 5 5 5
5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 f f f 5 5 5 5 5 5 f 5 5 5 5 5 5 5 5 5 5 5 5
5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 f f f 5 5 5 5 5 f f 5 5 5 5 5 5 5 5 5 5 5 5
5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 f f f f f f 5 5 5 5 f 5 5 5 5 5 5 5 5 5 5 5 5 5
5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 f f f f f 5 f f f f f f f f 5 f f f f 5 5 5 5 5 5 5 5 5 5 5 5
5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 f f f f f f f f f f f f f f f f f f f f f f f f f 5 5 5 5 5 5 5 5 5
5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 f f f f f f f f f f f f f f f f f f f f f f f f f f f f f 5 5 5 5 5 5 5
5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 f f f f f f f f f f f f f f f f f f f f f f f f f f f f f 5 5 5 5 5 5 5
5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 5 5 5 5 5 5 5 5 5 5 5 5 5 f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f 5 5 5 5
5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 5 5 5 5 5 5 5 5 5 5 5 f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f 5 5
5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 5 5 5 5 5 5 5 f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f
5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 5 5 5 5 5 5 5 f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f
6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6
6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6
6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6
6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6
6 6 6 6 6 6 6 6 6 6 6 6 9 9 9 9 9 9 9 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 7 7 7 7 7 7 7 7 7 7 7 7 7 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 7 6 7 7 7 7 7 7 7 7 7 7 6 6 6 6 6 6 6 6 9 9 9 9 9 9 9 9 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6
6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 9 9 9 9 9 9 9 9 9 9 9 9 6 6 6 6 6 6 6 6 6
6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 9 9 9 9 9 9 9 9 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 9 9 9 9 9 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6
6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 7 7 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6
6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 4 4 4 4 6 6 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6
6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 5 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 7 6 4 4 4 4 4 4 4 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 9 9 9 9 9 9 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6
6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 5 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 7 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6
6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6
6 6 6 6 6 6 9 9 9 9 9 6 6 6 6 6 6 6 6 6 6 6 6 6 9 9 9 9 9 9 9 9 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6
6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 7 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 6 6 6 6 5 5 5 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 9 9 9 9 9 9 9 9 9 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6
6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 9 9 9 9 9 9 9 9 6 6 6 6 6 6 6 6 6 6 6 6 6 6 5 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 6 6 5 4 4 4 6 6 6 6 6 6 6 6 6 6 9 9 9 9 9 9 9 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6
6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 7 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6
6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 7 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 9 9 9 9 9 9 9 6 6 6 6 6
6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 4 4 4 4 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 9 9 9 9 9 9 9 6 6 6 6 6
6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 9 9 9 9 9 9 6 6 6 6 6 6 6 6 6 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6
6 6 6 6 6 6 6 6 6 6 6 6 6 9 9 9 9 9 9 9 9 9 9 9 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6
6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 4 4 4 4 4 4 4 4 4 4 4 4 4 4 6 6 6 6 6 6 6 4 4 4 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 9 9 9 9 9 9 9 9 9 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6
6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 4 4 4 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6
6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 5 5 5 5 5 5 5 5 5 5 4 4 4 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6
6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 4 4 4 4 4 4 4 4 4 4 4 4 4 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 9 9 9 9 9 9 9 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6
6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 9 9 9 9 9 6 6 6 6 6 6 6 6 6 6 6 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 6 6 6 6 6 6 6 6 6 9 9 9 9 9 9 9 9 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6
6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 9 9 9 9 9 9 9 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6
6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 9 9 9 9 9 9 9 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6
6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 4 4 4 4 4 6 6 6 4 4 4 4 4 4 4 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6
6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 4 4 4 4 4 6 6 6 4 4 4 4 4 4 4 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6
`,
  },
  {
    label: "spooky moonlit forest",
    size: "160×120",
    literal: `
8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 d d d d d d d d d d d d d d d d d d d d d 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8
8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 d d d d d d d d d d d d d d d d d d d d d 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8
8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 d d d d d d d d d d d d d d d d d d d d d 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8
8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 d d d d d d d d d d d d d d d d d d d d d 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8
8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 d d d d d d d d d d d d d d d d d d d d d 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8
8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 d d d d d d d d d d d d d d d d d d d d d 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8
8 8 8 1 8 8 8 8 8 8 8 8 8 8 f f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 d d d d d d d d d d d d d d d d d d d d 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8
8 8 8 8 8 8 8 8 8 8 8 8 8 8 f f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 d d d d d d d d d d d d d d d d d d d d 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8
8 8 8 8 8 8 8 8 8 8 8 8 8 8 f f f 8 8 8 8 8 8 8 8 8 1 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 d d d d d d d d d d d d d d d d d d 1 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8
8 8 8 8 8 8 8 8 8 8 8 8 8 f f f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 d d d d d d d d d d d 1 d d d 1 d 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8
8 8 8 8 8 8 8 8 8 8 8 f f f 8 f f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 d d d d d d d d d d d d d d 1 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8
8 8 8 8 8 8 8 8 8 8 8 8 8 8 f f f f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 d d d d d d d d d d d d a 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8
8 8 8 8 8 8 8 8 8 8 8 8 8 8 f f f f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 d d d d d d d d 1 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8
8 8 8 8 8 8 8 8 8 8 8 8 8 f f f f f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 1 8 8 8 8 8 8 8 8 8 8 8 8 1 1 1 1 1 2 8 8 8 8 8 8 8 8 8 8 8 8 8 1 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f 8 8 8 8 8 8 8 8 8 8 8 8 8
8 8 8 8 8 8 8 8 8 8 8 f f f f f 8 f f f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f 8 8 8 8 8 8 8 8 8 8 8 8 8
8 8 8 8 8 8 8 8 8 8 f f f 8 f f f 8 f f f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f 8 8 8 8 8 8 8 8 8 8 8 8 8
8 8 8 8 8 8 8 8 8 8 8 8 8 8 f f f 8 8 f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f 8 8 8 8 8 8 8 8 8 8 8 8 8
8 8 8 8 8 8 8 8 8 8 8 8 8 f f f f f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 1 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f f 8 8 8 8 8 8 8 8 8 8 8 8
8 8 8 8 8 8 8 8 8 8 8 8 f f f f f f f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f f 8 8 8 8 8 8 8 8 8 8 8 8
8 8 8 8 8 8 8 8 8 8 8 8 f f f f f f f f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f f f f f 8 8 8 8 8 8 8 8 8 8 8
8 8 8 8 8 8 8 8 8 8 8 f f 8 f f f f f f f f f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f f f 8 f 8 8 8 8 8 8 8 8 8 8 8
8 8 8 8 8 8 8 8 8 8 f f f f f f f f f f f f f f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f f f 8 8 8 8 8 8 8 8 8 8 8 8 8
8 8 8 8 8 8 8 f f f f f f f f f f f f f 8 8 f f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f f f f 8 8 8 8 8 8 8 8 8 8 8
8 8 8 8 8 8 8 f f f f f f f f f f f 8 f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 1 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f f f f f 8 8 8 8 8 8 8 8 8 8 8
8 8 8 8 8 f f f f f f f f f f f f f f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f f f f f f f f 8 8 8 8 8 8 8 8 8 8
8 8 8 8 8 f 8 8 f 8 f 8 8 f f f f f f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f 8 f f f f f f f f 8 8 8 8 8 8 8 8 8
8 8 8 8 8 8 8 8 8 8 8 8 f f f f f f f f f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 1 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f f f 8 8 f 8 8 8 8 8 8 8 8 8
8 8 f 8 8 8 8 8 8 8 8 f f f f f f f f f f f f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f f f f 8 8 8 8 8 8 8 8 8 8 8 8
8 8 f 8 8 8 8 8 8 8 f f f f f f f f f f f f f 8 f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f f f f f f f 8 8 8 8 8 8 8 8 8 8
8 8 f 8 8 8 8 8 8 f f f f f f f f f f 8 f f f f f f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f f f f f f f f f 8 8 8 8 8 8 8 8 8
8 8 f f 8 8 8 8 f f f f f f f f f f f 8 8 f f f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f f f f f f f 8 8 8 8 8 8 8 8 8 8
8 8 f f 8 f f f f f f f f f f f f f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f f f f f f f f f 8 8 8 8 8 8 f 8 8
8 8 f f 8 f f f f f f f f f f f f f f f f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f f f f f 8 f f 8 f f f 8 8 8 8 8 f 8 8
8 f f f f f f f f f f f 8 f f f f f f f f f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f f f f f f 8 8 8 8 8 8 8 8 8 f 8 8
8 8 f f 8 8 8 f f 8 8 8 f f f f f f f f f f f f f 8 8 f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f 8 8 8 8 8 8 8 8 8 8 8 8 8 f f f f f f f f 8 8 8 8 8 8 8 f f f 8
8 f f f f 8 8 8 8 8 8 f f f f f f f f f f f f f f f f f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f 8 8 8 8 8 8 8 8 8 8 f f f f f f f f f f f f 8 8 8 8 8 8 f f 8 8
f f f f f f 8 8 8 8 f f f f f f f f f f f f f f f f f f f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f f 8 8 8 8 8 8 8 f f f f f f f 8 f f f f f f f 8 8 8 8 8 f f f 8
f f f f 8 8 8 8 8 f f f f f f f f f f f f f 8 8 f f 8 f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f f f 8 8 8 8 8 8 8 8 f f f f f f 8 f f f f f f f f 8 8 8 8 f f f 8
8 8 f f f 8 8 8 f f f f f f f f f f f f f f f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f f f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f f 8 8 8 8 8 8 8 8 8 8 f f 8 8 8 f f f f f f f f f f 8 f f f f 8
f f f f f 8 8 8 f f f f f f f f f f f 8 8 f f f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f f f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f f f f f f f f f f f f 8 f f f f
f f f f f f f f f f f f f f f f f f f f f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f f f f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f 8 8 8 8 8 8 8 f f f f f f 8 8 8 8 8 8 8 8 8 8 f f f f f f f f f f f f f f f f f f f
f f f f f f f f f f f f f f f f f f f f f f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f f f f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f f 8 8 8 8 8 8 8 8 8 8 8 f f f f f f f f f 8 f f 8 8 f f f f f 8
f f f f f f f f f f f f f f f f f f f f f f f 8 8 8 8 8 8 8 8 8 8 8 8 f 8 8 8 8 8 8 8 8 f f f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f 8 8 8 8 8 8 8 8 f f f f 8 8 8 8 8 8 8 8 f f f f f f f f f f f f 8 8 8 8 8 f f f f f
f f f f f f f f f 8 f f f f f f f f f f f f f f f f 8 8 8 8 8 8 8 8 8 f 8 8 8 8 8 8 8 f f f f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f f f f f f 8 8 8 8 f f f f f f f f f f f f f f f f 8 8 8 f f f f f f
f f f f f 8 f f f f f f f f f f f f f f f f f f f f 8 8 8 8 8 8 8 8 8 f 8 8 8 8 8 8 f f f f f f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f f f f f f 8 8 8 8 f f f f f f f f f f f f f f f f 8 8 f f f f f f
f f f f f f 8 f f f f f f f f f f f f f f f f f f f f f f 8 8 8 8 8 8 f 8 8 8 8 8 8 8 8 f f f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f f f f f 8 8 8 8 8 8 f f f f 8 f f 8 f f f f f f f f f 8 8 f f f f f
f f f f f f 8 8 8 f f f f f f f f f f f f f f f f f f f 8 8 f 8 8 8 8 f 8 8 8 8 8 8 8 8 f f f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f f f f f f f f 8 8 8 8 f f 8 8 f f f 8 f f f f f f f f f f f f f f f f f
f f f f f f f 8 f f f f f f f f f f f f f 8 f f f f f f f f f f 8 8 f f f f 8 8 8 8 f f f f f f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f f f f f f f f 8 8 8 8 8 8 f f f 8 8 f f f f f f f f f f f f f f f f f
f f f f f f 8 f f f f f f f f f f f f f f 8 f f f f f f f f f 8 8 8 8 f f 8 8 8 8 f f f f f f f f f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f f f f f 8 f f 8 8 8 8 8 f 8 8 8 f f f f f f f f f f f f f f f f f f
f f f f f f f f f f f f f f f f f f f f f f 8 f f 8 f f f 8 8 8 8 8 f f f 8 8 8 8 8 f f f f f f f f f f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f f f f f f f 8 8 8 8 8 8 8 8 8 8 f f f f f f f f f f f 8 f f f f f f f
f f f f f f f f f f f f f f f f f f f f f f f 8 8 8 8 f f 8 8 8 8 f f f f f 8 8 8 8 8 8 f f f f 8 f f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f 8 8 f f f f f f f f f 8 8 8 8 8 8 8 8 8 f f f f f f f f f 8 8 8 f f f f f f f
f f f f f f f f f f f f f f f f f f f f f f f 8 8 8 8 8 8 8 8 8 f f f f f f 8 8 8 8 8 f f f f f 8 8 8 8 8 8 8 8 8 f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f f f f f f f f f f f 8 8 8 8 8 f f f f f f f f f f f f f f f f f f f f f f
f f f f f f f f f f f f f f f f f f f f f f f f f f 8 8 8 8 8 8 8 8 f f f 8 8 8 8 8 f f f f f f f 8 8 8 8 8 8 8 8 f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f f 8 f f f f f f f f f 8 8 8 f f f f f f f f f f f f f f f f f f f f f f f
f f f f f f f f f f f f f f f f f f f f f f f f f f 8 8 8 8 8 8 8 f f f f f 8 8 8 f f f f f f f f f 8 8 8 8 8 8 8 f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f f f f f f f f f 8 f f f f f f f f f f f f f f f f f f f f f f f f f f
f f f f f f f f f f f f f f f f f f f f f f f f f f f f 8 8 8 8 f f f f f f f 8 f f f f f f f f f f f f 8 8 8 8 8 f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f f f f f f f f f 8 8 f f f f f f f f f f f f f f f f f f f f f f f f f f
f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f 8 8 8 8 8 8 8 f f f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f f 8 8 f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f
f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f 8 f f f f f f f f f 8 f f f f f f f f 8 8 8 8 8 8 8 f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f f 8 f f f 8 f f f 8 8 8 f f f f f f f f f 8 f f f f f f f f f f f f f f f f f f f
f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f 8 f 8 8 f f f f f f f f f 8 8 8 8 8 f f f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f f 8 8 f 8 f f 8 8 8 8 8 8 8 f f f f f f 8 f f f f f f f f f f f f f f f f f f f f
f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f 8 8 8 f f f f f f f f f f f f 8 f f f f f f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f f 8 8 8 f f f f 8 8 8 8 8 8 8 f f f f 8 8 f f f f f f f f f f f f f f f f f f f f
f f f f f f f f f f f f f f f f f f f f f f f f 8 f f f f 8 8 f f f f f f f f 8 8 f f f f f f f f f f f 8 8 8 8 8 f f f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f f f 8 f f f 8 8 8 8 8 8 8 8 8 8 f f 8 8 8 f f f f f f f f f f f f f f f f f f f f
f f f f f f f f f f f f f f f f f f f f f f f f 8 f 8 f f 8 8 8 8 f f f f f f f f f f f f f f f f f 8 f 8 8 8 f f f f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f f f f f f f f 8 8 8 8 8 8 8 8 8 8 f 8 f f f f f f f f f f f f f f f f f f f f f f f
f f f f f f f f f f f f f f f f f f f f f f f f f 8 8 8 8 8 8 f f f f f f f f f f f f f f f f f f f f 8 8 8 8 f f f f f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f f f f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f f f f f f f f f f f f f f f f f f f f f f f
f f f f f f f f f f f f f f f f f f f f f f f f f 8 8 8 8 8 f f f f f f f f f f f f f f f f f f f f f f 8 8 8 8 f f f f f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f f f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f f f f f f f f f f f f f f f f f f f f f f f
f f f f f f f f f f f f f f f f f f f f f f f f f f f 8 8 8 f f f f f f f f f f f f f f f f f f f f f f f 8 8 f f f f f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f f f f f f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f f f f f f f f f f f f f f f f f f f f f f f f f
f f f f f f f f f f f f f f f f f f f f f f f f f f f f 8 8 8 8 8 8 8 f f f f f f f f f f f f f f f f f f 8 f f f f f f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f f f 8 8 8 f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f f f f f 8 8 8 8 8 8 8 8 8 f f 8 f f f f f f f f f f f f f f f f f f f f f f f f f f
f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f 8 8 8 8 8 8 f f f f f f f f f f f f 8 8 8 f f f f f f f f f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f 8 8 8 8 f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f f f f f f f 8 8 8 8 8 8 8 8 8 f f f f f f f f f f f f f f f f f f f f f f f f f f f f f
f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f 8 f f 6 6 6 6 6 f f f f f f f f 8 8 8 8 f f f f f f f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f f f 8 8 f f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f f f f f f f 8 8 8 8 8 8 f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f
f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f 8 f f 6 6 6 6 6 f f f f f f f f 8 8 f f f f f f f f f f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f f 8 f 8 8 8 f f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f 8 f f f f f 8 8 8 8 8 8 f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f
f f f f f f f f f f f f f f f f f f f f f f f f f f f f 6 f f f f f f f f 6 6 6 6 6 6 6 6 f f f f f f f 8 f f f f f f f f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f 8 f f f 8 f f f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f f f f f f f 8 8 8 8 f f f f f 8 f f f f f f f f f f f f f f f f f f f f f f f f f f f
f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f 6 6 6 6 6 6 6 6 6 6 6 6 f 6 6 f f f f f f f f f f f f f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f f f f 8 8 f f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f f f f f f f f f f 8 8 8 8 f 8 8 f f f f f f f f f f f f f f f f f f f f f f f f f f f f
f f f f f f f f f f f f f f f f f f f f f f f f f f f f f 6 6 6 f f 6 6 6 6 6 6 6 6 6 6 6 6 6 6 f f f f 6 f f f f f f f f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f f f 8 8 f f f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f f f f f f f f f f 8 8 8 8 8 8 8 8 f f f 8 f f f f f f f f f f f f f f f f f f f f f f f f
f f f f f f f f f f f f f f f f f f f f f f f f f f f f f 6 6 6 6 6 6 6 6 6 6 6 6 f 6 6 6 6 6 f f f 6 6 6 f f f f f f f f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f f f 8 8 f f f f f 8 8 8 8 8 8 8 8 8 8 8 8 8 f f 8 f f f f f f 8 8 8 8 8 8 f 8 8 f f f 8 f f f f f f f f f f f f f f f f f f f f f f f f f
f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f 6 6 6 6 6 6 6 6 6 6 f 6 6 6 6 6 f 6 6 6 6 6 f f f f f f f f f f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f 8 8 f f 8 8 f f f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f f f f f f f f 8 8 8 8 8 f 8 8 f f 8 8 f f f f f f f f f f f f f f f f f f f f f f f f f
f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f 6 6 6 6 6 6 6 6 6 f 6 6 6 6 6 6 6 6 6 6 f f f f f f f f f f f f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f 8 f 8 f f f f f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f f f f f f f f f 8 8 8 8 8 8 8 f 8 8 f f f f f f f f f f f f f f f f f f f f f f f f f
f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f 6 6 6 6 6 6 6 6 f f f 6 6 6 6 6 6 6 6 f f f f f f f f f f f f 8 f f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f f f f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f f f f f f f f f f f 8 8 f f 8 f f 8 f f f f f f f f f f f f f f f f f f f f f f f f f f
f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f 6 6 6 6 6 6 6 6 6 f f 6 6 6 6 6 6 6 6 f f 8 f f f f f f 8 f f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f 8 8 8 8 8 8 8 8 8 8 8 8 8 f f f f f f f 8 8 8 8 8 8 8 8 8 8 f f f f f f f f f f f 8 8 8 8 f f 8 8 f f f f f f f f f f f f f f f f f f f f f f f f f f f f f
f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f 6 6 6 6 6 6 6 f f f 6 6 6 6 6 6 6 6 6 6 f f f f f f f f 8 f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f f 8 8 8 8 8 8 8 8 8 8 f f f f f f f 8 8 8 8 8 8 8 8 8 8 f f f f f f f f f f f f f f f 8 8 8 f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f
f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f 6 6 6 6 6 f f f f f f 6 6 6 6 6 6 6 6 f f f f f f f f f f f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f f f f 8 8 8 8 8 8 8 8 8 8 8 f f f f f f 8 8 8 8 f 8 8 8 8 8 f f f f 8 f f f f f f f f f 8 f 8 f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f
f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f 6 6 6 6 6 6 f f 6 6 f 6 6 6 6 6 6 f f f f f f f f f f f f f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f f 8 8 8 8 8 8 8 8 8 8 8 8 f f f f f f f 8 f f f 8 8 8 8 8 f f 8 f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f
f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f 6 6 6 6 f f f f 6 6 6 6 6 6 6 f f f f f f f f f f f f f f f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f f f f 8 8 8 8 8 8 8 8 8 8 f f f f f f f f f 8 f f 8 8 8 f 8 8 8 8 8 f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f
f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f 6 6 6 f f f f f f 6 6 6 6 6 f f f f f f f f f f f f f f f f f f 8 8 8 8 8 8 8 8 8 8 8 8 8 f f f 8 8 8 8 8 8 8 8 8 8 f f f f f f f f f 8 8 f f 8 8 8 8 8 8 8 8 f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f
f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f 6 6 f f f f f f f 6 6 6 6 6 6 f f f f 6 6 f f f f f f f f f 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 f f f f 8 8 8 8 8 8 f f f f f f f f f f 8 8 f f f 8 8 f f 8 8 8 f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f
f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f 6 6 6 f 6 f f f f f f f 6 6 6 f 6 6 6 6 6 6 6 f f f f f 8 8 8 8 8 8 8 8 8 f 8 8 8 8 8 8 f f f f f f f 8 8 8 8 f f f f f f f f f f f 8 8 f f f 8 8 f f 8 8 f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f
f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f 6 6 6 f f f f 6 f f 6 6 6 6 6 6 6 6 6 6 6 6 6 f f f f f f 8 8 8 8 8 8 f f f 8 8 8 8 f f f f f 8 f 8 8 8 8 8 8 8 f 8 f f f f f f f f f 8 f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f
f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f 6 f f f f f f 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 f f f f f f f 8 8 8 8 8 f f 8 8 8 8 8 8 f f f f 8 8 8 8 8 8 8 8 8 f f f f f f f f f f 8 f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f
f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f 6 6 6 6 6 6 6 6 6 6 6 6 6 f f f f f f f f f 8 8 8 8 8 f f f 8 8 8 8 8 f f f f f f f 8 8 8 8 8 f f f f f f f f f f f 6 f f f f f 6 f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f
f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f 6 6 6 6 6 6 6 6 6 6 6 f f f f f f f 6 6 6 8 f f f f 8 8 8 f f f f f f f f f f 8 8 8 f f f f f f f f f f f f 6 f f 6 6 6 6 f f 6 f 6 f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f
f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f 6 6 6 6 6 6 6 6 6 f f f 6 6 6 6 6 6 6 6 f f f f f 6 6 6 f f f f f f 8 8 8 8 8 8 f f f f f f f f f f f 6 f f f f 6 6 6 6 6 6 6 f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f
f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f 6 f f f f 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 f f f f f f f 8 f 8 8 8 f f f f f 6 6 6 6 6 6 6 6 f f 6 6 6 6 6 f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f
f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f 6 f 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 f 6 6 6 6 6 6 6 6 6 6 6 f f f f f f f f f 6 f f f f f f f f f 6 6 6 6 6 6 6 6 f 6 6 6 f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f
f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 f 6 6 6 6 6 6 6 6 6 6 f f f f f f f f f f f 6 f f f f 6 6 6 6 6 6 6 6 6 6 6 6 6 f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f
f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 f f f f f f f f f f 6 f f 6 f f 6 6 6 6 6 6 6 6 6 6 6 6 6 f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f
f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f 6 f 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 f f f f f f f f f f f f 6 f f f f f 6 6 6 6 6 6 6 6 6 6 6 6 6 f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f
f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f 6 f 6 6 6 6 f 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 f f f f f f f f f f f 6 6 f f 6 6 6 6 6 6 6 6 f 6 6 6 6 f f 6 6 f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f
f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f 6 6 6 6 6 f 6 6 6 6 6 6 6 6 6 f 6 6 6 6 6 6 6 6 6 6 f f f f f f f f f 6 6 6 6 6 6 6 6 6 6 6 6 f 6 6 6 6 6 6 6 f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f
f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f 6 6 6 6 6 f f f 6 6 6 6 6 6 6 6 f 6 6 6 6 6 6 6 6 6 f f f f f f f f f f f f f 6 6 6 6 6 6 6 6 6 f 6 6 6 6 f 6 6 6 6 6 6 f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f
f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f 6 6 6 6 6 f f 6 6 6 6 6 6 6 6 f f 6 6 6 6 6 6 6 6 f f f f f f f f f f f f 6 6 6 6 6 6 6 6 6 6 6 f 6 6 6 6 f 6 6 6 f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f
f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f 6 6 f 6 6 f f f f f 6 6 f 6 f 6 6 f f 6 6 6 6 6 6 f f f f f f f f f f f f 6 6 6 6 6 6 6 6 6 6 6 6 f f f 6 6 f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f
f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f 6 6 f f f f f f 6 6 f 6 f 6 6 f f f 6 6 6 6 f f f f f 6 f f f f f f f f f 6 6 6 6 6 6 6 6 6 f f f f 6 6 f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f
f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f 6 f f f f f f f 6 f f f 6 f f f 6 6 6 6 6 6 6 f f 6 f f f f f f f f f f f f 6 6 6 6 f 6 6 f f f f 6 f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f
f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f 6 6 f f f f f 6 6 6 6 f 6 f f f f f f f f f f f f f f 6 6 f f 6 f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f
f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f 6 f f f f 6 6 6 6 6 6 6 6 f f f f f f f f 6 f f f f 6 f 6 6 f 6 6 6 f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f 5 5 f f 5 f f f f f f f f f f f f f f f f
f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f 6 6 6 6 6 6 f f f f f f f f f f f 6 f f 6 f f 6 f f f 6 f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f 5 f 5 f f f f f f f f f f f f f f f f f
f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f 6 f f f f f 6 6 6 f f f f f f 6 6 6 f f f f f f f f f f f f f f 6 f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f
f f f f f f f f f f f f f f f f f f f f f f f f f 5 f f 5 5 f f f f f f f f f f f f f f f f f f f f f f f f 6 6 f f 6 6 6 6 6 6 6 6 f f f f 6 6 f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f c c c c c f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f
f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f 6 6 f 6 6 6 6 6 6 f f f f f f f f f f f f f f 6 f f f f 6 6 f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f c c c c c c c f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f
f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f 6 6 6 6 6 6 6 6 6 6 f f f f f f f f f f f f f 6 6 6 6 f f 6 6 6 6 f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f c c c c c c c c f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f
f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f 6 6 f 6 6 6 6 6 6 6 6 6 6 6 6 6 f f f f f f 6 6 6 6 6 6 6 6 6 6 6 6 f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f c c c c c c c c f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f
f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f 6 6 f 6 6 6 f 6 6 6 6 6 6 6 6 6 6 6 f f f f 6 6 6 6 6 6 6 6 6 6 6 f f f f 6 6 6 f f f f f f f f f f f f f f f f f f f f f f c c c c c c c c c c c f f f f f c f f f f f f f f f f f f f f f f f f f f f f f f f f f f
f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f 6 f f f 6 6 f 6 6 6 6 6 6 6 6 6 6 6 6 f f 6 6 6 6 6 6 6 6 6 6 6 f f 6 6 6 6 6 6 6 f f f f f f f f f f f f f f f f f f f f f c c c c c c c c c c f f f f f c c f f f f f f f f f f f f f f f f f f f f f f f f f f f f
f f f f f f f f f f f f f f f f f c c c c c c c c f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f 6 6 f f f f 6 6 6 6 6 6 6 6 6 f 6 6 6 6 6 6 6 6 6 6 6 6 f f 6 6 6 6 6 6 6 6 6 f f f f f f f f f f f f f f f f f f f f c c f c c c c f f f f f f f c c f f f f f f f f f f f f f f f f f f f f f f f f f f f f f
f f f f f f f f f f f f f f f f f c c c c c c c c c f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f 6 6 f f f 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 f f f f f f f f f f f f f f f f f f f c c f c c c f f f f c c c f f c f f f f f f f f f f f f f f f f f f f f f f f f f f f f f
f f f f f f f f f f f f f f f f f f f c c c c c c c c c f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f 6 6 f 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 f f f f f f f f f f f f f f f f f f c c c c c c c c f f c c c c f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f
f f f f f f f f f f f f f f f f f f f c c c f c c c c c c f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f 6 6 f f 6 6 6 6 f 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 f 6 f f f f f f f f f f f f f f f f f f f c c c c c c c f f c c c c f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f
f f f f f f f f f f f f c c c f f f f c f f c c c c c c c c f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f 6 f f f 6 6 6 f f 6 6 6 6 6 6 f 6 6 6 6 6 6 6 6 6 6 6 6 f 6 6 6 f f f f f f f f f f f f f f f f f f f f f c c c c c c f f c c c c f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f
f f f f f f f f f f f c c c c c c f f f f f c c c c c c c c c f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f 6 6 6 6 f f 6 6 6 6 6 6 f f 6 6 6 6 6 6 6 6 6 6 6 f f 6 6 f f f f f f f f f f f f f c c c c f f f c c c f c c f f f c f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f
f f f f f f f f f f c c c c c c c 8 f f f f f f f c c c c c c f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f 6 6 f f f 6 f 6 6 6 6 6 f 6 6 6 6 6 6 6 6 6 f 6 6 f f f f f f f f f f f f f f f c c c c c f f f c c c c c f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f
f f f f f f f f f f c c c c c c c c f f f f f f f f f c c c c c f f f f f f f f f f f f f c c c c f f f f f f f f f f f f f f f f f f f f f f 6 f 6 6 f f 6 6 6 6 6 6 6 f 6 f f f f f f f f f f f f f f f f f f c c c c f f f c c c c c f c c f f f f f f f f f f f f f f f c c c c c c c f f f f f f f f f f f f f f f f f f f
f f f f f f f f f f f f c c c c c c c c c f f f f f f f f c c c f f f f f f f f f f f f f c c c c c c f f f f f f f f f f f f f f f f f f f f 6 f f 6 f f 6 6 6 6 6 6 6 f f f f f f f f f f f f f f f f f f f c c f f f f f f c c c c f c c c f f f f f f f f f f f f f c c c c c c c c c c c f f f f f f f f f f f f f f f f f
f f f f f c c f f f f f f f f c f f f c c f f f f f f f f f c c f f f f f f f f f f f f f f f f c c c c f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f f c c c f f f f f f c c c c f c c f f f f f f f f f f f f f c c c c c c c c c c f f f f f f f f f f f f f f f f f f f
`,
  },
  {
    label: "glowing crystal cave",
    size: "160×120",
    literal: `
f f f f f f f f f f e e e e 4 4 4 f f f f f f f f c c f e e e 4 4 f c f f f f f c f f f b f f f f f e 4 4 4 f c c c f b f f f f f f b b f f f f f f f f f f f f 4 e 4 f f f f f f f f f f f 4 4 4 e e 4 4 f f f f f f f f f f 4 4 e e e f f f f f 4 e f f f f f f f f f f f f f e e e f f f f f e e e e e e e e f f 4 4 e f f f
f f f f f f f f f e e e e e 4 4 4 f f f f f f f f c c f e e e 4 4 f c f c f f f f f f b b f f f f f e 4 e f f f c f f b f f f f f f b b f f f f f f f f f f f f 4 4 4 f f f f f f f f f f f 4 4 e e e 4 f f f f f f f f f f f 4 4 e e f f f f f f 4 e e f f f f f f e f f f f f f e e e f f f f e e e e 4 e e e f f f 4 f f f e
f f f f f f f f f e e e e e 4 4 f f f f f f c f f c f f 4 e e 4 4 f c f f f f f f f b b f f f f f f f 4 f f f f c f f b f f f f f f b f f f f f f f f f f f f f 4 4 e f f f f f f f f f f f f 4 4 e e 4 f f f f f f f f f f f 4 4 e e f f c c f f 4 4 e e f f f f f e f f f f f f e e e e f f f e e f e 4 e e e f f f f f f f e
f f f f f f f e e e e e 4 4 4 4 f f f f f f f f f c f f 4 4 e 4 4 f c f f f f f f f f f f f f f f f f 4 f f f f c f f f f f f f f f b f f f f f f f f f f f f f 4 4 e f f f f f f c f f f f f 4 4 e e 4 f f f f f f f f f f f f 4 e e f f c c c f 4 4 e e f f f f e e e f f f f f f e e e e f f e e f f 4 e e e e f f f e e e e
f f f f f f f e e e e 4 4 4 4 4 f f f f f f f f f f f f e 4 e 4 4 f c f f f f f b b f f f f f f f f f 4 f f f f f f b f f f f f f b b f f f f f f f f f f f f f 4 4 f f f f f f c c f f f f f 4 4 e e 4 f f f f f f f f f f f f 4 4 e f c c c c f 4 4 e e f f f e e e e e f f f f f f e e e e f e f f f 4 4 e e e e f f e e e e
f f f f f f f e e e e 4 4 4 4 f f f f f f f f f f f f f f e 4 4 f f c f f f f f b b f f f f f f f f f 4 f f f f f f b f f f f f f b f f f f f f f f f c c f f f f 4 f f c c c c c f f c f f f 4 4 e e 4 f f f f f c c f f f f f 4 4 f c c c c c c f 4 4 e e f f e e e e f f f f f f f e e e e f f e f e 4 4 4 e e e f f e e e e
f f f f f f f e e e e 4 4 4 f f f f f f c f c f f f f f f e 4 4 f f c c f c b b b b f f f f f f f f f f f f f f f f b f f f f f f b f f f f f f f f c c c f f f f 4 f f c c c c c c f f f c f 4 4 e e f f c f f f c c c f f c c 4 4 f c c c c c c f 4 4 e e f f e e e e f f f f f f f e e e e f f f f 4 4 4 4 4 e e f f e e e e
f f f f f f f f f e e 4 4 f f f f f f f c f c f f f f f f e 4 4 f f f c c c b b b b f f f f f f f f f f f f f f f f b f f f f f f f f f f c f f f f c c c c f f f 4 f c c f c c c c c f c c f f 4 4 4 f f c c f f c c c f c c c f 4 f c c c c c c c f 4 4 e f e e e e e e f f f f f e e e e e f f f f 4 4 4 4 4 4 e f e e e e f
f f f f f f f f f e e e 4 f f f f f f f c f c f f f f f f e 4 4 f f f c c c b b f f f f f f f f f f f f f f f f f f f f f f f f f f f f c c c f f f c c c c c c f f c c c c c c c c c c c c c f 4 4 4 f f f c c f c c c c c c c f f f c c c c c c c f 4 4 e f e e e e e e f f f f f e e e e e f f f f 4 4 4 4 4 4 e f e e e e f
f f f e f f f e f f e e f f f f f f f c c c f f f f f f f f 4 f f f f c c c b b f f f f f f f f f f f f f f f f f f f f f f f f f f f f f c f f c c c c c c c c f c c f c b c c c c c c c c c f 4 4 4 f f c c c c c c c c c c c c f c c c c c c c c f 4 4 e e e e e e e e f f e e f f f e e e e f f f f 4 4 4 4 4 e f e e e e f
f f f e f f f e e e f e f f f f f c c f f f f f f f f f f f 4 f f f f c c c b b f f f f f f f f f f f f f f f f f f f f f f f f f f f c c f c c c c c c c c c c f c c c f b b f c c c c c c c f 4 4 4 f f c c c c c c c c c c c c c c c c c c c c c f 4 4 e e 4 4 e e e f f f e f f f f f e e e f f f f 4 4 4 4 4 e f f e f f f
f f e e e f f e e 4 e f f f f f f c f c f f f f f f f f f f 4 f f f f f c c b b f f f f f f f f f f f c c c f f f f f f f f f f f f c c f f c c c c c c c c c c c c c f f b b b b c c c c c c f 4 4 4 f c c c c c c c c c c c c c c c c c c c c c c f 4 4 4 e 4 4 e f f f f e e f f f f f e e e f f f f f e 4 4 4 f f f f f f e
f f e e e f f e e 4 4 f f f f f f c f c f f f f f f f f f f f f f f f f c c b b f f f f f f f f f f c c c c c f f f f c c c f f f f f f f c c c c c c c c c c c c c c c b b b b b b c c c c c f 4 4 4 f c c c c c c c c f b c c c c c f f c c c c c c f 4 4 e 4 4 e f f f f e e f f f f f f f e f f f f f e 4 4 e f f f f f f e
f f e e e f f e e 4 4 f f f f f f f f f f f f f f f f f f f f f f f f f f f b b f f f f f f f c f c c c c c c f f f c c c c f f f f f f f c c c c c c c c c c c c c c f b b f f f b f c c c c f 4 4 f c c c c c c c f f b b f c c c f e f f c c c c c f 4 4 4 4 4 e f f f e e e f f f e f f f f f f f f f e 4 4 f f e f f f f e
f e e f f f e e 4 4 4 f f f f f f c f f f f f f f f f c c f f f f f f f f b b b f f f f f f c c f c c c c c c c f f c c c c f f f f f f f c c c c c c c f f f c c c f b b f f f f f b f c c c f 4 4 f c c c c c c b b b b b c c c f f e e f f c c c c f 4 4 4 4 4 e f f f e e f f f f e f f f f f f f f f e 4 f f e e f f f f e
f e e f f f e 4 4 4 4 f f f f f f f f f f f f f f f f c c c f f f f f f f b b b f f f f f f c c f c c c c c c c f f c c c c c f f f f f f c c c c c c b b b b b c c b b b f c f f f f b b c c f 4 4 f c c c c c c b b b b f c c c f e e e e f c c c c f 4 4 4 4 e e f f e e e f f f f e f f f f f f f f f f f f f e f f f f e e
f f f f f e e 4 4 4 4 f f f f f f f f f f f f f f f f f f f f f f f f c f b b f f f f f f f c c c c c c c c c c f c c c c c c c f f f f c c c c c c c b b b b b f b b b f f f f f f f b b c c c f 4 f c c c c c b b f f f c c c c f e e e e f c c c c c f 4 4 4 e e e e e e f f f f f e e f f f f f f f f f f e e e f f e e e e
f f f f e e e e e 4 4 f f f f f f c c f f f f f f f f f 4 f f f f f f c f b b f f f f f f f f c c c c c c c c c f c c c c c c c f f f f c c c c c c b b b b b b b b b b f f c f f f f b b c c c f 4 f c c c c f b f c c c c c c c f e e e e f c c c c c f 4 4 e e f e e e e e f f f e f e e f f f f f f f f e e e e f f e e e e
f f f f e e e e e 4 4 f f f f f c c c f f f f f f f f e 4 4 f f f f f c c f b f f f f f f f c c c c c c c c c c c c c c c c c c c f f c c c c c c c b b b f f b b b b f f f f c f f f f b b c c f f f c c c f b b f c c c c c c c f e e e e f c c c c c f 4 4 e e f e e e e e f f e e f e e f f f f f f f e e e e f f f e e e e
f f f e e e e e e 4 f f f f f f c f c c c f f f f f f e 4 4 4 f f f f c c f b f f f f f c c c c c c c c c f c c c c c c f c c c c f f c c c c c c b b b f f f f b b f f f f f c f c f f b b c c c f c c c c f b f c c c c c c c f f e e e e e f c c c c f 4 4 e f e e e e e f f f e e f f e f f f f f f f e e e f f f e e e e e
f f f e e e e 4 4 4 f f f f f f f c c c c f f f f f e e 4 4 4 f f f f c c f f f f f f f f c c c c c c c f 3 f c c c c c f b c c c f c c c c c c c b b b f f f c f b f f f f f c c c c f f b b c c c c c c c b b f c c c c c c c f e e e e e e f c c c c f 4 4 e f e e e e e f f f e e f f f f f f f f f e e e e f f f e e e e e
f f f e e e e 4 4 4 f f f f f f f f c c c c f f f f e e 4 4 4 f f f f c f f f f f f f f f c c c c c c c f 3 f c c c c f b c c c c c c c c c f c c b b f c f f f f b f f c c c f f f f f f b b c c c c c c f b f f c c c c c c c f e e e e e e f c c c c f 4 4 4 f e e e e e f f f e f f f f f f f f e e e e e e f f f e e e e e
f f f f e e e e 4 f f f f f f f f f f c c c f f f f e e 4 4 4 f f f f c f f f f f f c f f c c c c c c c f 3 f c c c f b b f c c c c c c b f c c c b f f c c c c f f f f c f c c f c f c f b b c c c c c b b b f c c c c c c c c f e e e e e e f c c c c f 4 4 4 e e e e e f f f e f f f f f f f f f e e e e e e f f f e e e e e
f f f f e e e e e f f f f f f f f f f c c c c f f e e e 4 4 4 f f f f f f f f f f f c f f f c c c c c c f 3 f c c c f b f c c c c c c b b f c f f b f c c c c c c f c c c f c f c f f f f b b b c c c b b b f c c c c c c c c c f e e e e e e f c c c c f 4 4 4 e e e e e f f f e f f f f 1 6 f f f e e e e e e f f f e e e e f
f f f f e e e e f f f f f f f f f f f c f c c f f e e e 4 4 4 f f f f f f f f f f f c c f f c c c c c f f 3 3 f c c b b f c c c c c f b b f c f b b f c c c c c c c c c c c c c c c c c c f b b b c c b b f f c c c c c c c c f f e e e e e e f f c c c f 4 4 e e e e e f f f e e f f f 9 1 9 6 f f e e e f e e f f f f e e e f
f f f f e e e e f f f f f f f f f f f c c c c f f e e e e e 4 f f f f f c f f f f f c c c f c c c c c f f 3 3 f c b b c c c c c c c b b b b f b b f f c c c c c c c c c c c c c c c c c c c f b b c c b b f c c c c c c c c c f e e e e e e e e f c c f 4 4 4 e e e e e f f f e f f f f 9 1 9 9 f f e e e e e e e f f f e e e f
f f f f e e f f f e e f f f f f f f f f c f f f e e e e e 4 4 4 f f f f c c f f f f f c c c f c c c c f f 3 3 f c b b c c c b c c c b b b b b b b f f c c c c c c c c c c c c c c c c c c c f b b c b b b f c c c f c c c c c f e e e e e e e e f c c f 4 4 4 e e e e e f f f f f f f 9 9 1 9 9 9 f f f e e e e e f f f f e e e
f f f f e f f f f e e f f f f f f f f f c c f f e e e e e 4 4 4 f f f f c f c f f f f c f c c c c c c f f 3 3 f f b b c c f b b c c b b b b b b f f f c c c c c c c c c c c c c c c c c c c f f b f b b b f c c c f f c c c f e e e e e e e e e e f c f 4 4 e e e f e e f e f f f f 9 9 1 1 9 9 9 9 f f e e e e e f f f f e e e
f e e f e f f f f 4 e 4 f f f f f f f f c c f f e e e 4 4 4 4 4 4 f f f f c c c f f f f f c c f c c f f f f 3 3 f f c c c b b b c c b b b b b b f f c c c c c c c c c c c c c c c c c c c c c f b b b b f c c c c f f f c c f e e e e e e f e e e f f 4 4 4 e e f f f f f e f f f 6 9 9 1 1 9 9 9 1 6 f e e e e f f f f f e e e
f e e e e f f e e 4 4 4 4 f f f f f f f f f f e e e e 4 4 4 4 4 4 f f f f f c c f f f f f f c c f f f c f f f f f c c c c b b b b f b b b b b b f f c c c c c c c c c c c c c c c c c f c c c f f b b b f c c c b f f f c c f e e e e e e f f e e f f 4 4 e e e f f f f e e f f f 6 9 1 1 1 9 9 6 6 6 f e e e f f f f f f e e e
f e e e e f f e 4 4 4 4 e f f f f f f f f f f e f e e 4 4 e 4 4 4 f f f f f f f f f f f f f c c c f c c c f f f f c c c c b b b b b b b b b b b f f c c c c c c c c c c c c c c c c c c c c c c f b b f c c c c b f c c c c f e e e e e e f f f e f f 4 4 e e e f f f e e f f f f 6 9 9 9 9 6 6 6 6 6 f f e f f f f f f f f e e
f e e f f f f e e 4 4 4 4 e f f f f f f f f e e f e e 4 4 e 4 4 4 f f f f f f f f f f f f c c c c f c c c b b f f c c c b b b b b b f f b b b b f c c c c c c c c c c c c c c c c c c c c c c c c f b f c c c c f f c c f f f e e e e e e f f 9 f f f 4 e e e f f f f e f f f f f 6 9 9 9 6 6 6 6 6 6 f f f f f f 6 6 f f f e f
f e f f f f f e e 4 4 4 4 f f f f f f f e e f f f e e 4 e e 4 4 4 4 f f f f f f f 6 9 f f f f c f f c c c f b f f c c c b b b b b f 3 f b b b b f c c c c c c c c c c c c c c c c c c c c f c c c f b c c f c f f f c c f f e e e e e e f f f 6 9 f f e e e f f f f f f f f f f f 6 9 9 9 6 6 6 6 6 6 f f f f f 9 9 9 f f f f f
f e f f f f f e e 4 4 4 4 f f f f f f f e e f f f e e e e e e 4 4 4 4 f f f f f 9 9 1 f f f f f f c c c c c b b f c c c c c b b b f f f b b b b f c c c c c c c c c c c c c c c c c c c c c c c c f b f c f 8 6 b c c c f f e e e e e e f f 9 9 9 f 4 e e e f f f f f f 1 9 f f f 6 9 9 9 6 6 6 6 6 f f f f 8 9 9 9 9 f f f f f
f e e e f f f e e e e 4 4 e f f f f f e e e f f f e e e e e e 4 4 4 4 f f f f 9 9 9 1 f f f f f c c c c c f b b b f c c c c b b b f f f b b b b f c c c c c c c c c c c c c c c c c c c c c c c f f f f f f 1 9 f c c c c f 4 4 4 e e f f f 6 1 6 f 4 e e e f f f f f f 9 9 9 6 f 6 9 9 9 6 6 6 6 9 f f f 1 9 9 1 9 9 f f f f f
e e e e f f e e e e e 4 4 4 4 f f f e e e f f f f f e e 4 4 e e 4 4 4 f f f 6 9 9 9 9 f f f f f c f c c f c f b b f c c c c c b b b 3 f b b b b f f f c c c c c c c c c c c c c c c c c c c c c f f c f f f 6 6 f c c c f e 4 4 4 4 e f f f 6 9 f e e e f f f f f f f 8 9 9 9 9 9 f 9 9 9 6 6 6 6 9 f f 6 9 9 9 9 9 9 f f f f f
e e e f f f e e e e e 4 4 4 4 f f f f f f f f f e f e e 4 4 e e e 4 4 f f 8 9 9 9 1 9 6 f f f c c c c f c f f f f f c c c c c c f c f f f b b b f f f c c c c c c c c c c c f f c c c c c c c c f c f 8 8 c 6 6 c 9 c f f e e 4 e e f f 9 f 6 9 f e e f 4 4 e f f f f 9 9 1 9 9 6 f 9 9 9 6 6 6 6 9 f f 9 9 9 1 9 9 9 f f f f f
e e e f f f f e e e 4 4 4 4 4 f f f f f f f f e e f f e e e e e e 4 4 f f 6 6 9 9 9 9 6 f f f c c c c c f f f f f c f c c c c c c f f 3 f b b b b f c c c c c c c c c c c c f b c c c c c c c f f c f 8 9 8 8 6 9 6 c f 4 4 e e e e f f 6 9 8 6 f e e f 4 4 e e f f f 9 9 9 9 6 6 f 9 9 9 6 6 6 6 9 f 6 9 9 9 6 6 9 9 f f f f f
e e e e e f f f e e 4 4 4 4 4 4 f f f f f f f e e f f f e e e e e 4 4 4 f 6 6 6 9 9 9 6 f f c c c c c c c f 3 f f f f f c c c c f f 3 3 f b b b b f c c c c c c c c c c c c f f c c c c c c f f f c c 8 6 6 8 6 6 8 f e e e e e e f f f f 6 8 f f e e 4 4 e e e f f f 9 9 9 9 6 6 6 f 9 9 6 6 6 6 6 f 9 9 9 9 6 6 6 6 f f f f f
e e e e e f f f e e 4 4 4 4 4 4 f f f f f e e e e f f f f e e e e e 4 4 f 6 6 9 1 9 1 9 f f c c c c c c f 3 3 f f f f f c c c c f f f f f b b b b f c c c c c c c c c c c f f 3 c c c c c c f f f f 3 f b b b b b f f e e e e e e f e e e f e e f f f 4 e e e e f f f f 9 9 9 6 6 6 f 9 9 6 6 6 6 9 8 9 9 9 1 6 6 6 f f f f f f
e e e e e e f f e e 4 4 4 4 4 4 f f f f f e e e e e f f f e e c f e e 4 f 6 6 9 1 9 9 6 f c f f c f c c f b f 3 f c c c f c c f f f f f f b b b b f c c c c c c c c c c c f f 3 f c c c c f f c f 3 3 3 3 3 3 f f f f e e e e e f 2 e e e e e f 4 e e e f e e f f f f f 6 9 9 6 6 6 f 9 9 6 6 6 9 9 6 9 9 9 9 6 6 6 f f f f f f
f e e e e e f f e e 4 4 4 e 4 f f f f f f e e f f e f f e e e 8 6 f e e f 6 6 9 1 9 9 f f f c c f c c c c f b f 3 f c c c f f f f f f 3 f b f b b b f c c c c c c c c c c f f f f c c c c f c c f f f f f 3 f c f f f e e e e f f e e e e e f e e e e f f f e f f f f f f 9 9 1 6 6 8 9 9 6 6 9 9 9 6 6 9 1 6 6 6 f f f f f f e
f e e e e e f f e e 4 4 e e e 4 f f f f f e e f f e f f f e e 8 9 6 f e f 6 6 9 1 9 9 8 c c c c c c f c c f f b b f c f c c f f f f f 3 3 f c b b b f c c c c c c c c c c f f f f c c c f c c c f f b c c c c c c e e e e e e f f e e e e e e e e f f f f f e f f f f f f 9 9 1 6 6 8 6 9 6 6 9 1 9 9 f 9 6 6 6 f f f f f f e e
f f e e e e f f f e 4 4 e e 4 4 4 f f f e e f f f e f f f f f 6 1 9 9 f 6 6 6 9 9 9 9 f c c f f c f f f f f f f b f f c c c c f f b f f 3 f f b b b f c c c c c c c c c f f b b b f c f c c c c f f b c c c f f e e e e e e e f f e e e f e e e e f f f f f f f f 1 9 6 f 8 9 9 6 6 6 6 9 6 6 9 1 9 9 f 9 6 6 6 f f f f f e e e
f f e e e e f f f f e e e e 4 4 4 4 f f e e f f f f f f f f 6 6 9 9 1 f 6 6 6 9 9 9 9 f c f 6 f c c c f f f 3 3 3 3 f f c c f c c f b f 3 3 f b b b f f c c c c c c c c f b b b b b f c c c c f f 3 b c f f b f e e e e e f f f f e e e f e e e f f f f f f f f f 9 9 9 9 f 9 9 9 6 6 f 9 6 6 9 1 6 6 f 9 6 6 6 f f f f f e e e
f f f e e e f f f f e e e e e 4 4 4 f f f f f f f f f f f f 9 1 1 9 9 f 6 6 6 9 9 9 f f f 9 1 f f f f c f f f 3 3 3 3 f f c c c f f f b b f f f b b b b f f c c c c f f f b b b b c c c c c c f 3 f b c b b f f e 4 e e e f f f f e e e f e e f f f f f f f f f f 9 9 6 6 6 f 9 1 6 6 8 6 6 6 9 1 6 6 f 6 6 6 f f 9 f f f e e f
f f f f e e f f f f f e e e e e 4 4 e f f f f f f f f f f f 6 6 6 9 6 f 6 6 6 9 9 9 f 8 9 9 9 f f f f f f f f c b b b f f f f c f f f c f b b f f f b b b b c f c c f b f c f f c f f f f c c f f f b c b b f f e f f e f f f f f f e f e e f f f f f f f f f f f 6 9 9 6 6 f 9 6 6 6 8 6 f 9 9 1 6 6 8 6 6 f 8 9 6 f f f e e f
f f f f e e e e f f f e e e e e e 4 4 f f f f f f e f f f f f 6 6 9 6 9 f 6 6 9 9 9 f 6 6 1 9 f f f f f f c f c c b f b f 8 9 c c c f f f b b f f f f f b b b f b b b b b f f b b b b f f c c f f b f b b c f f e e f 4 f f f f f f e f e e f f f f f f e e e e e e 6 9 6 6 8 f 6 6 6 8 6 f 9 9 9 6 6 6 6 8 f 9 6 6 6 f f f f f
f f f f e e e e f f f e e e f f e e 4 f f f f f f e e f f f f f 6 9 6 6 f 6 6 9 9 f 6 6 9 9 6 f c f f f c c c c c b b b f 6 9 c c c f f f b b b f 3 f f f f c b b b b b b b b b b f c c c c f f b b f b f f f f e e f 4 f e e f f f e f f e f f f e e e 2 e e e f f f f 6 9 6 f 8 6 f c 8 f 9 9 6 6 6 8 6 f 6 9 6 6 f f f f f f
f f f f e e e e e f f e e f e f f e e f f f f f e e e f f f f f 6 6 9 6 1 9 6 9 9 f 6 6 9 6 f c c c f f c c c c c c b 8 8 6 6 f 8 c c c f f b b f f f 4 4 4 4 f f c c c c c b b c c c c c f f f f f f c c f f e e e f e e e e f f e e f f f f f 4 2 2 2 2 2 e e e e e e f f f e f f f f f f 9 9 6 6 f f f f 6 6 6 f f f f f f f
f f f f f e f e e f f e e f 4 4 f e e f f f f e e e e f f 9 f f 8 6 9 6 1 9 8 6 9 8 6 6 6 6 f f c c f c c c c c c f b b 6 b 6 6 6 f c c c c c f f f f f 4 4 4 4 4 4 4 4 4 4 f f f f f f f f f f f f f f f f f e e f f e e e f f f e e f f f f e 2 2 2 2 e e e e e e e e e e e e e e e e e e f 9 6 f f f f f f 6 c f f f f e e e
f f f f f e f e e f f f e e 4 4 f f e f f f f e e f e f f 6 9 6 8 6 9 6 9 1 6 6 6 8 6 9 6 f f 9 9 c c c c c f c f f f b b f 8 6 f f f f c c c c c f b f f 4 4 4 4 4 4 4 4 4 4 4 4 4 4 f f f f f f f f f f f f e e f f e e e f f f e e f f f f e e 2 2 2 2 2 2 2 2 e e e e e e e e e e e e e e e e e e e e e e e e e e e e f f e
f f f f f e f e e e f f f e 4 4 f f e e f f e e f f e f f 6 9 6 6 6 6 6 9 9 8 6 6 6 6 6 6 8 9 9 9 c c c c c f f f f 3 f 3 3 3 3 3 3 3 f f c c f c c f b f f 4 4 4 4 4 4 4 4 4 4 4 e f f f f f f c c c f f 4 4 e e f f e e e f f f e e e f f f 4 4 4 e e 2 2 2 2 2 2 e e e e e e e e e e e e e e e e e e e e e e e e e e e e f f
f f f f f e f f e e f f f e 4 4 4 f f e f f e f f f f f f f 6 1 6 6 6 6 9 9 8 6 6 6 6 6 f 6 9 9 f c c c c b b f f f 3 b b 3 3 3 3 3 f f f c c c f f f b b f f f 4 4 4 4 4 4 4 4 5 f f f f f c f f c f f f 4 4 e e f f e e e f f e e e e f f f 4 4 4 e e e e e e f f 2 e 2 e e 2 2 2 e e e e e e e e e e e e e e e e e e e e e f
f f f f f e f f e e e f f e 4 4 4 f f f f f e f f f f f f f 6 6 f f 6 6 6 9 8 6 8 6 6 8 6 9 6 6 f f f c c f f f f c f b f f b c b b b b c c c c f f f f f f b b f f 4 4 4 4 4 4 4 4 4 4 4 4 f f f f f f e 4 e e f f e e e f f e e e e f f f f 4 4 4 e e e e e f f e e 2 e 2 2 2 2 e e f f f e e e e e e f f e e e e e f f f f f
f f f f f f f f f e e f f e e 4 4 f f f f f f f f f f f f f f f f f f f 6 6 8 f f 6 6 f 6 6 8 f e e e f f f f f f c f c f f f c a b b b f f f c f f f f f f f e e e 4 4 4 4 4 4 5 4 4 4 4 4 4 4 4 4 4 f 4 e e e e 4 e e e f f e e e f f f f f 4 4 4 e e e e f f f e e e e e e f f f f f f e e e e e f f f f e f f f f f f f f f
f e f f f f f f f f f f e e e 4 4 f f f f f f f f f e e e e e e e e e e e e e e e e e e e e e e e e e 2 2 2 e f c c c c c c c c c c b b b b f f 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 5 4 4 4 4 4 4 4 4 4 4 4 f e e f f 4 e e e f f e e e f f e f f f 4 4 4 e e e f f f e e e e e e e e f f f f f e e e e f f f f f e f f f f f f f f f
f e e f f f f f f f f f e e e 4 4 f f f f f f f f f f f f f e e e e e e e e e e e e e e e e e e e 2 2 e 2 2 e f c c c c c f f f f c c f f f f f f 4 4 4 4 4 4 4 4 4 4 4 5 5 5 4 4 4 4 4 4 4 4 4 f f f e e e f f e e e f f f e e e f f e f f f 4 4 4 e e e f f f e e e e e e e e e f f f f e e e e e f f f f e f f f f f f f f f
f e 4 e f f f f f f f f e e 4 4 4 f f e e e e e e f f f f f f e e e e e e e e e e e e e e 2 2 2 e e e e e e e f c c c c c c f f f f b f f f f f f f 4 4 4 4 4 4 4 4 5 4 4 4 4 4 4 4 4 4 f f f f e f e e f f f f f e e f f f e e e f e e f f f f 4 4 4 4 e f f f e e e e e f e e e e f f f f e e e f f f f f e f f f f f f f f f
f e e 4 e f f f f f f e e e 4 4 4 4 f e e e e e e e e e f f f f f f f f f e e e e e f f f e e e e e e e e e e f c c c c c c c f f f f f f 4 4 4 4 4 4 4 4 5 4 4 4 4 4 4 4 4 4 4 f f e e e e e e e e e f f f f f f e e f f 4 f e e f e f f f f f 4 4 4 4 e f f f f e e e e f e e e e f f f f e e e f f f f e e e f f f f f f f f
f e e e 4 f f f f f e e e e e 4 4 4 f e e e e e e e e e e e e f f f f f f f f e e e f f f f e e e f e e e e f c c c c f f f f f f 4 4 4 4 4 4 4 4 4 4 4 5 5 4 4 4 4 4 4 4 4 4 f e e e e e e e e e e e e e e e f f e f f f 4 f e f f e f f f f f f 4 4 4 e f e f f f e e e f e e e f f f f f e e e f f f f e e f f f f f f f f f
f f e e e f e e e f e e f f e 4 4 4 f e e e f 9 f e e e e e e e e e f f f f f e e e f f f f e e e f e e e e f c f f f f f f 4 4 4 4 4 4 4 4 4 4 4 5 4 5 4 4 4 4 4 4 4 4 4 4 4 f e e e e e e e e e e e e e e e f e e f f 4 4 f e f f f f f f f f f 4 4 4 e e e f f f f e e f e e e f f f f f e e f f f f f e f f f f f f f f f f
f f f e e e f f f f e e f f e 4 4 4 f f e f 6 9 9 f e e e e e e e e e 2 f f f e e e e f f f e e e f e e e e f f f 4 4 4 4 4 4 4 4 4 4 5 5 4 4 4 4 4 4 4 4 4 4 4 4 4 4 f 4 4 4 f e e e e f e e e e e f f e e e e e f f f 4 4 e f f f f f f f f f f e 4 4 e e e f f f f e e f f e e f f f f f e e f f f f f f f f f f e e e f f f
f f f f e e f f f e e f f f e e e 4 4 f f 8 6 1 9 f f e e e e e e e e e f f f e e e e f f f e e f f e e e e f 4 4 4 4 4 4 4 4 5 5 5 5 4 4 4 4 4 4 4 4 4 4 4 4 4 f f 4 4 f f f f e e e e f e e f f f 9 f e e e e f f f f 4 4 e f f f f f f e e f f 4 4 e e e e e f f f e e e f e e f f f f e e e f f f f f f f f f 4 4 4 e f f f
f f f f e f f f f e e f f f e e e 4 4 f f 6 6 1 6 f 6 f f e e e 2 2 2 e f f f f e e e f f f e e f f e e e e f 4 4 4 4 4 4 4 5 5 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 f e e e 4 e e e f e e f f f e f f f 6 1 6 f e e f f f f f 4 e e f f f f f f e e f f 4 4 e e e e e f f f e e e f e e f f f f e e f f f f f f f f f 4 4 4 e e f f f
f f f f e f f f e e e f f f e e e e 4 4 f 6 6 9 9 6 6 f f e e e e e e e f f f f e e e e f f f f f e e e e e f 4 4 4 4 4 4 4 5 5 4 4 4 4 4 4 4 4 4 4 4 4 f f f e e 4 e 4 4 e f f e e f e f f f f f 9 1 9 6 f f f f f f f 4 e e f f f f f e e f f f 4 4 e e e e e f f f f e f f e e f f f f e e f f f f f f f f 4 4 4 e e f f f f
f f f f f f f e e e f f f f f e e e 4 4 f f 6 6 f 6 6 e e e f e e e e e f f f f f e e e f f f f f e e e f e e f 4 4 4 4 4 4 4 4 4 4 5 4 4 4 4 4 4 4 4 f e f f e e e e e e e f f e f e e e f f f f 6 6 6 6 f 9 6 f f f f 4 e e f f f f f e e f f f 4 4 e e e f e f f f f f f f e e f f f f e e f f f f f f f e 4 4 e e f f f f f
f f f f f f f e f f f f f f f f e e 4 4 f e e e e e e e e e e f e e e e f f f f f f e e f f f f f e f f f e e f f 4 4 4 4 4 4 4 4 4 4 4 4 4 4 5 4 4 4 4 4 4 4 4 4 4 4 4 f f f e e e e e f f f 9 6 6 6 6 6 9 9 6 f f f 4 4 e f f f f f f f e f f f f 4 e e e f 4 f f f f f f f e e f f f f f f f f f f f f f e e e e f f f f f f
f f e f f f f f f f f f e e f f e e e e f e e e e e e e e e f f e e e e f f f f f f f e f f f f e e f f e e e e f e e e 4 4 4 4 4 4 4 4 4 4 4 5 5 4 5 5 4 4 4 4 4 4 4 4 4 4 4 f e e e f f f f 9 9 f 6 6 6 9 6 6 f f f 4 4 e f f e f f f f f f f f f e e e f f 4 e f f f f f f e e f f f 1 f f f f f f f f f f e e f f f f f e f
f e e f f f f f f f f e e e e 4 f e e e e e e e e e f f f e e e e e e e f f 6 f f f f f f f f f e f f e e e e e e f e e e e e f 4 4 4 4 4 4 4 4 4 4 5 5 5 5 5 5 4 4 4 4 4 4 4 4 f f f f f f f f 6 6 f 6 f 6 6 f f f 4 4 4 e f f e f f f f f f f e e e e e f 4 4 e f f f f f f f f f f 9 1 9 f f f f f f 4 e f f e f f f f e e f
e e e f f e e e e f f f f e e f e e e e e e e e 2 f f f e e e e e e e f f 6 9 f f f f e f f f f f f f e e e f e f f e e e e e e e f 4 4 4 4 4 4 4 4 4 4 4 4 5 5 5 5 4 4 4 4 4 4 4 4 4 4 4 4 f f 6 6 f f f f f e e f 4 e e f f f e f f e e f f e 4 4 e e e f 4 e e e f f f f f f f f f 9 9 9 6 f f f f 4 4 e f f f f f f e e f f
e e f f f e e e e e e e e e e e e e e e e e e 2 e e f f e e e e e e e f 6 9 1 f f f f e e f f f f f f f e f f f f e e e e e e e e e f f f 4 4 4 4 4 4 4 4 4 4 4 5 5 5 4 4 4 4 4 4 4 4 4 4 f e e e e e e e e e e e e e e e f f f f e e e e f f 4 4 e e e f f 4 e e e f f f f f f f f f 9 1 6 6 f f f 4 4 4 e f f f f f f e f f f
e e f f f e e e e e e e e e e e e e e f e e e e f e f f e e e e e e e f 6 9 9 f f f e e 4 e f f f f f f f f e e e e e e e e e e e e e e e f 4 4 4 4 4 4 4 4 4 5 5 4 4 4 4 4 f e e f 4 4 4 f e e e e e e e e e e e e f f f f f f e e e e f f f 4 e e e e f 4 4 e e e f f f f f f f f f 9 9 6 6 f f e 4 4 4 e f f f f f f f f f f
f f f f f f f f e e e f f e e e e f f f e e e e e e f f e e e e f e e f 6 9 6 f f f f e e e e f e e e e e e e e e e e e e e e e e e e e e e f 4 4 4 4 4 4 5 5 5 4 4 4 4 4 4 e e f e 4 4 4 f e e e f e e e e e e e e e e e e e e f f f f f f f 4 e e e e f 4 e e f e f f f f f f 9 9 f 9 9 6 6 f 8 f 4 4 e e f f f f f f f f f f
f f f f f f f f f e e f f f e e e f f f e e e e e e f f f e e e f e e f 6 9 f f f f f f e e f f e e e e e e e e e e e e e e e e e e e e e e f 4 4 4 4 5 5 5 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 f e e e f e e e e e e e e e e e e e e e e e f f f 4 4 e e f f f 4 e e f e f f f f f f 9 9 6 6 9 6 6 6 9 f e e e f f f f f f f f f f f
f f f f f f f f f e e f f e e e f f f f e e f f e e f f f e e e f f e f 6 6 6 9 f f f f f e e e e e e e e e e e e e e e e e e f e e e e e e f 4 4 4 4 4 4 5 4 4 4 4 4 4 4 4 4 4 4 4 f e e f e e f f e e e e e e e e e e e e e e e e f f 4 4 4 e e f f f e e e f f f e f f f f f f 9 6 f 9 6 f 9 6 f e e f f f f 4 4 4 4 f f f f
f f f f f f f f f f e f f e e e f f f f f f f f e e e f f e e e f f e f 6 f 6 f e e e e e e e e e e e e e e e e f f e e e e e f f e e e e f e 4 4 4 4 4 4 4 5 5 5 5 4 4 4 4 4 4 f f e e f e e e f f e e e e f e e e e e e e e f f f f 4 4 e e e f f f f e e f f f f f f f e e e f f 6 f 6 6 f 6 f f f f f f f 4 4 4 4 e f f f f
f f f f e e f f f f e f f f e e f f f f e e f f e e e f f e e f f f e e f e f e e e e e e e e e e e e e e e e e e e f f e e e f f f f e e 4 4 4 f e e 4 4 4 4 4 4 5 5 5 4 4 4 4 4 f f f f e e f f f e e e e f f e e e e e e e e e f 4 4 e e e f f f f e e f f f f f f e e e e e e e e e e f f f f e f f f f f 4 4 4 e e f f f f
f f f f e e f f f f e f f f e f f f f f e e f f f e e f f e e f f f f e f e e e e e e e e e e e e e e e e e e e e e f f e e e f 4 4 4 4 4 4 4 f e e 4 e f 4 4 4 4 4 4 5 5 5 4 4 4 4 4 f f f f f f e e e e e f f e e e e e e e e e e f f f f f f f e e e e f f f f f f e e e e e e e e e e e e e e e e f f f 4 4 4 e e e e f f f
f f f f e e e f f f f f f f f f f f f f e e f f f e e f f f f f f f f f e e e e e e e e f f f f e e e e e e e e e e e f e e f f 4 4 f f f 4 4 4 e e e e 4 4 4 4 4 4 4 4 4 5 5 5 4 4 4 4 4 4 f f f e e e e f f f e e e e e e e e e e e e e f f f e e e e f f f f f f f e e e f e e e e e e e e e e e f f f 4 4 4 4 4 e f e e f f
f f f f f e e f f f f f f f f f f 9 1 9 f f f f f e e f f f f f e e e e e e e e e e e e e f f f e e e e e e f e e e e f e e 4 4 4 4 e e e f 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 5 5 4 4 4 4 4 4 4 f f e e f f f f e e e f f e e e e e e e e e f f f f f f f e e e e f e e e f f e e e f f f f f f e f f f f 4 4 4 4 4 e f f e f f
f f f f f e e f f f f f f f f f 6 9 1 9 f f f f f e e f f e e e e e e e e e e e e e e e e f f f e e e e e e f e e e e f f f 4 4 4 4 f e f 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 5 5 5 4 4 4 4 4 4 4 f f f f f f f e e f f e f f e e f f e e e e e e e e f e e e e e f e e e f f e e f f f f f f f f f f f f 4 4 4 4 e e f f e f f
f f f f f e e e f f f f f f f 6 9 9 1 9 6 f f f f e e f f f f e e e e e e e e f f f f e e f f f e f e e e e e f e e e f e e e f 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 5 5 5 5 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 f f e f f f e f f f f f e e e e e e e e e e f f f f f e e e f f e e e f f f f f f f f f f f e 4 4 4 4 e f f f e f f
f f f f f e e e f f f f f f 9 9 9 9 1 9 9 f f f f e f f f f f f e e e e e e e e f f e e e f f f f f f e e e e f f f f 4 4 4 4 f 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 5 5 5 5 4 4 4 4 4 4 4 4 f f f 4 4 4 4 4 f f e f f f f e f f e e e e e e e e e e e e e e e e f f e e f f f e e f f f f f e e e e f f f 4 4 4 4 e e f f f f f f
f f f f f f e e f f f f f f 9 9 9 9 1 9 9 9 f f f f f f e e e f f f f f e e e e f f e e e e f f f f f f f f f 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 5 5 5 5 5 5 5 4 4 4 4 4 4 4 4 4 f 4 4 4 4 f 4 4 4 4 4 f f f f f f f e e e e e e e e e e e e f f e e e e f f f f e e e f f f f e e e e e f f f 4 4 4 e e e e f f f f f f
f f f f f f e e e f f f f 9 9 9 9 9 1 9 9 9 9 f f f f e e e e e f f f e e e e e f f e e e e f f f 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 5 5 5 5 5 5 5 4 4 4 4 4 4 4 4 4 4 4 f 4 4 4 e e e f 4 f 4 4 4 4 f f f e e e e e e e e e e e e e f 4 4 f e e e e e f f e e f f f f e e e e f f f f f 4 4 e e e e e f f f f f f
f f f f f f e e e e f f 9 9 9 9 9 9 1 9 9 9 9 9 f f f e e e e e e f f e e e e e e f f f e 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 5 5 5 5 5 5 5 5 4 4 4 4 4 4 4 4 4 4 4 4 4 4 e e e e e f f f 4 f 4 4 4 4 4 f e e e e e e e e e e e e e e f 4 e f e e e e e e e f f f f f f f f e f f f f f f 4 4 e e e e e f f f f f f
f f f f f e e e e e f 9 9 9 9 9 9 1 9 9 9 9 9 9 6 f f e f f e e f f f f f e e e e f e 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 5 5 5 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 e e e e e e f 4 4 4 4 4 4 4 f e e e e e e e e e e e e e f 4 4 e f f e e e e e e e e e e e e f f f f f f f f 4 4 4 4 e e e e f f f f f f
f f f f f e e e e f 6 9 9 9 9 9 9 1 9 9 9 9 9 9 9 f f f f f f f f f e e f f e e f f 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 5 5 5 5 5 5 5 5 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 f f f e e e f f f e e e e e e e f 4 4 e f f e e e e e e e e e e e e e e e e e e e f 4 4 4 4 4 e e e f f f f f f
f f f f f f e e f f 6 6 6 1 9 9 9 1 9 9 9 9 9 1 1 f f f f e e e f f f e e f f f 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 5 5 5 5 5 5 5 5 5 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 f f e e f e e f f e e e e e e e e e f 4 4 e e f e e e e e e e e e e e e e e e e e e e f 4 4 4 4 4 e f f e e f f f f
f f f f f f f e f f 6 6 6 6 1 9 9 1 9 9 9 1 1 9 9 f f f f e e e e f f f f f e 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 5 5 5 5 5 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 e f f f f f f e e e e f e f f e e e f f f e e e f 4 e e e f e e e e e e e e e e e e e e e e e e e f 4 4 4 4 e e f f e e f f f f
f f f f f f f e f f 6 6 6 6 6 6 1 1 9 9 1 9 9 9 9 f f f f f f e e f f f 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 5 5 5 5 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 f f f e e e e e f e e e e e f e f f e e f f f f f f f f 4 e e e f e e e e e e e e e e e e e f f e e e e e e 4 4 e e f f f e e f f f f
f f f f f f f f f f 6 6 6 6 6 6 6 1 9 9 9 9 9 9 9 f f f f f f f f f 4 4 4 4 4 4 4 f 4 f 4 4 4 4 4 4 4 4 4 4 4 5 5 5 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 f f f f e e e e e e e f f e e e f f f f f f e e f f f f f f f f 4 e e e f f e e e e e f e e e e e f 1 9 8 e e e e e e e e e f f f e e e f f f
f f f f f f f f f f 6 6 6 6 6 6 6 1 9 9 9 9 9 9 9 f f f f f f 4 4 4 4 4 4 f e e e 4 4 4 4 4 4 4 4 4 4 4 4 4 4 5 5 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 f f e e e e e e e e e e e e e f f f f e e e f e e f f f f f f f 4 4 e f f f f f f e f f e e e e e e 8 1 9 9 f e f e e e e e e f f f e e e f f f
f f f f f f f f f f 6 6 6 6 6 6 6 1 9 9 9 9 9 9 9 f f 4 4 4 4 4 4 4 4 4 4 f e e e e e e e e f f 4 4 4 4 4 4 4 5 5 5 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 f f f e e e e e e e e e e e e e e e e e e e e e e e e f f f f f f f f f 4 4 e f f e f f f e e f f e e e e f 9 1 9 6 6 f f e e e e e f f f f e e e f f f
f f f 9 9 6 f f f f 6 6 6 6 6 6 6 1 9 9 9 9 9 9 6 f 4 4 4 4 4 4 4 4 4 4 4 4 e e e f e e e e 4 4 4 4 4 4 4 4 4 4 5 5 5 5 5 5 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 f e e e e e e e e e e e e e e e e e e e e e e e e e e e e e e f f f f f f 4 4 4 f f e f f f f e f f f e e f 9 9 1 9 9 9 6 f e e e e e f f e e e e e f f f
f f f 9 9 9 f f f f 6 6 6 6 6 6 6 1 9 9 9 9 9 9 6 f f f 4 4 4 4 4 4 4 4 4 4 4 4 e e e e f 4 4 f f 4 4 4 4 4 4 4 4 4 4 5 5 5 5 5 5 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 f e e e e e e e e e e e e e e e e e e e e e e e e e e e e e e e e e f f f f 4 4 4 f f e f f f f f f f f f f 6 9 9 1 9 9 9 9 f e e e e f f f f e e f e f f f
f f f 9 1 9 9 f f f 6 6 6 6 6 6 6 1 9 9 9 9 9 9 6 e e f 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 f 4 4 f 4 4 4 4 4 4 4 4 4 4 4 5 5 5 5 5 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 f f f e e e e e e e e e e e e e e e e e e e e e e e e e e e e e e e e e f f f 4 4 e f f e f f f f f f f f f f 6 1 9 1 9 9 9 9 8 e e e e f f f f e e f f f f f
f f f 9 9 9 9 9 f f 6 6 6 6 6 6 6 1 9 9 9 9 9 9 6 e e e f f 4 4 6 6 9 f 4 4 4 4 f f 4 4 4 4 4 e e f 4 4 4 4 4 4 4 4 4 4 4 4 4 4 5 5 5 4 4 4 4 4 4 4 4 4 4 4 4 4 4 f f e e e e e e e e e e e e e e e e e e e e e e e e e e e e e e e e e e f f f 4 4 e f f e e f f f f f f f f f 6 9 1 1 9 1 9 6 8 e e e f f f f e e e f f f f f
f f f 9 9 9 9 9 9 f 6 6 6 6 6 6 9 9 9 9 9 9 9 9 6 e e e e f f 9 9 9 9 f 4 4 4 e e e e 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 5 5 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 f f e e e e f e e e e e f e e e e e e e e e e e e e e e e e e e f f e e e e f 4 4 f f f e e f f f f f f f f f 6 9 9 1 9 6 6 6 8 e e f f f f f e e e f f f f f
f f 9 9 9 9 9 1 6 6 6 6 6 6 6 6 9 9 9 9 9 9 9 9 f e e e f 9 9 9 9 9 9 f 4 4 4 e e e e 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 5 5 5 5 4 4 4 4 4 4 4 4 4 4 4 4 f f 4 4 f f e e e e f e e e f f f e e e e e e e e e e e e e e e e e e f 4 4 f e e f e 4 e f f f e e f f f f f 1 9 f f 6 9 9 9 6 6 6 6 8 f f f f 8 8 f e e f f f f f f
f f 9 9 9 9 1 6 6 6 f 6 6 6 6 6 9 9 9 9 9 9 9 9 f e f f 9 9 9 9 9 9 9 f f f 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 5 5 5 5 5 5 4 4 4 4 4 4 4 4 4 4 4 4 4 f e e f 4 f f e e e e e e e e f f f e f f f f e e e e e e e e e e e e f 4 4 4 f e e f 4 4 e f f f f e f f f f f 9 9 9 6 6 9 9 9 9 6 6 6 f f f f 9 9 9 f e e f f f f f f
f f 6 9 1 1 6 6 6 6 f 6 6 6 6 6 9 9 9 9 9 9 9 9 f f f 9 9 9 9 9 1 9 9 f e e f 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 5 4 5 5 5 5 5 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 e e 4 4 4 4 f f e f e e e e f f f e f f e e e e e e e e f e e e e e f 4 4 e f e e f 4 4 e f e e f e f f f f f 9 1 9 9 6 9 9 9 9 6 6 6 f f f 9 9 1 9 f e f f f f f f f
f f f 6 6 6 9 6 6 6 f 6 6 6 6 6 9 9 9 9 9 9 9 9 f f 6 9 9 9 9 9 9 9 9 f e e e f f 4 4 4 4 4 4 4 4 4 4 4 4 4 5 5 5 5 5 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 f f f e e e f f f e e f f e e e e e e f f e e e e e e f 4 4 e f e e f 4 4 e e e e f e e f f f f 9 9 9 9 f 9 9 9 9 6 6 6 f f 8 9 9 9 9 f f f f f f f f f
f f f 6 6 6 9 6 6 6 6 6 6 6 6 6 9 9 9 9 9 9 9 f f f 6 6 1 9 9 9 9 9 9 f e e e e f 4 4 4 4 4 4 4 4 4 4 4 4 5 5 5 5 5 5 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 f e e e f f f e e f f e e e e e f f f e e e e e e f 4 4 e f f f 4 4 4 e e e e f f e f f f f 1 1 9 6 f 9 9 9 9 6 6 6 f f 6 1 1 9 9 f f f f f f e f f
f f f 6 6 6 9 6 6 6 6 8 6 6 6 6 9 9 9 9 9 9 9 f f 6 6 6 6 1 1 9 9 9 9 f e e e e f 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 5 5 5 5 5 5 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 f e e f f f f f f f f f f e e e e e f f f e e f f f f f 4 4 e f f f 4 4 e e e e e f f e e f f f 6 6 9 6 6 9 9 9 6 6 6 6 f f 6 6 9 6 9 f f f f e e e f f
f f f f 6 6 6 9 6 6 6 8 6 6 6 6 6 9 9 9 9 9 9 f f 6 6 6 6 1 1 1 1 9 9 f f e e e f 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 5 5 5 5 5 5 5 5 5 5 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 e e e e f 4 4 4 f f f f f e e e f f f f f e f f f f f f 4 e e f f f 4 4 e e e e f f f e f f f f f 6 9 6 6 f 9 9 6 6 6 1 9 f 6 9 6 6 6 f f f e e e e f f
f f f f 6 6 6 9 6 6 6 8 9 9 6 6 6 9 9 9 9 9 9 f f 6 6 6 6 9 6 6 6 9 9 f f f f f f f 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 5 5 5 5 5 5 5 5 5 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 f e e e f f f f e e f f f f f f 4 e e e f f 4 4 e e e e f f f e e f f f f 8 6 9 6 f 6 9 6 f 1 9 9 9 6 9 6 6 f f f f e e e f f f
f f f f 6 6 6 6 6 6 f 9 9 1 9 6 6 9 6 6 9 9 f f 6 6 6 6 6 9 6 6 6 6 6 f f f e e e e f f 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 5 5 5 5 5 5 5 5 5 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 f f f f f f f e e e f f f f 4 4 e e e f f e e e e e e f f f e e f f f f 8 6 9 6 f 6 6 6 9 9 9 9 9 6 6 6 6 f f f f e e f f f f
f f f f f 6 6 6 9 6 6 9 9 1 9 6 6 9 6 6 9 9 f f 6 6 6 6 1 6 6 6 6 6 f e e e e e e e e e f 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 5 5 5 5 5 5 5 5 5 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 f f e e f f f f f 4 4 e e e e f e e e e f e f f f f e e f 9 6 f 6 6 6 6 6 6 f 9 9 9 9 6 6 6 6 f f 9 f f e e f f f f
f f f f f 6 6 6 6 f 9 9 9 1 9 6 6 9 6 6 9 9 f f 6 6 6 9 9 6 6 6 6 f e e e e e 2 e e e e f 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 5 5 5 5 5 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 f f 4 4 f f e f f f f f 4 4 e e e e f e e e f f f f f f f e e f 9 9 6 8 6 6 6 6 6 f 9 9 9 6 6 6 6 6 6 9 6 f f e f f f f f
f f f f f 6 6 6 6 9 9 9 9 1 9 1 8 6 6 6 9 9 f 6 6 6 6 9 6 6 6 6 6 f e e e e e e e e e e f 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 5 5 5 5 5 5 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 f e e f 4 4 4 f f f f f f 4 4 e e e e f e e e f f f f f f f e e f 9 1 6 6 6 9 6 6 f 9 9 9 9 6 6 6 6 6 6 6 f f f f f f f f f
f f f f f 6 6 6 6 6 9 9 1 1 9 9 8 6 6 6 9 9 f 6 6 6 6 1 6 6 6 6 6 f f e e e e e f e e e f f f f f 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 5 5 5 5 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 f e e e e f 4 4 4 4 f f f f 4 4 4 e f e f e e e f f f f f f f e e f f 6 9 6 8 6 6 8 8 9 9 9 6 6 6 8 6 f 6 6 f f f f f f f f f
f e f f f 6 6 6 6 6 6 1 1 1 9 9 8 6 6 6 9 6 f 6 6 6 9 6 6 6 6 6 f f f f f e e e f e e e f e e e e f 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 5 5 5 5 5 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 f 4 4 e e f e f e e e f f f f f f f f e f f 6 6 6 8 6 6 c 8 9 9 9 6 6 6 f f f f f f e f f f f f f f
f f f f f f 6 6 6 6 6 6 1 9 9 9 8 6 6 6 9 f 6 6 6 6 9 6 6 6 6 f f f f f f e e f f e e e f f e e e e f 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 5 5 5 5 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 f 4 e e e f e f f e e e f f f f f f f f f f f 6 6 f f f f f 9 9 6 6 6 6 f f e e e e e e e f f f f f
f f f 6 f f 6 6 6 6 6 6 1 9 9 9 8 6 6 6 6 6 6 6 6 9 6 6 6 6 f f f 6 6 6 f f f f f e e f e e e e e e e e e f 4 f f 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 5 5 5 5 4 5 5 5 5 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 f 4 e e e f e e f f e e f f f f f f e e e e e e e e e e e e f 6 6 6 f f f e e e e e e f f f f f f f
f f f 6 9 6 f 6 6 6 6 6 9 9 9 9 f 6 6 6 f f 6 6 6 9 6 6 6 f f f 9 9 9 9 f f f f f f e e e e e e e e e e e e e e e e f 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 5 4 5 5 5 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 f 4 4 e e e f e e f f f e f f f f 2 2 e e e e e e e e e e e e e e f f f f e e f e e e f f f f f f f f
f f f 6 6 9 6 f 6 6 6 6 6 9 9 9 f 6 6 6 6 6 f 6 9 6 6 6 f f f 6 9 9 9 9 f f f f e e e e e e e e e e e e e e e e e e e e e e 4 f 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 5 5 5 5 5 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 f 4 4 e e e f f e f f f e e f f f 2 2 e e e e e e e e e e e e e e e e e e e e e f f f f f f f f f f f
f f f 6 6 9 9 c f 6 6 6 6 9 9 6 6 6 6 6 9 1 f 6 9 6 6 6 f 8 6 6 1 9 9 9 f f f e e e e e e e e e e e e e 2 2 2 e e e e e 2 e e e f 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 5 5 5 5 5 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 f f f 4 4 e e e f f e e f f f e f f e e e 2 2 e e e e e e e e e e e e e e e e e e e e e f f f f e f f f f
f f f 6 9 9 6 6 f 6 6 6 6 9 9 6 6 6 6 9 9 9 9 f 9 6 6 f f 6 6 6 1 1 1 f f e e e e e e e e e e e e e 2 2 2 e e e e e e 2 2 e e e e 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 4 5 5 5 5 4 4 4 4 4 4 4 4 4 4 4 4 4 4 f f f e e f 4 4 e e f f f f e e f f f e f f e e e e e e e e e e e e e e e e e e e e e e e e e f f f f f e f f f f
`,
  },
];
