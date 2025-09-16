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
import LoadingOverlay from "./components/LoadingOverlay";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import ExportInstructions from "./components/ExportInstructions";
// import HorizontalResponiveAd from "./components/AdComponents/HorizontalResponiveAd";

function App() {
  const [highlightIssueButton, setHighlightIssueButton] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isExportInstructionsOpen, setIsExportInstructionsOpen] =
    useState(false);

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
        toggleMobileSidebar={toggleMobileSidebar}
        toggleExportInstructions={toggleExportInstructions}
      />

      <main className="app-layout">
        <section
          className={`sidebar-mobile ${isMobileSidebarOpen ? "open" : ""}`}>
          <InputSection closeMobileSidebar={closeMobileSidebar} />
        </section>
        <section className="main-content">
          <SpriteEditor />
          <ExportSection />
        </section>
        <section className={`${isExportInstructionsOpen ? "popup" : "hidden"}`}>
          <ExportInstructions
            closeExportInstructions={closeExportInstructions}
          />
        </section>
      </main>
      <Footer />

      {/* <DevToolsButton /> */}
      <LoadingOverlay />
      <IssueReportButton highlight={highlightIssueButton} />
      <Error />
    </AppProviders>
  );
}

export default App;
