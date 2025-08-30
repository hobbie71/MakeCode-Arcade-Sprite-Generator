import { useState } from "react";
import DevImageUpload from "./DevImageUpload";
import SizeInputs from "../../../features/InputSection/components/SizeInputs";

const ImageProcessingPipeline = () => {
  const [canvasArray, setCanvasArray] = useState<HTMLCanvasElement[]>([]);

  return (
    <div className="min-h-screen bg-gray-950 p-8 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          Image Processing Pipeline
        </h1>
        <div className="bg-gray-900 p-6 rounded-lg text-white flex justify-around">
          <div className="">
            <h3 className="heading-3">Sprite Size (px)</h3>
            <SizeInputs />
          </div>
          <DevImageUpload setCanvasArray={setCanvasArray} />
        </div>
        {canvasArray.length > 0 && (
          <div className="mt-8 flex flex-row items-start justify-center gap-8 overflow-x-auto">
            {canvasArray.map((canvas, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div
                  className="bg-gray-800 rounded shadow p-2 flex items-center justify-cente"
                  style={{
                    width: 160,
                    height: 160,
                    minWidth: 160,
                    minHeight: 160,
                  }}>
                  <canvas
                    ref={(node) => {
                      if (node && canvas) {
                        node.width = 144;
                        node.height = 144;
                        const ctx = node.getContext("2d");
                        if (ctx) {
                          ctx.clearRect(0, 0, node.width, node.height);
                          // Fit image into 144x144, preserving aspect ratio
                          const scale = Math.min(
                            144 / canvas.width,
                            144 / canvas.height
                          );
                          const drawWidth = canvas.width * scale;
                          const drawHeight = canvas.height * scale;
                          const dx = (144 - drawWidth) / 2;
                          const dy = (144 - drawHeight) / 2;
                          ctx.drawImage(canvas, dx, dy, drawWidth, drawHeight);
                        }
                      }
                    }}
                    style={{ background: "#222", borderRadius: 8 }}
                    width={144}
                    height={144}
                  />
                </div>
                <span className="mt-2 text-xs text-gray-400">
                  Step {idx + 1}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageProcessingPipeline;
