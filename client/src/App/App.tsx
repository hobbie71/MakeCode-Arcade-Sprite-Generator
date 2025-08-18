// Style import
import "./App.css";

// Provider imports
import AppProviders from "@/providers/AppProviders";

// Component imports
import SpriteEditor from "@/features/SpriteEditor/SpriteEditor";
import ExportSection from "@/features/ExportSection/ExportSection";

function App() {
  return (
    <AppProviders>
      <div className="app-container">
        <SpriteEditor />
        <ExportSection />
      </div>
    </AppProviders>
  );
}

export default App;
