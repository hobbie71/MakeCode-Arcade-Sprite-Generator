import Modal from "./Modal/Modal";
import { OS } from "../utils/getOS";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const command = OS === "mac" ? "Cmd" : "Ctrl";

const ExportInstructions = ({ isOpen, onClose }: Props) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title="How to export to MakeCode Arcade">
      <div className="flex flex-col gap-6">
        <ol className="list-inside list-decimal space-y-2 text-left text-sm text-ink-muted">
          <li>
            Copy the <b className="text-ink">Sprite Editor Code</b> in the{" "}
            <b className="text-ink">Export Sprite</b> section.
          </li>
          <li>
            Open the <b className="text-ink">MakeCode Arcade Sprite Editor</b>.
          </li>
          <li>Click inside the Sprite Editor canvas.</li>
          <li>
            Paste the sprite using:{" "}
            <span className="font-mono font-bold text-ink">{command} + V</span>
          </li>
          <li>Your sprite appears in the editor, ready to use!</li>
        </ol>
        <div className="text-sm text-ink-muted">
          Need help? See the animation below for a visual guide.
        </div>
        <img
          src="/preview.gif"
          alt="How to copy and paste into MakeCode Arcade"
          className="h-auto max-w-[640px] rounded-card shadow-md"
        />
      </div>
    </Modal>
  );
};

export default ExportInstructions;
