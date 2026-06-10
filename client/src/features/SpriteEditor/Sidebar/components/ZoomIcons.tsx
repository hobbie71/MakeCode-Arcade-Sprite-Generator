// Context imports
import { useZoom } from "../../contexts/ZoomContext/useZoom";

// Const imports
import { MAX_ZOOM, MIN_ZOOM, ZOOM_AMOUNT } from "../../constants/canvas";

// Component imports
import IconButton from "../../../../components/IconButton";
import Tooltip from "../../../../components/Tooltip";

// Hook imports
import { useKeyboardShortcut } from "../../../../hooks/useKeyboardShortcut";

// Type imports
import type { KeyboardShortcut } from "../../../../hooks/useKeyboardShortcut";

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

  const shortcut: KeyboardShortcut[] = [
    {
      key: "=",
      callback: handleZoomIn,
    },
    {
      key: "-",
      callback: handleZoomOut,
    },
  ];
  useKeyboardShortcut(shortcut);

  const isZoomOutDisabled = zoom <= MIN_ZOOM;
  const isZoomInDisabled = zoom >= MAX_ZOOM;

  return (
    <>
      <Tooltip text="Zoom out" hotkey="-">
        <IconButton
          onClick={handleZoomOut}
          aria-label="Zoom out"
          disabled={isZoomOutDisabled}>
          <i className={`ms-Icon ms-Icon--ZoomOut`} aria-hidden="true" />
        </IconButton>
      </Tooltip>

      <Tooltip text="Zoom in" hotkey="+">
        <IconButton
          onClick={handleZoomIn}
          aria-label="Zoom in"
          disabled={isZoomInDisabled}>
          <i className={`ms-Icon ms-Icon--ZoomIn`} aria-hidden="true" />
        </IconButton>
      </Tooltip>
    </>
  );
};

export default ZoomIcons;
