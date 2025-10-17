// Component imports
import ExportButton from "./components/ExportButton";
import CodeDisplay from "./components/CodeDisplay";

// Hook imports
import { useExportSpriteData } from "../SpriteEditor/hooks/useExportSpriteData";

// Util imports
import { OS } from "../../utils/getOS";

// Type imports
import { ImageExportFormats } from "../../types/export";

const ExportSection = () => {
  const { exportSpriteToImage, getImgCode, getJavaScriptCode, getPythonCode } =
    useExportSpriteData();

  const command = OS === "mac" ? "Cmd" : "Ctrl";

  return (
    <section className="bg-default-200 rounded-3xl py-16 p-4 shadow-default-lg sm:py-4">
      <h5 className="heading-5">Export Sprite Image</h5>
      <div className="export-grid">
        {Object.values(ImageExportFormats).map((format) => (
          <ExportButton
            key={format}
            format={format}
            onClick={() => exportSpriteToImage(format)}
          />
        ))}
      </div>

      <h5 className="heading-5">Export Sprite Code</h5>

      <p className="paragraph-sm text-text-default-muted">
        Copy ({command}+C) and Paste ({command}+V) code into MakeCode Arcade
      </p>

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
    </section>
  );
};

export default ExportSection;
