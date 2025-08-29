// Style import
import "./App.css";

// Provider imports
import AppProviders from "@/providers/AppProviders";

// Component imports
import SpriteEditor from "@/features/SpriteEditor/SpriteEditor";
import ExportSection from "@/features/ExportSection/ExportSection";
import InputSection from "@/features/InputSection/InputSection";
import DevToolsButton from "@/features/DevTools/components/DevToolsButton";
import IssueReportButton from "@/features/IssueReport/components/IssueReportButton";

function App() {
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
      <IssueReportButton />
    </AppProviders>
  );
}

export default App;
