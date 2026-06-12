import { useCallback, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SpriteEditor from "../../features/SpriteEditor/SpriteEditor";
import StudioNav from "./components/StudioNav";
import GenerateModal from "./modals/GenerateModal";
import ResizeProcessModal from "./modals/ResizeProcessModal";
import ExportModal from "./modals/ExportModal";
import TokenModal from "./modals/TokenModal";
import { useModal } from "../../components/Modal/useModal";
import { useHasVisited } from "../../hooks/useHasVisited";
import { useLoading } from "../../context/LoadingContext/useLoading";
import { useError } from "../../context/ErrorContext/useError";
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
  const { isGenerating } = useLoading();
  const { error } = useError();
  const generateModal = useModal();
  const resizeModal = useModal();
  const exportModal = useModal();
  const tokenModal = useModal();

  useEffect(() => {
    // Reaching the studio makes you a returning visitor (skip the hero next time).
    markVisited();
  }, [markVisited]);

  // True between a generation/processing run starting and finishing — used to
  // detect the start/finish transitions exactly once each.
  const wasGenerating = useRef(false);
  // A staging flow (Generate modal, or a hero hand-off) is waiting on the
  // current generation; open Resize & Process once it finishes cleanly.
  const pendingResize = useRef(false);

  // Arriving from the hero's upload/generate (source staged in the app-wide
  // ImageImportContext): open Resize & Process, then clear the nav state so a
  // re-render / back-navigation doesn't reopen it. An upload stages its source
  // synchronously (it's ready now → open immediately); an AI generation is still
  // in flight on arrival (isGenerating) → defer until it completes.
  const openResizeState = (location.state as StudioLocationState | null)
    ?.openResize;
  useEffect(() => {
    if (!openResizeState) return;
    if (isGenerating) {
      pendingResize.current = true;
    } else {
      resizeModal.open();
    }
    navigate(location.pathname, { replace: true, state: null });
  }, [openResizeState, isGenerating, resizeModal, navigate, location.pathname]);

  // The loading overlay is the single visible surface while generation runs, so
  // when one STARTS, close every modal (the request: "every other modal has to
  // be closed"). If it came from the Generate modal, remember to reopen Resize &
  // Process afterwards. When it FINISHES cleanly, fulfil any pending Resize.
  useEffect(() => {
    const started = !wasGenerating.current && isGenerating;
    const finished = wasGenerating.current && !isGenerating;
    wasGenerating.current = isGenerating;

    if (started) {
      if (generateModal.isOpen) pendingResize.current = true;
      generateModal.close();
      resizeModal.close();
      exportModal.close();
      tokenModal.close();
    } else if (finished) {
      if (pendingResize.current && !error) resizeModal.open();
      pendingResize.current = false;
    }
  }, [isGenerating, error, generateModal, resizeModal, exportModal, tokenModal]);

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
