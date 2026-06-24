import { useState } from "react";

import Button from "../Button";
import SegmentedControl, { type SegmentOption } from "../SegmentedControl";
import OpenAISettingsSection from "../../features/InputSection/GenerationMethodSection/TextToSpriteSection/components/OpenAISettingsSection";
import ImageUploadForm from "../../features/InputSection/GenerationMethodSection/ImageToSpriteSection/components/ImageUploadForm";
import AssetTypeSelect from "./AssetTypeSelect";
import { useAssetType } from "../../context/AssetTypeContext/useAssetType";
import { useGenerationMethod } from "../../context/GenerationMethodContext/useGenerationMethod";
import { useLoading } from "../../context/LoadingContext/useLoading";
import { useToken } from "../../context/TokenContext/useToken";
import { useCanvasSize } from "../../context/CanvasSizeContext/useCanvasSize";
import { useSprite } from "../../context/SpriteContext/useSprite";
import { useOpenAISettings } from "../../context/OpenAISettingsContext/useOpenAISettings";
import { useImageFileHandler } from "../../features/InputSection/hooks/useImageFileHandler";
import { GenerationMethod, GENERATION_TOKEN_COST } from "../../types/export";
import { MakeCodeColor } from "../../types/color";

/** Small filled lightning bolt for the speed estimate (matches the solid ★). */
function BoltIcon() {
  return (
    <svg
      className="h-3 w-3 text-accent"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z" />
    </svg>
  );
}

type Surface = "hero" | "studio";

const HERO_TABS: SegmentOption<GenerationMethod>[] = [
  { value: GenerationMethod.TextToSprite, label: "AI Generate" },
  { value: GenerationMethod.ImageToSprite, label: "Upload Image" },
  { value: GenerationMethod.BlankCanvas, label: "Draw Blank" },
];

const STUDIO_TABS: SegmentOption<GenerationMethod>[] = [
  { value: GenerationMethod.TextToSprite, label: "AI Generate" },
  { value: GenerationMethod.ImageToSprite, label: "Upload Image" },
];

interface Props {
  /** Fired once a source image has been STAGED synchronously (a file was
   *  uploaded) — never commits to the canvas here. studio → open Resize &
   *  Process; hero → navigate to the studio and open Resize & Process there.
   *  AI generation does NOT fire this (it is async — see onGenerateStart). */
  onStaged?: () => void;
  /** Fired the instant an AI generation BEGINS (before the loading overlay is
   *  shown). The hero uses it to route into the studio first, so the overlay —
   *  and the eventual Resize & Process hand-off — happen there, not on the hero.
   *  Omitted on the studio, which already hosts the overlay. */
  onGenerateStart?: () => void;
  /** Fired after a blank canvas is created (hero "Draw Blank" tab only) — hero
   *  navigates to the studio. Omitted on surfaces without the blank tab. */
  onBlank?: () => void;
  /** Which host renders this widget. Both surfaces share the SAME generate/upload
   *  experience (AI: prompt + asset type, no size; Upload: dropzone +
   *  button; both STAGE a source then hand off to Resize & Process). The only
   *  difference is "hero" adds the extra Draw Blank tab. */
  surface?: Surface;
}

/**
 * Shared generation UI used by BOTH the hero entry widget and the studio Generate
 * modal — identical experience on both, except the hero adds a Draw Blank tab.
 * Composes the existing primitives (OpenAISettingsSection, ImageUploadForm,
 * AssetTypeSelect) behind tabs, plus a token indicator and a context-aware
 * primary button. Generate and Upload always STAGE a source image (the canvas is
 * untouched) and fire onStaged; the host decides where Resize & Process opens.
 */
