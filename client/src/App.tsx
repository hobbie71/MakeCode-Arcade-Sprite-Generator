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

  useEffect(() => {
    setHighlightIssueButton(true);
    setTimeout(() => {
      setHighlightIssueButton(false);
    }, 5000); // Highlight for 5 seconds
  }, []);

  return (
    <AppProviders>
      {/* <div className="flex justify-center w-full max-w-2xl mx-auto max-h-40 overflow-hidden">
        <HorizontalResponiveAd />
      </div> */}
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
      <Error />
    </AppProviders>
  );
}

export default App;
