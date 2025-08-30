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
    <section className="export-section bg-neutral-900 ">
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

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
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
