# MakeSpriteCode

An AI-enhanced sprite generator/editor for MakeCode Arcade: users turn images or text prompts into pixel-art sprites and export them in MakeCode-compatible formats.

## Language

**Source image**:
The cached original image a Generate (AI call, upload, or paste) produces, kept unmodified so Process can re-run on it for free. Displayed and traced in the editor's Source dock tab.
_Avoid_: Reference image, imported image, original

**Generate**:
The act that produces a source image — a paid AI call, a free upload, or starting a blank canvas (which produces none).
_Avoid_: Create, import

**Process**:
The local, free, re-runnable pipeline (remove background → quantize to palette → crop/fit → scale) that turns the source image into sprite pixels.
_Avoid_: Convert, resize (Resize means re-process at a new size)

**Selection**:
A set of canvas pixels marked for move/transform/delete/copy — it does not constrain drawing with other tools. Selecting alone never changes the sprite; pixels only leave the canvas when the selection is lifted.
_Avoid_: Marquee (that's one way to create a selection, not the selection itself)

**Lift**:
The moment selected pixels are cut out of the canvas into a floating selection — happens lazily on the first move, nudge, resize, or flip, never at selection time.
_Avoid_: Cut (Cut is the clipboard action)

**Floating selection**:
Lifted pixels hovering over the canvas at an offset, not yet part of the sprite. Ends by being committed (merged into the sprite) or cancelled (restored to where they were lifted from).
_Avoid_: Floating layer (no layer system exists)

**Commit**:
Merging a floating selection into the sprite where it currently sits. Triggered by Enter, clicking outside the selection, switching to a non-Select tool, or starting a new selection.
_Avoid_: Anchor, drop, merge

**Cancel**:
Aborting a floating selection — pixels return to exactly where they were lifted from, as if nothing happened. Triggered by Esc, or by opening a Generate / Resize & Process / Export flow mid-float (modals always see the unmoved sprite).
_Avoid_: Revert, deselect (deselect is clearing a non-floating selection)
