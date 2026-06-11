import { useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SpriteEditor from "../../features/SpriteEditor/SpriteEditor";
import StudioNav from "./components/StudioNav";
import GenerateModal from "./modals/GenerateModal";
import ResizeProcessModal from "./modals/ResizeProcessModal";
import ExportModal from "./modals/ExportModal";
import TokenModal from "./modals/TokenModal";
import { useModal } from "../../components/Modal/useModal";
import { useHasVisited } from "../../hooks/useHasVisited";
import { RightDockProvider } from "../../context/RightDockContext/RightDockContext";
import { interruptSelection } from "../../features/SpriteEditor/libs/selectionInterrupt";

/** Router navigation state the hero passes when an upload/generate staged a
 *  source there and wants the studio to open Resize & Process on arrival. */
interface StudioLocationState {
  openResize?: boolean;
}

/**
 * The studio (editor) route: the new shell — StudioNav top bar + the EditorSurface
 * (tool rail, canvas stage with floating actions, right dock) — and the three
 * feature modals whose open/close state lives here and is wired into the editor's
 * FloatingActionLayer.
 */
export default function StudioPage() {
  const { markVisited } = useHasVisited();
  const location = useLocation();
  const navigate = useNavigate();
  const generateModal = useModal();
  const resizeModal = useModal();
  const exportModal = useModal();
  const tokenModal = useModal();

  useEffect(() => {
    // Reaching the studio makes you a returning visitor (skip the hero next time).
    markVisited();
  }, [markVisited]);

  // Arriving from the hero's upload/generate (source already staged in the
  // app-wide ImageImportContext): open Resize & Process, then clear the nav
  // state so a re-render / back-navigation doesn't reopen it.
  const openResizeState = (location.state as StudioLocationState | null)
    ?.openResize;
  useEffect(() => {
    if (openResizeState) {
      resizeModal.open();
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [openResizeState, resizeModal, navigate, location.pathname]);

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
  const handleStaged = useCallback(() => {
    generateModal.close();
    resizeModal.open();
  }, [generateModal, resizeModal]);

  return (
    <RightDockProvider>
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
          onStaged={handleStaged}
        />
        <ResizeProcessModal
          isOpen={resizeModal.isOpen}
          onClose={resizeModal.close}
        />
        <ExportModal isOpen={exportModal.isOpen} onClose={exportModal.close} />
        <TokenModal isOpen={tokenModal.isOpen} onClose={tokenModal.close} />
      </div>
    </RightDockProvider>
  );
}
