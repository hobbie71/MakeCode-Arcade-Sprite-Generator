// React imports
import { useState, useEffect } from "react";

// Provider imports
import AppProviders from "./providers/AppProviders";

// Component imports
import SpriteEditor from "./features/SpriteEditor/SpriteEditor";
import ExportSection from "./features/ExportSection/ExportSection";
import InputSection from "./features/InputSection/InputSection";
import IssueReportButton from "./features/IssueReport/IssueReportButton";
import Error from "./components/Error";
import Button from "./components/Button";
import LoadingOverlay from "./components/LoadingOverlay";
// import HorizontalResponiveAd from "./components/AdComponents/HorizontalResponiveAd";

function App() {
  const [highlightIssueButton, setHighlightIssueButton] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    setHighlightIssueButton(true);
    setTimeout(() => {
      setHighlightIssueButton(false);
    }, 5000); // Highlight for 5 seconds
  }, []);

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  return (
    <AppProviders>
      {/* <div className="flex justify-center w-full max-w-2xl mx-auto max-h-40 overflow-hidden">
        <HorizontalResponiveAd />
      </div> */}

      {/* Mobile title */}
      <div className="sm:hidden bg-[#171717]">
        <h1 className="text-white text-lg font-bold text-center p-4">
          MakeCode Arcade AI Sprite Generator
        </h1>
      </div>

      {/* Mobile menu button */}
      <Button
        onClick={toggleMobileSidebar}
        aria-label="Toggle sidebar"
        variant="secondary"
        className="fixed sm:hidden bottom-4 right-4 z-40">
        Generate Sprite
      </Button>

      {/* Mobile overlay */}
      {isMobileSidebarOpen && (
        <div className="mobile-overlay" onClick={closeMobileSidebar} />
      )}

      <main className="app-layout">
        <section
          className={`sidebar-mobile ${isMobileSidebarOpen ? "open" : ""}`}>
          <InputSection closeMobileSidebar={closeMobileSidebar} />
        </section>
        <section className="main-content">
          <SpriteEditor />
          <ExportSection />
        </section>
      </main>
      {/* <DevToolsButton /> */}
      <LoadingOverlay />
      <IssueReportButton highlight={highlightIssueButton} />
      <Error />
    </AppProviders>
  );
}

export default App;
