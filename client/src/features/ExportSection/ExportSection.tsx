// Component imports
import ExportButton from "./components/ExportButton";
import CodeDisplay from "./components/CodeDisplay";

// Hook imports
import { useExportSpriteData } from "../SpriteEditor/hooks/useExportSpriteData";

// Type imports
import { ImageExportFormats } from "../../types/export";

const ExportSection = () => {
  const { exportSpriteToImage, getImgCode, getJavaScriptCode, getPythonCode } =
    useExportSpriteData();

  return (
    <section className="export-section bg-neutral-900 py-16 sm:py-4">
      <h3 className="heading-3">Export Sprite Image</h3>
      <div className="export-grid">
        {Object.values(ImageExportFormats).map((format) => (
          <ExportButton
            key={format}
            format={format}
            onClick={() => exportSpriteToImage(format)}
          />
        ))}
      </div>

      <h3 className="heading-3">Export Sprite Code</h3>

      <div className="export-grid">
        <div className="export-card">
          <h5 className="heading-5">Sprite Editor Code</h5>
          <CodeDisplay>{getImgCode()}</CodeDisplay>
        </div>

        <div className="export-card">
          <h5 className="heading-5">Javascript Code</h5>
          <CodeDisplay>{getJavaScriptCode()}</CodeDisplay>
        </div>

        <div className="export-card">
          <h5 className="heading-5">Python Code</h5>
          <CodeDisplay codingLanguage="python">{getPythonCode()}</CodeDisplay>
        </div>
      </div>

      {/* Instructional Preview Section */}

      <h3 className="heading-3">How To Export Into Arcade MakeCode</h3>

      <div className="mb-4 flex flex-col gap-6">
        <p className="text-neutral-300 text-sm">
          Copy the <b>Sprite Editor Code</b> above and paste it directly into
          the <b>MakeCode Arcade Sprite Editor</b> to import your sprite!
        </p>
        <div className="text-neutral-300 text-sm">
          Paste using: <span className="font-mono">Ctrl + V</span> (Windows) or{" "}
          <span className="font-mono">Cmd + V</span> (Mac)
        </div>
        <img
          src="../preview.gif"
          alt="How to copy and paste into MakeCode Arcade"
          className="max-w-[640px] h-auto rounded shadow"
        />
      </div>
    </section>
  );
};

export default ExportSection;
