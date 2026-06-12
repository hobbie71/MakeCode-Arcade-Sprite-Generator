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
//   2. Export → Copy the MakeCode `img\`...\`` string.
//   3. Paste it into the `literal` field below (keep the surrounding backticks
//      via a template string, or paste the inner rows — both parse fine).
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
  { label: "spinning gold coin", size: "16×16", literal: "" },
  { label: "health pickup heart", size: "16×16", literal: "" },
  { label: "green dungeon slime", size: "16×16", literal: "" },

  // --- 32×32 — characters & loot with a clear silhouette -------------------
  { label: "wooden treasure chest", size: "32×32", literal: "" },
  { label: "armored knight", size: "32×32", literal: "" },
  { label: "robed wizard", size: "32×32", literal: "" },

  // --- 64×64 — detailed single subjects ------------------------------------
  { label: "cozy cottage", size: "64×64", literal: "" },
  { label: "coiled green dragon", size: "64×64", literal: "" },
  { label: "pirate ship", size: "64×64", literal: "" },

  // --- 160×120 — full-screen Arcade backgrounds ----------------------------
  { label: "ocean sunset", size: "160×120", literal: "" },
  { label: "spooky moonlit forest", size: "160×120", literal: "" },
  { label: "glowing crystal cave", size: "160×120", literal: "" },
];
