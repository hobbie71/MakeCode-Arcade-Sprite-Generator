import React from "react";
import { useLoading } from "../context/LoadingContext/useLoading";
import SquareResponiveAd from "./AdComponents/SquareResponiveAd";

/**
 * Small filled lightning bolt for the speed estimate — mirrors the bolt on the
 * home-page generation widget (see GenerationControls) so the studio's loading
 * state speaks the same visual language as the landing page.
 */
const BoltIcon: React.FC = () => (
  <svg
    aria-hidden
    className="h-3.5 w-3.5 text-accent"
    viewBox="0 0 24 24"
    fill="currentColor">
    <path d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z" />
  </svg>
);

/**
 * A 4×4 grid of accent "pixels" that shimmer in a diagonal wave — an on-brand
 * nod to the sprite being generated, in place of a generic ring spinner. Sits
 * on an accent-soft tile so the wave reads even when individual cells dim.
 */
const PixelLoader: React.FC = () => (
  <div
    role="status"
    aria-label="Generating"
    className="mx-auto flex h-20 w-20 items-center justify-center rounded-card bg-accent-soft">
    <div className="grid grid-cols-4 gap-1.5">
      {Array.from({ length: 16 }).map((_, i) => (
        <span
          key={i}
          className="h-3 w-3 animate-pulse rounded-[3px] bg-accent"
          style={{
            animationDelay: `${((i % 4) + Math.floor(i / 4)) * 110}ms`,
          }}
        />
      ))}
    </div>
  </div>
);

const LoadingOverlay: React.FC = () => {
  const { isGenerating, generationMessage } = useLoading();

  if (!isGenerating) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="tooltip-pop relative flex max-h-[90vh] w-full max-w-md flex-col overflow-y-auto rounded-modal border border-line bg-surface-raised p-6 text-center shadow-lg sm:p-7">
        {/* Loader + heading */}
        <PixelLoader />
        <h2 className="mt-5 text-h3 font-bold text-ink">
          {generationMessage || "Generating sprite…"}
        </h2>

        {/* Subtle meta line — mirrors the home-page widget's "· ⚡ ~60s" footer
            instead of a heavy banner. */}
        <p className="mt-2.5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-ink-subtle">
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
            <span aria-hidden className="text-accent">
              ✦
            </span>
            Powered by GPT-Image
          </span>
          <span aria-hidden className="font-bold">
            ·
          </span>
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
            <BoltIcon />
            ~60s AI sprite generation
          </span>
        </p>

        {/* Ad slot — labeled + framed so the empty/loading state reads as
            intentional rather than a void while the network ad fills in. */}
        <div className="mt-6">
          <p className="mb-1.5 text-2xs font-semibold uppercase tracking-wide text-ink-subtle">
            Advertisement
          </p>
          <div className="flex min-h-[250px] items-center justify-center overflow-hidden rounded-card border border-line bg-surface-sunken">
            <SquareResponiveAd />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