export default function GenerationControls({
  onStaged,
  onGenerateStart,
  onBlank,
  surface = "hero",
}: Props) {
  const isHero = surface === "hero";
  const { selectedMethod, setSelectedMethod } = useGenerationMethod();
  const { selectedAsset, setSelectedAsset } = useAssetType();
  const { isGenerating } = useLoading();
  // Bumped on a failed Generate to flash + shake the offending field(s): the asset
  // dropdown (no type chosen) and/or the prompt textarea (empty). Both can fire at
  // once. 0 = no failed attempt yet.
  const [assetErrorNonce, setAssetErrorNonce] = useState(0);
  const [promptErrorNonce, setPromptErrorNonce] = useState(0);
  const { canGenerate, watchAdToEarnToken } = useToken();
  const { settings } = useOpenAISettings();
  const { width, height } = useCanvasSize();
  const { setSpriteData } = useSprite();
  const {
    generateAIImageAndConvertToSprite,
    importedImage,
    setSourceImage,
    stageSource,
  } = useImageFileHandler();

  // Display-only token cost per generation (no real economy — ADR-0006). Quality
  // is forced to "low" server-side, so every generation costs the same.
  const tokenCost = GENERATION_TOKEN_COST;

  // Only the hero has a Draw Blank tab. If the shared GenerationMethod context is
  // still on Blank (e.g. it was chosen on the hero before navigating in), fall
  // back to AI on the studio so a tab is always highlighted and the body matches.
  const activeMethod =
    !isHero && selectedMethod === GenerationMethod.BlankCanvas
      ? GenerationMethod.TextToSprite
      : selectedMethod;

  const startBlankCanvas = () => {
    const blank: MakeCodeColor[][] = Array.from({ length: height }, () =>
      Array.from({ length: width }, () => MakeCodeColor.TRANSPARENT),
    );
    setSpriteData(blank);
    setSourceImage(null); // a blank canvas has no re-processable source
    setSelectedAsset(null); // no type chosen for a hand-drawn canvas
    onBlank?.();
  };

  // Upload (both surfaces): stage the picked file (cache, do NOT paste) and hand
  // off to Resize & Process. No async generation runs, so call onStaged directly.
  // Clear the asset type — it's an AI-only choice, so an upload must not inherit a
  // stale type and have the Resize modal apply the wrong preset.
  const handleUpload = (file: File) => {
    setSelectedAsset(null);
    stageSource(file);
    onStaged?.();
  };

  // Generate (AI): both prompt and asset type are required. The prompt is
  // committed on blur, which the click's mousedown triggers, so settings.prompt
  // is current here. Flash + shake whichever is missing (both can fire at once)
  // and stop — don't spend a generation.
  const handleGenerate = () => {
    const promptEmpty = !settings.prompt.trim();
    const noAsset = selectedAsset == null;
    if (promptEmpty) setPromptErrorNonce((n) => n + 1);
    if (noAsset) setAssetErrorNonce((n) => n + 1);
    if (promptEmpty || noAsset) return;
    // Notify the host BEFORE kicking off so the hero routes into the studio in
    // the same commit the overlay turns on (loading + Resize hand-off land there).
    onGenerateStart?.();
    generateAIImageAndConvertToSprite({ commit: false }).catch(() => {});
  };

  const renderPrimary = () => {
    if (activeMethod === GenerationMethod.TextToSprite) {
      return canGenerate ? (
        <Button
          variant="primary"
          className="w-full"
          isLoading={isGenerating}
          onClick={handleGenerate}
        >
          ✦ Generate sprite
        </Button>
      ) : (
        // Display-only placeholder for the future rewarded-ad flow (ADR-0006).
        <Button
          variant="outline"
          className="w-full"
          onClick={watchAdToEarnToken}
        >
          Watch ad to earn a token
        </Button>
      );
    }
    if (activeMethod === GenerationMethod.ImageToSprite) {
      return (
        <Button
          variant="primary"
          className="w-full"
          isLoading={isGenerating}
          disabled={!importedImage}
          onClick={() => {
            // Source is normally staged on drop (auto-advance); this button is the
            // explicit affordance when a source is already cached.
            if (importedImage) handleUpload(importedImage);
          }}
        >
          Process image
        </Button>
      );
    }
    return (
      <Button variant="primary" className="w-full" onClick={startBlankCanvas}>
        Start with blank canvas
      </Button>
    );
  };

  return (
    <div className="space-y-4">
      {/* Tabs — hero adds Draw Blank; studio is AI + Upload only. */}
      <SegmentedControl
        options={isHero ? HERO_TABS : STUDIO_TABS}
        value={activeMethod}
        onChange={(method) => {
          setSelectedMethod(method);
          // Clear any pending validation flashes on tab switch.
          setAssetErrorNonce(0);
          setPromptErrorNonce(0);
        }}
        ariaLabel="Generation method"
        stretch
        disabled={isGenerating}
      />

      {/* Method-specific input */}
      {activeMethod === GenerationMethod.TextToSprite && (
        <OpenAISettingsSection errorNonce={promptErrorNonce} />
      )}
      {activeMethod === GenerationMethod.ImageToSprite && (
        <ImageUploadForm onFile={handleUpload} />
      )}
      {activeMethod === GenerationMethod.BlankCanvas && (
        <p className="text-sm text-ink-muted">
          Start from an empty canvas and draw your sprite pixel by pixel.
        </p>
      )}

      {/* Asset type — required, AI Generate only. Sits below the prompt; drives
          type-aware generation and the per-type preset applied in Resize & Process. */}
      {activeMethod === GenerationMethod.TextToSprite && (
        <AssetTypeSelect errorNonce={assetErrorNonce} />
      )}

      {renderPrimary()}

      {/* Cost + speed indicator (AI only) — sits below the button, mirrors the mockup */}
      {activeMethod === GenerationMethod.TextToSprite && (
        <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-ink-subtle">
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
            <span className="text-accent">★</span>
            {`${tokenCost} token${tokenCost === 1 ? "" : "s"} per generation`}
          </span>
          <span aria-hidden="true" className="font-bold">
            ·
          </span>
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
            <BoltIcon />
            ~60s AI sprite generation
          </span>
        </p>
      )}
    </div>
  );
}
