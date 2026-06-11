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

const TABS: SegmentOption<GenerationMethod>[] = [
  { value: GenerationMethod.TextToSprite, label: "AI Generate" },
  { value: GenerationMethod.ImageToSprite, label: "Upload Image" },
  { value: GenerationMethod.BlankCanvas, label: "Draw Blank" },
];

interface Props {
  /** Called after a successful generate / upload / blank (hero → navigate; modal → close). */
  onSuccess?: () => void;
  /** Whether to show the Quality picker. The hero entry widget hides it for a
   *  minimal home-page form; the Studio modal keeps it. */
  showQuality?: boolean;
  /** Whether to show the quick square-size preset chips. Hidden in the minimal hero
   *  entry widget; shown in the Studio modal. */
  showSizePresets?: boolean;
}

/**
 * Shared generation UI used by BOTH the hero entry widget and the Generate
 * modal. Composes the existing primitives (OpenAISettingsSection, ImageUploadForm,
 * AssetOptionsSelection, PaletteSelection) behind AI / Upload / Blank tabs, plus
 * a display-only token indicator and a context-aware primary button.
 */
export default function GenerationControls({
  onSuccess,
  showQuality = true,
  showSizePresets = true,
}: Props) {
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
  } = useImageFileHandler();

  // Display-only token cost for the selected quality (no real economy — ADR-0006).
  const tokenCost = getQualityTokenCost(settings.quality);

  // Fire onSuccess when an async generate/upload finishes without error.
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

  const renderPrimary = () => {
    if (selectedMethod === GenerationMethod.TextToSprite) {
      return canGenerate ? (
        <Button
          variant="primary"
          className="w-full"
          isLoading={isGenerating}
          onClick={() => generateAIImageAndConvertToSprite().catch(() => {})}
        >
          ✦ Generate sprite
        </Button>
      ) : (
        // Display-only placeholder for the future rewarded-ad flow (ADR-0006).
        <Button
          variant="secondary"
          className="w-full"
          onClick={watchAdToEarnToken}
        >
          Watch ad to earn a token
        </Button>
      );
    }
    if (selectedMethod === GenerationMethod.ImageToSprite) {
      return (
        <Button
          variant="primary"
          className="w-full"
          isLoading={isGenerating}
          disabled={!importedImage}
          onClick={() => processImageToSprite()}
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
        options={TABS}
        value={selectedMethod}
        onChange={setSelectedMethod}
        ariaLabel="Generation method"
        stretch
        disabled={isGenerating}
      />

      {/* Method-specific input */}
      {selectedMethod === GenerationMethod.TextToSprite && (
        <OpenAISettingsSection showQuality={showQuality} />
      )}
      {selectedMethod === GenerationMethod.ImageToSprite && <ImageUploadForm />}
      {selectedMethod === GenerationMethod.BlankCanvas && (
        <p className="text-sm text-ink-muted">
          Start from an empty canvas at the size below and draw your sprite
          pixel by pixel.
        </p>
      )}

      {/* Common: asset type + size (palette lives in the studio dock per mockup) */}
      <AssetOptionsSelection showSizePresets={showSizePresets} />

      {renderPrimary()}

      {/* Cost + speed indicator (AI only) — sits below the button, mirrors the hero mockup */}
      {selectedMethod === GenerationMethod.TextToSprite && (
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
