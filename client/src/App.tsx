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

      {/* Mobile menu button */}
      <button
        className="mobile-menu-button"
        onClick={toggleMobileSidebar}
        aria-label="Toggle sidebar">
        Generate Sprite
      </button>

      {/* Mobile overlay */}
      {isMobileSidebarOpen && (
        <div className="mobile-overlay" onClick={closeMobileSidebar} />
      )}

      <main className="app-layout">
        <section
          className={`sidebar-mobile ${isMobileSidebarOpen ? "open" : ""}`}>
          <InputSection />
        </section>
        <section className="main-content">
          <SpriteEditor />
          <ExportSection />
        </section>
      </main>
      {/* <DevToolsButton /> */}
      <IssueReportButton highlight={highlightIssueButton} />
      <Error />
    </AppProviders>
  );
}

export default App;
