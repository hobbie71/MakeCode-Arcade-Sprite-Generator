// React imports
import { useState, useEffect } from "react";

// Provider imports
import AppProviders from "./providers/AppProviders";

// Component imports
import SpriteEditor from "./features/SpriteEditor/SpriteEditor";
import ExportSection from "./features/ExportSection/ExportSection";
import InputSection from "./features/InputSection/InputSection";
import MobileSidebar from "./components/MobileSidebar";
import IssueReportButton from "./components/IssueReportButton";
import Error from "./components/Error";
import LoadingOverlay from "./components/LoadingOverlay";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import ExportInstructions from "./components/ExportInstructions";

// Hook imports
import { useSidebar } from "./hooks/useSidebar";
// import HorizontalResponiveAd from "./components/AdComponents/HorizontalResponiveAd";

function App() {
  const [highlightIssueButton, setHighlightIssueButton] = useState(false);
  const [isExportInstructionsOpen, setIsExportInstructionsOpen] =
    useState(false);
  const mobileSidebar = useSidebar();

  useEffect(() => {
    setHighlightIssueButton(true);
    const timer = setTimeout(() => {
      setHighlightIssueButton(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const toggleExportInstructions = () => {
    setIsExportInstructionsOpen(!isExportInstructionsOpen);
  };

  const closeExportInstructions = () => {
    setIsExportInstructionsOpen(false);
  };

  return (
    <AppProviders>
      {/* <div className="flex justify-center w-full max-w-2xl mx-auto max-h-40 overflow-hidden">
        <HorizontalResponiveAd />
      </div> */}

      {/* Navbar */}
      <NavBar
        toggleMobileSidebar={mobileSidebar.toggle}
        toggleExportInstructions={toggleExportInstructions}
      />

      <main className="min-h-screen w-full flex flex-col p-4 gap-4 bg-default-100 sm:flex-row">
        {/* Mobile Sidebar */}
        <MobileSidebar
          isOpen={mobileSidebar.isOpen}
          onClose={mobileSidebar.close}>
          <InputSection onClose={mobileSidebar.close} showCloseButton={true} />
        </MobileSidebar>

        {/* Main Content */}
        <section className="flex-1 flex flex-col gap-4">
          <SpriteEditor />
          <ExportSection />
        </section>

        {/* Export Instructions Popup */}
        {isExportInstructionsOpen && (
          <section className="popup">
            <ExportInstructions
              closeExportInstructions={closeExportInstructions}
            />
          </section>
        )}
      </main>

      <Footer />
      <LoadingOverlay />
      <IssueReportButton highlight={highlightIssueButton} />
      <Error />
    </AppProviders>
  );
}

export default App;
