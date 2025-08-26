// Style import
import "./App.css";

// Provider imports
import AppProviders from "@/providers/AppProviders";

// Component imports
import SpriteEditor from "@/features/SpriteEditor/SpriteEditor";
import ExportSection from "@/features/ExportSection/ExportSection";
import InputSection from "@/features/InputSection/InputSection";
import DevToolsButton from "@/features/DevTools/components/DevToolsButton";

function App() {
  return (
    <AppProviders>
      <div className="app-container grid grid-cols-10">
        <div className="col-span-3">
          <InputSection />
        </div>
        <div className="col-span-7">
          <SpriteEditor />
          <ExportSection />
        </div>
      </div>
      <DevToolsButton />
    </AppProviders>
  );
}

export default App;
