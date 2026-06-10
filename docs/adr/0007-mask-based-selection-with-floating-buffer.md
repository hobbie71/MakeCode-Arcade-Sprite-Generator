---
status: accepted
---

# Selection is a mask + floating buffer (Aseprite model), not MakeCode's rect floating layer

The studio's Select tool is being rebuilt from a non-functional stub into the editor's move/transform system. The obvious path was to copy MakeCode Arcade's implementation (we mirror its editor elsewhere), where a selection *is* a floating bitmap: the marquee mouse-up eagerly cuts pixels into a float, every gesture is its own undo step, and Esc commits in place. We deliberately deviate: selection follows the Aseprite model — a 1-bit whole-canvas mask that every selection tool produces, with a lazily-lifted floating buffer on top. These semantics were settled in a one-question-at-a-time design interview (2026-06-10); the terms (Selection, Lift, Floating selection, Commit, Cancel) are defined in `CONTEXT.md`.

## Decisions

1. **One mask representation for all tools.** Rectangle, magic wand, and lasso all produce a `Uint8Array` mask (whole-canvas, 0|1); combine modes (replace / Shift-add / Alt-subtract) and Invert are array ops. This is what makes multiple selection shapes uniform and keeps v2 features (grow/shrink, edit-mask clipping) cheap.
2. **Lazy lift.** Selecting never mutates the sprite; pixels are cut into the floating buffer only on the first move/nudge/resize/flip. Select-then-deselect is a true no-op (MakeCode's eager cut is an artifact of its rect-only design).
3. **One undo entry per chain.** Lift → any number of drags/nudges/transforms → commit lands as a single history snapshot (snapshot only at commit). Undo pressed *while* floating cancels the float instead of consuming history. Rejected MakeCode's per-gesture (and per-nudge) undo steps.
4. **Esc cancels; commit is explicit.** Esc restores lifted pixels to their origin (Aseprite); commit happens on Enter, click-outside, switching to a non-Select tool, or starting a new selection. MakeCode's commit-on-Esc was judged the surprising behavior.
5. **Selection is move-only in v1.** An active selection does not clip drawing tools (no edit-mask); drawing with another tool commits the float first — MakeCode behavior. Edit-mask clipping is an explicit v2 candidate the mask design already supports.
6. **Modals cancel the float.** Opening Generate / Resize & Process / Export mid-float cancels it (pixels snap home) so modals and exports always see a whole, unmoved sprite — never a grid with a lift-hole. (Commit-first was considered; user preference: an uncommitted move shouldn't count.)
7. **Resize re-samples from a basis.** The floating buffer keeps the originally-lifted bitmap; every handle resize nearest-neighbor-samples from that basis (MakeCode's `originalImage` trick), so repeated resizes never compound quality loss. 8 handles, Shift = aspect lock, dragging through the opposite edge flips via signed extents.
8. **Clipboard speaks MakeCode `img` literals.** Copy/cut serialize the selection as an `img\`…\`` text literal, so copy/paste interoperates with arcade.makecode.com in both directions. Paste floats in-place when it came from our own copy and fits, else centered (rejected MakeCode's always-at-origin).
9. **Selection chrome: B/W ants + accent handles.** The outline is classic black/white marching ants (visible over every palette color — an accent-colored outline vanishes on the palette's blues); only the handles take the design-system accent. S cycles Rectangle → Wand → Lasso while Select is active; the wand defaults to contiguous (Fill's global default is fill-specific).

## Consequences

- Selection/floating state lives outside the snapshot history; only commits touch it. Two guards keep them consistent: undo-while-floating cancels first, and any external `spriteData`/size write hard-resets the selection.
- The lift-hole means a floating sprite is temporarily incomplete on the real grid; every path that reads the sprite for output (modals, export) must go through the cancel-on-open hook (decision 6).
- Client-only; no wire-contract or server changes.
