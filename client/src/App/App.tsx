// Style import
import "./App.css";

// Provider imports
import AppProviders from "@/providers/AppProviders";

// Component imports
import SpriteEditor from "@/features/SpriteEditor/SpriteEditor";
import ExportSection from "@/features/ExportSection/ExportSection";
import InputSection from "@/features/InputSection/InputSection";

function App() {
  return (
    <AppProviders>
      <div className="app-container flex flex-row w-full h-full">
        <InputSection />
        <div className="w-full">
          <SpriteEditor />
          <ExportSection />
        </div>
      </div>
    </AppProviders>
  );
}

export default App;
