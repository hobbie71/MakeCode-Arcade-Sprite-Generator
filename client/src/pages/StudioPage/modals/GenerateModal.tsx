import Modal from "../../../components/Modal/Modal";
import GenerationControls from "../../../components/GenerationControls/GenerationControls";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Generate modal — wraps the shared GenerationControls. It closes itself when a
 * generation/upload completes without error (GenerationControls fires onSuccess
 * on the isGenerating true→false transition) or when blank-canvas is chosen.
 */
export default function GenerateModal({ isOpen, onClose }: Props) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      title="Generate a sprite"
      subtitle="Describe it or upload an image — AI draws it on the Arcade palette.">
      <GenerationControls onSuccess={onClose} />
    </Modal>
  );
}
