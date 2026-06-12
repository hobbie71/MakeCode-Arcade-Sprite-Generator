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

**Showcase**:
The home-page section that displays the most recent community Submissions in a grid. Live and self-updating; anyone visiting the site sees it. Distinct from Examples, which is maintainer-curated.
_Avoid_: Gallery, feed, wall (those are casual labels, not the domain term)

**Examples**:
A curated set of sprites the maintainer hand-picks to demonstrate what the app can do. Baked into the build, changing only when the maintainer updates it — not community-submitted and never changing on its own. Shown on the home page in the same grid style as the Showcase, but it is a different section with a different purpose (marketing the tool, not celebrating makers).
_Avoid_: Showcase (that's the live community one), samples, fallback

**Submission**:
One sprite a maker has sent to the Showcase. Carries a maker name and a title shown publicly, plus the prompt that made it — when the sprite was AI-generated — kept private for moderation (hand-drawn and uploaded sprites have no prompt). Distinct from the sprite being edited and from an Export/Copy (which only puts an img-literal on the clipboard).
_Avoid_: Post, gallery item, entry

**Submit**:
The act of sending the current sprite to the Showcase — a separate flow from Export, offered right after a Copy. A Submission goes live on its own once it clears moderation; there is no human approval step.
_Avoid_: Publish, Share, Feature

**Maker**:
The person who made and submitted a sprite to the Showcase. Identified publicly by a single first name or nickname only — never a full name — typed in at Submit time and shown on their Submission. No accounts exist; a maker is just a name on a Submission, not a tracked identity.
_Avoid_: User, author, student (student is the real-world role, not the on-site identity)
