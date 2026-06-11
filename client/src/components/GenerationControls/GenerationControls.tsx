import { useEffect, useRef } from "react";
import Button from "../Button";
import SegmentedControl, { type SegmentOption } from "../SegmentedControl";
import OpenAISettingsSection from "../../features/InputSection/GenerationMethodSection/TextToSpriteSection/components/OpenAISettingsSection";
import ImageUploadForm from "../../features/InputSection/GenerationMethodSection/ImageToSpriteSection/components/ImageUploadForm";
import AssetOptionsSelection from "../../features/InputSection/components/AssetOptionsSelection";
import { useGenerationMethod } from "../../context/GenerationMethodContext/useGenerationMethod";
import { useLoading } from "../../context/LoadingContext/useLoading";
import { useError } from "../../context/ErrorContext/useError";
import { useToken } from "../../context/TokenContext/useToken";
import { useCanvasSize } from "../../context/CanvasSizeContext/useCanvasSize";
import { useSprite } from "../../context/SpriteContext/useSprite";
import { useOpenAISettings } from "../../context/OpenAISettingsContext/useOpenAISettings";
import { useImageFileHandler } from "../../features/InputSection/hooks/useImageFileHandler";
import { GenerationMethod, getQualityTokenCost } from "../../types/export";
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
  /** Called after a successful generate / upload / blank.
   *  hero → navigate to the studio; studio → open Resize & Process. */
  onSuccess?: () => void;
  /** Which host renders this widget.
   *  - "hero" (default): all three tabs, asset type + size, and generate/upload
   *    COMMIT to the canvas before firing onSuccess (then the hero navigates).
   *  - "studio": AI Generate + Upload Image only, asset type on the AI tab (no
   *    size), and generate/upload STAGE a source image then fire onSuccess
   *    (which opens Resize & Process) WITHOUT pasting to the canvas. */
  surface?: Surface;
}

/**
 * Shared generation UI used by BOTH the hero entry widget and the studio Generate
 * modal. Composes the existing primitives (OpenAISettingsSection, ImageUploadForm,
 * AssetOptionsSelection) behind tabs, plus a token indicator and a context-aware
 * primary button. The `surface` prop selects the hero (commit) vs studio (stage)
 * behavior and the trimmed studio layout.
 */
export default function GenerationControls({
  onSuccess,
  surface = "hero",
}: Props) {
  const isStudio = surface === "studio";
  const { selectedMethod, setSelectedMethod } = useGenerationMethod();
  const { isGenerating } = useLoading();
  const { error } = useError();
  const { canGenerate, watchAdToEarnToken } = useToken();
  const { settings } = useOpenAISettings();
  const { width, height } = useCanvasSize();
  const { setSpriteData } = useSprite();
  const {
    generateAIImageAndConvertToSprite,
    processImageToSprite,
    importedImage,
    setSourceImage,
    stageSource,
  } = useImageFileHandler();

  // Display-only token cost for the selected quality (no real economy — ADR-0006).
  const tokenCost = getQualityTokenCost(settings.quality);

  // The studio has no Draw Blank tab. If the shared GenerationMethod context is
  // still on Blank (e.g. it was chosen on the hero before navigating in), fall
  // back to AI so a tab is always highlighted and the body always matches.
  const activeMethod =
    isStudio && selectedMethod === GenerationMethod.BlankCanvas
      ? GenerationMethod.TextToSprite
      : selectedMethod;

  // Fire onSuccess when an async generate/upload finishes without error. This
  // covers the AI path on both surfaces and the committing upload on the hero.
  const wasGenerating = useRef(false);
  useEffect(() => {
    if (wasGenerating.current && !isGenerating && !error) onSuccess?.();
    wasGenerating.current = isGenerating;
  }, [isGenerating, error, onSuccess]);

  const startBlankCanvas = () => {
    const blank: MakeCodeColor[][] = Array.from({ length: height }, () =>
      Array.from({ length: width }, () => MakeCodeColor.TRANSPARENT),
    );
    setSpriteData(blank);
    setSourceImage(null); // a blank canvas has no re-processable source
    onSuccess?.();
  };

  // Studio upload: stage the picked file (cache, do NOT paste) and hand off to
  // Resize & Process immediately. No async generation runs, so call onSuccess
  // directly (the isGenerating effect above won't fire for a staged upload).
  const handleStudioUpload = (file: File) => {
    stageSource(file);
    onSuccess?.();
  };

  const renderPrimary = () => {
    if (activeMethod === GenerationMethod.TextToSprite) {
      return canGenerate ? (
        <Button
          variant="primary"
          className="w-full"
          isLoading={isGenerating}
          onClick={() =>
            generateAIImageAndConvertToSprite(
              isStudio ? { commit: false } : undefined,
            ).catch(() => {})
          }
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
            if (isStudio) {
              // Source is normally staged on drop (auto-advance); this button is
              // the explicit affordance when a source is already cached.
              if (importedImage) handleStudioUpload(importedImage);
            } else {
              processImageToSprite();
            }
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
      {/* Tabs */}
      <SegmentedControl
        options={isStudio ? STUDIO_TABS : HERO_TABS}
        value={activeMethod}
        onChange={setSelectedMethod}
        ariaLabel="Generation method"
        stretch
        disabled={isGenerating}
      />

      {/* Method-specific input */}
      {activeMethod === GenerationMethod.TextToSprite && (
        <OpenAISettingsSection showQuality={isStudio} />
      )}
      {activeMethod === GenerationMethod.ImageToSprite && (
        <ImageUploadForm onFile={isStudio ? handleStudioUpload : undefined} />
      )}
      {activeMethod === GenerationMethod.BlankCanvas && (
        <p className="text-sm text-ink-muted">
          Start from an empty canvas at the size below and draw your sprite
          pixel by pixel.
        </p>
      )}

      {/* Asset options:
          - hero: asset type + size inputs (no preset chips), under all tabs.
          - studio: asset type only, on the AI Generate tab only (no size). */}
      {isStudio ? (
        activeMethod === GenerationMethod.TextToSprite && (
          <AssetOptionsSelection showSize={false} />
        )
      ) : (
        <AssetOptionsSelection showSizePresets={false} />
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
            ~40s AI sprite generation
          </span>
        </p>
      )}
    </div>
  );
}
