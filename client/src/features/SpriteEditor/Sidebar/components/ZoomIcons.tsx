// Context imports
import { useZoom } from "../../contexts/ZoomContext/useZoom";

// Const imports
import { MAX_ZOOM, MIN_ZOOM, ZOOM_AMOUNT } from "../../constants/canvas";

const ZoomIcons = () => {
  const { setZoom } = useZoom();

  const handleZoomIn = () => {
    setZoom((prevZoom) => {
      let newZoom = prevZoom + ZOOM_AMOUNT;
      if (newZoom > MAX_ZOOM) newZoom = MAX_ZOOM;
      return newZoom;
    });
  };

  const handleZoomOut = () => {
    setZoom((prevZoom) => {
      let newZoom = prevZoom - ZOOM_AMOUNT;
      if (newZoom < MIN_ZOOM) newZoom = MIN_ZOOM;
      return newZoom;
    });
  };

  return (
    <>
      <button
        className="tool-button"
        onClick={() => handleZoomOut()}
        aria-label="ZoomOut"
        type="button">
        <i className={`ms-Icon ms-Icon--ZoomOut`} aria-hidden="true" />
      </button>
      <button
        className="tool-button"
        onClick={() => handleZoomIn()}
        aria-label="ZoomIn"
        type="button">
        <i className={`ms-Icon ms-Icon--ZoomIn`} aria-hidden="true" />
      </button>
    </>
  );
};

export default ZoomIcons;
