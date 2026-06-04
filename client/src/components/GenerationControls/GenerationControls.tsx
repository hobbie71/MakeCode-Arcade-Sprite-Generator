import { useEffect, useRef } from "react";
import Button from "../Button";
import OpenAISettingsSection from "../../features/InputSection/GenerationMethodSection/TextToSpriteSection/components/OpenAISettingsSection";
import ImageUploadForm from "../../features/InputSection/GenerationMethodSection/ImageToSpriteSection/components/ImageUploadForm";
import AssetOptionsSelection from "../../features/InputSection/components/AssetOptionsSelection";
import { useGenerationMethod } from "../../context/GenerationMethodContext/useGenerationMethod";
import { useLoading } from "../../context/LoadingContext/useLoading";
import { useError } from "../../context/ErrorContext/useError";
import { useToken } from "../../context/TokenContext/useToken";
import { useCanvasSize } from "../../context/CanvasSizeContext/useCanvasSize";
import { useSprite } from "../../context/SpriteContext/useSprite";
import { useImageFileHandler } from "../../features/InputSection/hooks/useImageFileHandler";
import { GenerationMethod } from "../../types/export";
import { MakeCodeColor } from "../../types/color";

const TABS: { method: GenerationMethod; label: string }[] = [
  { method: GenerationMethod.TextToSprite, label: "AI Generate" },
  { method: GenerationMethod.ImageToSprite, label: "Upload Image" },
  { method: GenerationMethod.BlankCanvas, label: "Draw Blank" },
];

interface Props {
  /** Called after a successful generate / upload / blank (hero → navigate; modal → close). */
  onSuccess?: () => void;
}

/**
 * Shared generation UI used by BOTH the hero entry widget and the Generate
 * modal. Composes the existing primitives (OpenAISettingsSection, ImageUploadForm,
 * AssetOptionsSelection, PaletteSelection) behind AI / Upload / Blank tabs, plus
 * a display-only token indicator and a context-aware primary button.
 */
export default function GenerationControls({ onSuccess }: Props) {
  const { selectedMethod, setSelectedMethod } = useGenerationMethod();
  const { isGenerating } = useLoading();
  const { error } = useError();
  const { balance, canGenerate, watchAdToEarnToken } = useToken();
  const { width, height } = useCanvasSize();
  const { setSpriteData } = useSprite();
  const {
    generateAIImageAndConvertToSprite,
    processImageToSprite,
    importedImage,
    setSourceImage,
  } = useImageFileHandler();

  // Fire onSuccess when an async generate/upload finishes without error.
  const wasGenerating = useRef(false);
  useEffect(() => {
    if (wasGenerating.current && !isGenerating && !error) onSuccess?.();
    wasGenerating.current = isGenerating;
  }, [isGenerating, error, onSuccess]);

  const startBlankCanvas = () => {
    const blank: MakeCodeColor[][] = Array.from({ length: height }, () =>
      Array.from({ length: width }, () => MakeCodeColor.TRANSPARENT)
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
          onClick={() => generateAIImageAndConvertToSprite().catch(() => {})}>
          ✦ Generate sprite
        </Button>
      ) : (
        // Display-only placeholder for the future rewarded-ad flow (ADR-0006).
        <Button
          variant="secondary"
          className="w-full"
          onClick={watchAdToEarnToken}>
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
          onClick={() => processImageToSprite()}>
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
      <div className="flex gap-1 rounded-chip border border-line bg-surface p-1">
        {TABS.map(({ method, label }) => {
          const active = selectedMethod === method;
          return (
            <button
              key={method}
              type="button"
              disabled={isGenerating}
              onClick={() => setSelectedMethod(method)}
              className={`flex-1 whitespace-nowrap rounded-[10px] px-2 py-1.5 text-sm font-medium transition-colors disabled:opacity-50 sm:px-3 ${
                active
                  ? "bg-surface-raised text-accent shadow-sm"
                  : "text-ink-muted hover:text-ink"
              }`}>
              {label}
            </button>
          );
        })}
      </div>

      {/* Method-specific input */}
      {selectedMethod === GenerationMethod.TextToSprite && (
        <OpenAISettingsSection />
      )}
      {selectedMethod === GenerationMethod.ImageToSprite && <ImageUploadForm />}
      {selectedMethod === GenerationMethod.BlankCanvas && (
        <p className="text-sm text-ink-muted">
          Start from an empty canvas at the size below and draw your sprite pixel
          by pixel.
        </p>
      )}

      {/* Common: asset type + size (palette lives in the studio dock per mockup) */}
      <AssetOptionsSelection />

      {/* Token indicator (AI only) */}
      {selectedMethod === GenerationMethod.TextToSprite && (
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs text-ink-muted">
          <span className="whitespace-nowrap">
            <span className="text-accent">★</span> {balance} tokens · this costs
            1
          </span>
          <span className="whitespace-nowrap text-ink-subtle">
            powered by GPT-Image
          </span>
        </div>
      )}

      {renderPrimary()}
    </div>
  );
}
