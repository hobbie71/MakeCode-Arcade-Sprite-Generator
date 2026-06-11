import Modal from "../../../components/Modal/Modal";
import GenerationControls from "../../../components/GenerationControls/GenerationControls";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  /** Fired when a generate/upload has staged a source image — the studio closes
   *  this modal and opens Resize & Process. */
  onStaged: () => void;
}

/**
 * Studio Generate modal — wraps the shared GenerationControls in "studio" mode:
 * two tabs (AI Generate / Upload Image), asset type on the AI tab, no size, and
 * generate/upload STAGE a source image (canvas untouched) then hand off to
 * Resize & Process via onSuccess.
 */
export default function GenerateModal({ isOpen, onClose, onStaged }: Props) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      title="Generate a sprite"
      subtitle="Describe it or upload an image — AI draws it on the Arcade palette.">
      <GenerationControls surface="studio" onStaged={onStaged} />
    </Modal>
  );
}
