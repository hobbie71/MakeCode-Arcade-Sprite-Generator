import { useState, useEffect } from "react";

// Component imports
import ExportButton from "./components/ExportButton";
import CodeDisplay from "./components/CodeDisplay";
import DefaultDropDown from "../../components/DefaultDropDown";

// Hook imports
import { useExportSpriteData } from "../SpriteEditor/hooks/useExportSpriteData";

// Util imports
import { OS } from "../../utils/getOS";

// Type imports
import { ImageExportFormats } from "../../types/export";
import { ALL_IMAGE_EXPORT_FORMATS } from "../../types/export";

const ExportSection = () => {
  const { exportSpriteToImage, getImgCode, getJavaScriptCode, getPythonCode } =
    useExportSpriteData();

  const [showExportButton, setShowExportButton] =
    useState<null | ImageExportFormats>(null);

  // Reset showExportButton when screen reaches medium width (1024px)
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    const handleMediaChange = (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches) {
        // Screen is large - reset to null
        setShowExportButton(null);
      } else {
        setShowExportButton(ImageExportFormats.PNG);
      }
    };

    // Check initial state
    handleMediaChange(mediaQuery);

    // Listen for changes
    mediaQuery.addEventListener("change", handleMediaChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaChange);
    };
  }, []);

  const command = OS === "mac" ? "Cmd" : "Ctrl";

  return (
    <section className="bg-default-200 rounded-3xl p-4 shadow-default-lg">
      <div className="flex justify-between items-center">
        <h5 className="heading-5">Export Sprite Image</h5>
        <DefaultDropDown
          className="lg:hidden"
          onChange={(index: number) =>
            setShowExportButton(ALL_IMAGE_EXPORT_FORMATS[index].format)
          }
          options={ALL_IMAGE_EXPORT_FORMATS}
          value={ALL_IMAGE_EXPORT_FORMATS.findIndex(
            (imgFormat) => showExportButton === imgFormat.format
          )}>
          {""}
        </DefaultDropDown>
      </div>
      <div className="export-grid">
        {Object.values(ImageExportFormats).map((format) => {
          if (!showExportButton || showExportButton === format) {
            return (
              <ExportButton
                key={format}
                format={format}
                onClick={() => exportSpriteToImage(format)}
              />
            );
          }
        })}
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
