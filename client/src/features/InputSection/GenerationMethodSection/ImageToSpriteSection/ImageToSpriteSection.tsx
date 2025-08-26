// Component imports
import ImageUploadForm from "./components/ImageUploadForm";
import CheckBox from "../../components/CheckBox";
import NumberInputBox from "../../components/NumberInputBox";

// Hook imports
import { useImageToSpriteExportSettings } from "./hooks/useImageToSpriteExportSettings";

const ImageToSpriteSection = () => {
  const { settings, changeSetting } = useImageToSpriteExportSettings();

  return (
    <div className="">
      <CheckBox
        onChange={(bool) => changeSetting("cropEdges", bool)}
        checked={settings.cropEdges}>
        Crop Edges
      </CheckBox>
      <CheckBox
        onChange={(bool) => changeSetting("removeBackground", bool)}
        checked={settings.removeBackground}>
        Remove Background
      </CheckBox>
      {settings.removeBackground && (
        <NumberInputBox
          label="Tolerance"
          onChange={(num) => changeSetting("tolerance", num)}
          value={settings.tolerance}
          min={1}
          max={100}
          maxDigits={3}
        />
      )}
      <ImageUploadForm />
    </div>
  );
};

export default ImageToSpriteSection;
