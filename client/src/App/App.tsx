// Style import
import "./App.css";

// React imports
import { useState, useEffect } from "react";

// Provider imports
import AppProviders from "@/providers/AppProviders";

// Component imports
import SpriteEditor from "@/features/SpriteEditor/SpriteEditor";
import ExportSection from "@/features/ExportSection/ExportSection";
import InputSection from "@/features/InputSection/InputSection";
// import DevToolsButton from "@/features/DevTools/components/DevToolsButton";
import IssueReportButton from "@/features/IssueReport/IssueReportButton";
import WelcomeModal from "../components/WelcomeModal";

function App() {
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [highlightIssueButton, setHighlightIssueButton] = useState(false);

  useEffect(() => {
    // Check if user has seen the welcome modal before
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcomeModal");
    if (!hasSeenWelcome) {
      setShowWelcomeModal(true);
    }

    // Highlight the issue report button for a few seconds
    setHighlightIssueButton(true);
    setTimeout(() => {
      setHighlightIssueButton(false);
    }, 5000); // Highlight for 5 seconds
  }, []);

  const handleCloseWelcomeModal = () => {
    setShowWelcomeModal(false);
    localStorage.setItem("hasSeenWelcomeModal", "true");

    // Highlight the issue report button for a few seconds
    setHighlightIssueButton(true);
    setTimeout(() => {
      setHighlightIssueButton(false);
    }, 5000); // Highlight for 5 seconds
  };

  return (
    <AppProviders>
      <main className="app-layout">
        <section className="sidebar">
          <InputSection />
        </section>
        <section className="main-content">
          <SpriteEditor />
          <ExportSection />
        </section>
      </main>
      {/* <DevToolsButton /> */}
      <IssueReportButton highlight={highlightIssueButton} />
      <WelcomeModal
        isVisible={showWelcomeModal}
        onClose={handleCloseWelcomeModal}
      />
    </AppProviders>
  );
}

export default App;
