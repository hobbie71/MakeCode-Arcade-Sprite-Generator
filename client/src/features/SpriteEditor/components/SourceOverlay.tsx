import { useSourceGhost } from "../contexts/SourceGhostContext/useSourceGhost";
import { useFramedSourceCanvas } from "../hooks/useFramedSourceCanvas";

interface Props {
  width: number;
  height: number;
  pixelSize: number;
  offset: { x: number; y: number };
  zoom: number;
}

// Backing-store cap for the ghost so it stays sharp when the editor is zoomed in.
const MAX_BACKING_EDGE = 2048;

/**
 * Ghost of the source image for tracing: the full-res original cropped to the
 * sprite's frame (the region the processing pipeline mapped onto the canvas),
 * tracking the same pan/zoom transform as the main canvas (the PreviewCanvas
 * pattern). Mounted right after the main canvas with no z-index, so it stacks
 * above the sprite pixels but below the stroke preview (z-10) and grid (z-20).
 * Never intercepts pointer events.
 */
const SourceOverlay = ({ width, height, pixelSize, offset, zoom }: Props) => {
  const { ghostVisible, ghostOpacity } = useSourceGhost();
  // ghostVisible is the redraw key: the canvas remounts on toggle-on.
  const { canvasRef, bitmap, backingWidth, backingHeight } =
    useFramedSourceCanvas(width, height, MAX_BACKING_EDGE, ghostVisible);

  if (!ghostVisible || !bitmap) return null;

  return (
    <canvas
      ref={canvasRef}
      width={backingWidth}
      height={backingHeight}
      className="absolute"
      aria-hidden="true"
      style={{
        width: width * pixelSize,
        height: height * pixelSize,
        transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
        transformOrigin: "50% 50%",
        opacity: ghostOpacity,
        pointerEvents: "none",
        imageRendering: "auto",
      }}
    />
  );
};

export default SourceOverlay;
