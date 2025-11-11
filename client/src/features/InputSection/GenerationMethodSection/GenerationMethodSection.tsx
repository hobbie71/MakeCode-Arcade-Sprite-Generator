// Component imports
import TabButton from "../components/TabButton";
import ImageToSpriteSection from "./ImageToSpriteSection/ImageToSpriteSection";
import TextToSpriteSection from "./TextToSpriteSection/TextToSpriteSection";

// Context imports
import { useGenerationMethod } from "../../../context/GenerationMethodContext/useGenerationMethod";
import { useLoading } from "../../../context/LoadingContext/useLoading";

// Type imports
import { GenerationMethod, generationMethods } from "../../../types/export";

const GenerationMethodSection = () => {
  const { selectedMethod, setSelectedMethod } = useGenerationMethod();
  const { isGenerating } = useLoading();

  return (
    <div className="form-group">
      <h4 className="heading-4">Generation Method</h4>
      <div className="tab-list">
        {generationMethods.map((method) => (
          <TabButton
            key={method}
            isSelected={selectedMethod === method}
            isLoading={isGenerating}
            onClick={() => setSelectedMethod(method)}>
            {`${method.charAt(0).toUpperCase() + method.slice(1)} to Sprite`}
          </TabButton>
        ))}
      </div>
      {selectedMethod === GenerationMethod.TextToSprite && (
        <div className="form-group">
          <TextToSpriteSection />
        </div>
      )}
      {selectedMethod === GenerationMethod.ImageToSprite && (
        <div className="form-group">
          <ImageToSpriteSection />
        </div>
      )}
    </div>
  );
};

export default GenerationMethodSection;
