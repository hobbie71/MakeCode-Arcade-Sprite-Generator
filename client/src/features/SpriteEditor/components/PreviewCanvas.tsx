// Context imports
import { usePreviewCanvas } from "../../../context/PreviewCanvasContext/usePreviewCanvas";

interface Props {
  width: number;
  height: number;
  pixelSize: number;
  offset: { x: number; y: number };
  zoom: number;
}

const PreviewCanvas = ({ width, height, pixelSize, offset, zoom }: Props) => {
  const { previewCanvasRef } = usePreviewCanvas();

  return (
    <canvas
      ref={previewCanvasRef}
      width={width * pixelSize}
      height={height * pixelSize}
      className="absolute z-10"
      style={{
        transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
        transformOrigin: "50% 50%",
        pointerEvents: "none",
      }}
    />
  );
};

export default PreviewCanvas;
