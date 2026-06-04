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

        {isExportInstructionsOpen && (
          <section className="popup">
            <ExportInstructions
              closeExportInstructions={() => setIsExportInstructionsOpen(false)}
            />
          </section>
        )}
      </main>

      <Footer />
      <IssueReportButton highlight={highlightIssueButton} />
    </>
  );
}
