import GenerationControls from "../../../components/GenerationControls/GenerationControls";

/**
 * The inline hero entry widget — the same GenerationControls used in the studio's
 * Generate modal, in a card. On success it hands off to the studio.
 */
export default function HeroEntryWidget({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  return (
    <div className="w-full rounded-modal border border-line bg-surface-raised p-5 shadow-lg sm:p-6">
      <GenerationControls onSuccess={onSuccess} surface="hero" />
    </div>
  );
}
