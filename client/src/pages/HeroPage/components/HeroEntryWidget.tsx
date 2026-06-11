import GenerationControls from "../../../components/GenerationControls/GenerationControls";

/**
 * The inline hero entry widget — the same GenerationControls used in the studio's
 * Generate modal (plus a Draw Blank tab), in a card. Generate/upload stage a
 * source and hand off to the studio's Resize & Process via onStaged; Draw Blank
 * hands off via onBlank.
 */
export default function HeroEntryWidget({
  onStaged,
  onBlank,
}: {
  onStaged: () => void;
  onBlank: () => void;
}) {
  return (
    <div className="w-full rounded-modal border border-line bg-surface-raised p-5 shadow-lg sm:p-6">
      <GenerationControls
        onStaged={onStaged}
        onBlank={onBlank}
        surface="hero"
      />
    </div>
  );
}
