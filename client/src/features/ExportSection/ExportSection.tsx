// Component imports
import ExportButton from "./components/ExportButton";
import CodeDisplay from "./components/CodeDisplay";
import { H2, H3, P } from "@/components/Typography";

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
      <H2>Export Sprite</H2>
      <div className="export-button-containers">
        {Object.values(ImageExportFormats).map((format) => (
          <ExportButton
            key={format}
            format={format}
            onClick={() => exportSpriteToImage(format)}
          />
        ))}
      </div>

      <H3>Arcade MakeCode Sprite Editor</H3>
      <P>
        Copy the code below and paste it into the Sprite Editor in ArcadeMake
        Code
      </P>
      <CodeDisplay>{getImgCode()}</CodeDisplay>

      <H3>Javascript Code</H3>
      <CodeDisplay>
        {`const mySprite = sprites.create(${getImgCode()}, SpriteKind.Player)`}
      </CodeDisplay>

      <H3>Python Code</H3>
      <CodeDisplay codingLanguage="python">
        {`my_sprite = arcade_sprites.create_sprite(${getImgCode().replace("img", "").replace("`", '"""').replace("`", '"""')}, sprite_kind="Player")`}
      </CodeDisplay>
    </div>
  );
};

export default ExportSection;
