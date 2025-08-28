// Component imports
import TabButton from "../components/TabButton";
import ImageToSpriteSection from "./ImageToSpriteSection/ImageToSpriteSection";
import TextToSpriteSection from "./TextToSpriteSection/TextToSpriteSection";

// Context imports
import { useGenerationMethod } from "@/context/GenerationMethodContext/useGenerationMethod";

// Type imports
import { GenerationMethod, generationMethods } from "@/types/export";

const GenerationMethodSection = () => {
  const { selectedMethod, setSelectedMethod } = useGenerationMethod();

  return (
    <div className="">
      <h3 className="heading-3">Generation Method</h3>
      {generationMethods.map((method) => (
        <TabButton
          key={method}
          isSelected={selectedMethod === method}
          onClick={() => setSelectedMethod(method)}>
          {`${method.charAt(0).toUpperCase() + method.slice(1)} to Sprite`}
        </TabButton>
      ))}
      {selectedMethod === GenerationMethod.TextToSprite && (
        <div className="generation-method-section">
          <h3 className="heading-3">AI Generated Sprite</h3>
          <TextToSpriteSection />
        </div>
      )}
      {selectedMethod === GenerationMethod.ImageToSprite && (
        <div className="generation-method-section">
          <h3 className="heading-3">Image to Sprite Generation</h3>
          <ImageToSpriteSection />
        </div>
      )}
    </div>
  );
};

export default GenerationMethodSection;
