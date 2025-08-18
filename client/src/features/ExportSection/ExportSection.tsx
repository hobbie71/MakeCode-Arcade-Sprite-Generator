// Component imports
import ExportButton from "./components/ExportButton";
import CodeDisplay from "./components/CodeDisplay";

// Hook imports
import { useSpriteData } from "../SpriteEditor/hooks/useSpriteData";

// Type imports
import { ImageExportFormats } from "@/types/export";

const ExportSection = () => {
  const { exportSpriteToImage, getImgCode } = useSpriteData();

  return (
    <div
      className="export-section-container text-black p-4"
      style={{ backgroundColor: "#fef3e0" }}>
      <h2 className="text-xl font-semibold my-4 mx-2">Export Sprite</h2>
      <div className="export-button-containers">
        {Object.values(ImageExportFormats).map((format) => (
          <ExportButton
            key={format}
            format={format}
            onClick={() => exportSpriteToImage(format)}
          />
        ))}
      </div>

      <h3 className="text-xl font-semibold my-4 mx-2">
        Arcade MakeCode Sprite Editor
      </h3>
      <p className="my-4 mx-2">
        Copy the code below and paste it into the Sprite Editor in ArcadeMake
        Code
      </p>
      <CodeDisplay>{getImgCode()}</CodeDisplay>

      <h3 className="text-xl font-semibold my-4 mx-2">Javascript Code</h3>
      <CodeDisplay>
        {`const mySprite = sprites.create(${getImgCode()}, SpriteKind.Player)`}
      </CodeDisplay>

      <h3 className="text-xl font-semibold my-4 mx-2">Python Code</h3>
      <CodeDisplay codingLanguage="python">
        {`my_sprite = arcade_sprites.create_sprite(${getImgCode().replace("img", "").replace("`", '"""').replace("`", '"""')}, sprite_kind="Player")`}
      </CodeDisplay>
    </div>
  );
};

export default ExportSection;
