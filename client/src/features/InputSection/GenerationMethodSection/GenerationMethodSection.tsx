import { useState } from "react";

// Component imports
import TabButton from "../components/TabButton";

// Type imports
import { GenerationMethod, generationMethods } from "@/types/export";

const GenerationMethodSection = () => {
  const [methodSelected, setMethodSelected] = useState<GenerationMethod>(
    GenerationMethod.TextToSprite
  );

  return (
    <div className="">
      <h3 className="heading-3">Generation Method</h3>
      {generationMethods.map((method) => (
        <TabButton
          key={method}
          isSelected={methodSelected === method}
          onClick={() => setMethodSelected(method)}>
          {`${method.charAt(0).toUpperCase() + method.slice(1)} to Sprite`}
        </TabButton>
      ))}
      {methodSelected === GenerationMethod.TextToSprite && (
        <div className="generation-method-section">
          <h3 className="heading-3">AI Generated Sprite</h3>
          <p className="paragraph">Coming soon...</p>
        </div>
      )}
      {methodSelected === GenerationMethod.ImageToSprite && (
        <div className="generation-method-section">
          <h3 className="heading-3">Image to Sprite Generation</h3>
          <p className="paragraph">Coming soon...</p>
        </div>
      )}
    </div>
  );
};

export default GenerationMethodSection;
