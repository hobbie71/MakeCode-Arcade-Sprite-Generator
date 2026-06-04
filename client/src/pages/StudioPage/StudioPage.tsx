import { useEffect, useState } from "react";
import SpriteEditor from "../../features/SpriteEditor/SpriteEditor";
import ExportSection from "../../features/ExportSection/ExportSection";
import InputSection from "../../features/InputSection/InputSection";
import MobileSidebar from "../../components/MobileSidebar";
import IssueReportButton from "../../components/IssueReportButton";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import ExportInstructions from "../../components/ExportInstructions";
import { useSidebar } from "../../hooks/useSidebar";
import { useHasVisited } from "../../hooks/useHasVisited";
import { useModal } from "../../components/Modal/useModal";
import Button from "../../components/Button";
import ResizeProcessModal from "./modals/ResizeProcessModal";
import ExportModal from "./modals/ExportModal";

/**
 * The studio (editor) route.
 *
 * TRANSITIONAL: for now it renders the original editor composition (NavBar +
 * InputSection sidebar + SpriteEditor + ExportSection) so the app stays fully
 * functional during the redesign. Phases 7–8 replace these internals with the
 * new shell — EditorSurface + the Generate / Resize & Process / Export modals.
 */
export default function StudioPage() {
  const [highlightIssueButton, setHighlightIssueButton] = useState(false);
  const [isExportInstructionsOpen, setIsExportInstructionsOpen] =
    useState(false);
  const mobileSidebar = useSidebar();
  const { markVisited } = useHasVisited();
  const resizeModal = useModal();
  const exportModal = useModal();

  useEffect(() => {
    // Reaching the studio makes you a returning visitor (skip the hero next time).
    markVisited();
    setHighlightIssueButton(true);
    const timer = setTimeout(() => setHighlightIssueButton(false), 5000);
    return () => clearTimeout(timer);
  }, [markVisited]);

  return (
    <>
      <NavBar
        toggleMobileSidebar={mobileSidebar.toggle}
        toggleExportInstructions={() => setIsExportInstructionsOpen((v) => !v)}
      />

      <main className="min-h-screen w-full flex flex-col p-4 gap-4 bg-surface sm:flex-row">
        <MobileSidebar
          isOpen={mobileSidebar.isOpen}
          onClose={mobileSidebar.close}>
          <InputSection onClose={mobileSidebar.close} showCloseButton={true} />
        </MobileSidebar>

        <section className="flex-1 flex flex-col gap-4">
          <SpriteEditor />
          <ExportSection />
        </section>
      </main>

      <ExportInstructions
        isOpen={isExportInstructionsOpen}
        onClose={() => setIsExportInstructionsOpen(false)}
      />

      {/* TRANSITIONAL action row — replaced by the FloatingActionLayer in Phase 7. */}
      <div className="fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-pill border border-line bg-surface-raised px-3 py-1.5 shadow-lg">
        <Button variant="secondary" onClick={resizeModal.open}>
          Resize &amp; Process
        </Button>
        <Button variant="primary" onClick={exportModal.open}>
          Export
        </Button>
      </div>

      <ResizeProcessModal
        isOpen={resizeModal.isOpen}
        onClose={resizeModal.close}
      />
      <ExportModal isOpen={exportModal.isOpen} onClose={exportModal.close} />

      <Footer />
      <IssueReportButton highlight={highlightIssueButton} />
    </>
  );
}
