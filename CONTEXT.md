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
