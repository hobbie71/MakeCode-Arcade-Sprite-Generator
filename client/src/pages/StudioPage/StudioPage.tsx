import { useEffect } from "react";
import SpriteEditor from "../../features/SpriteEditor/SpriteEditor";
import StudioNav from "./components/StudioNav";
import GenerateModal from "./modals/GenerateModal";
import ResizeProcessModal from "./modals/ResizeProcessModal";
import ExportModal from "./modals/ExportModal";
import { useModal } from "../../components/Modal/useModal";
import { useHasVisited } from "../../hooks/useHasVisited";

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

  useEffect(() => {
    // Reaching the studio makes you a returning visitor (skip the hero next time).
    markVisited();
  }, [markVisited]);

  return (
    <div className="flex h-screen flex-col bg-surface">
      <StudioNav onOpenExport={exportModal.open} />

      <div className="min-h-0 flex-1">
        <SpriteEditor
          onOpenGenerate={generateModal.open}
          onOpenResize={resizeModal.open}
          onOpenExport={exportModal.open}
        />
      </div>

      <GenerateModal
        isOpen={generateModal.isOpen}
        onClose={generateModal.close}
      />
      <ResizeProcessModal
        isOpen={resizeModal.isOpen}
        onClose={resizeModal.close}
      />
      <ExportModal isOpen={exportModal.isOpen} onClose={exportModal.close} />
    </div>
  );
}
