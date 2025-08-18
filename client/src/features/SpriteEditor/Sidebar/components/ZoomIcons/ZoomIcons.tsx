// Context imports
import { useZoom } from "@/features/SpriteEditor/contexts/ZoomContext/useZoom";

const ZoomIcons = () => {
  const { setZoom } = useZoom();

  return (
    <>
      <button
        className="tool-icon w-7 h-7 flex items-center justify-center"
        onClick={() => setZoom((prevZoom) => prevZoom - 0.2)}
        aria-label="ZoomOut"
        type="button">
        <i className={`ms-Icon ms-Icon--ZoomOut`} aria-hidden="true" />
      </button>
      <button
        className="tool-icon w-7 h-7 flex items-center justify-center"
        onClick={() => setZoom((prevZoom) => prevZoom + 0.2)}
        aria-label="ZoomIn"
        type="button">
        <i className={`ms-Icon ms-Icon--ZoomIn`} aria-hidden="true" />
      </button>
    </>
  );
};

export default ZoomIcons;
