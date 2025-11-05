// Context imports
import { useZoom } from "../../contexts/ZoomContext/useZoom";

// Const imports
import { MAX_ZOOM, MIN_ZOOM, ZOOM_AMOUNT } from "../../constants/canvas";

// Component imports
import Tooltip from "../../../../components/Tooltip";

const ZoomIcons = () => {
  const { setZoom, zoom } = useZoom();

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

  const handleZoomInKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        handleZoomIn();
        break;
      default:
        break;
    }
  };

  const handleZoomOutKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        handleZoomOut();
        break;
      default:
        break;
    }
  };

  const isZoomOutDisabled = zoom <= MIN_ZOOM;
  const isZoomInDisabled = zoom >= MAX_ZOOM;

  return (
    <>
      <Tooltip text="Zoom out">
        <button
          className="tool-button"
          onClick={handleZoomOut}
          onKeyDown={handleZoomOutKeyDown}
          aria-label="Zoom out"
          disabled={isZoomOutDisabled}
          role="button"
          type="button"
          tabIndex={0}>
          <i className={`ms-Icon ms-Icon--ZoomOut`} aria-hidden="true" />
        </button>
      </Tooltip>

      <Tooltip text="Zoom in">
        <button
          className="tool-button"
          onClick={handleZoomIn}
          onKeyDown={handleZoomInKeyDown}
          aria-label="Zoom in"
          disabled={isZoomInDisabled}
          role="button"
          type="button"
          tabIndex={0}>
          <i className={`ms-Icon ms-Icon--ZoomIn`} aria-hidden="true" />
        </button>
      </Tooltip>
    </>
  );
};

export default ZoomIcons;
