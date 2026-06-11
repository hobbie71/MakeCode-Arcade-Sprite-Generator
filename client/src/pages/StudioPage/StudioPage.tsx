import { useCallback, useEffect } from "react";
import SpriteEditor from "../../features/SpriteEditor/SpriteEditor";
import StudioNav from "./components/StudioNav";
import GenerateModal from "./modals/GenerateModal";
import ResizeProcessModal from "./modals/ResizeProcessModal";
import ExportModal from "./modals/ExportModal";
import TokenModal from "./modals/TokenModal";
import { useModal } from "../../components/Modal/useModal";
import { useHasVisited } from "../../hooks/useHasVisited";
import { interruptSelection } from "../../features/SpriteEditor/libs/selectionInterrupt";

/**
 * The studio (editor) route: the new shell — StudioNav top bar + the EditorSurface
 * (tool rail, canvas stage with floating actions, right dock) — and the three
 * feature modals whose open/close state lives here and is wired into the editor's
 * FloatingActionLayer.
 */
export default function StudioPage() {
  const { markVisited } = useHasVisited();
  const generateModal = useModal();
  const resizeModal = useModal();
  const exportModal = useModal();
  const tokenModal = useModal();

  useEffect(() => {
    // Reaching the studio makes you a returning visitor (skip the hero next time).
    markVisited();
  }, [markVisited]);

  // Opening a sprite-reading flow mid-move cancels the floating selection
  // (pixels snap home) so every modal sees the whole, unmoved sprite — see
  // ADR-0007 decision 6. Wrapped here because the nav lives outside the
  // editor's provider tree.
  const openGenerate = useCallback(() => {
    interruptSelection();
    generateModal.open();
  }, [generateModal]);
  const openResize = useCallback(() => {
    interruptSelection();
    resizeModal.open();
  }, [resizeModal]);
  const openExport = useCallback(() => {
    interruptSelection();
    exportModal.open();
  }, [exportModal]);

  // A staged generate/upload hands off to Resize & Process: close the Generate
  // modal and open Resize seeded with the freshly staged source image.
  const handleGenerated = useCallback(() => {
    generateModal.close();
    resizeModal.open();
  }, [generateModal, resizeModal]);

  return (
    <div className="flex h-screen flex-col bg-surface">
      <StudioNav onOpenExport={openExport} onOpenTokens={tokenModal.open} />

      <div className="min-h-0 flex-1">
        <SpriteEditor
          onOpenGenerate={openGenerate}
          onOpenResize={openResize}
          onOpenExport={openExport}
        />
      </div>

      <GenerateModal
        isOpen={generateModal.isOpen}
        onClose={generateModal.close}
        onSuccess={handleGenerated}
      />
      <ResizeProcessModal
        isOpen={resizeModal.isOpen}
        onClose={resizeModal.close}
      />
      <ExportModal isOpen={exportModal.isOpen} onClose={exportModal.close} />
      <TokenModal isOpen={tokenModal.isOpen} onClose={tokenModal.close} />
    </div>
  );
}
