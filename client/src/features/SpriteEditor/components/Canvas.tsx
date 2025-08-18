import { useEffect, memo, useState } from "react";

// Context import
import { useCanvas } from "../contexts/CanvasContext/useCanvas";
import { useToolSelected } from "../contexts/ToolSelectedContext/useToolSelected";
import { useZoom } from "../contexts/ZoomContext/useZoom";

// Hook import
import { useSpriteEditorCanvas } from "../hooks/useSpriteEditorCanvas";

interface Props {
  width: number;
  height: number;
  pixelSize?: number;
}

const Canvas = memo(({ width, height, pixelSize = 20 }: Props) => {
  const { canvasRef } = useCanvas();
  const { tool } = useToolSelected();
  const { zoom } = useZoom();

  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const {
    handlePointerDown,
    handlePointerLeave,
    handlePointerMove,
    handlePointerUp,
    initCanvas,
  } = useSpriteEditorCanvas(width, height, pixelSize, offset, setOffset);

  useEffect(() => initCanvas(), [initCanvas]);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "scroll",
        position: "relative",
        background: "#1e1e1e",
        cursor: tool === "pan" ? "grab" : "crosshair",
      }}
      onMouseDown={handlePointerDown}
      onMouseMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
      onMouseUp={handlePointerUp}>
      <canvas
        ref={canvasRef}
        width={width * pixelSize}
        height={height * pixelSize}
        className="block bg-white border border-gray-300 outline-none "
        tabIndex={0} // for keyboard accessibility
        style={{
          position: "absolute",
          left: offset.x,
          top: offset.y,
          transform: `scale(${zoom})`,
          transformOrigin: "top left",
          imageRendering: "pixelated",
          outline: "none",
        }}
      />
    </div>
  );
});

Canvas.displayName = "Canvas";

export default Canvas;
