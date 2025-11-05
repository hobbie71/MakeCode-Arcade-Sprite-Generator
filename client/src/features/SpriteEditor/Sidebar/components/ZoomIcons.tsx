import { useState, useId, useRef } from "react";

// Context imports
import { useZoom } from "../../contexts/ZoomContext/useZoom";

// Const imports
import { MAX_ZOOM, MIN_ZOOM, ZOOM_AMOUNT } from "../../constants/canvas";

const ZoomIcons = () => {
  const { setZoom, zoom } = useZoom();
  const [showZoomInTooltip, setShowZoomInTooltip] = useState(false);
  const [showZoomOutTooltip, setShowZoomOutTooltip] = useState(false);
  const zoomInTooltipId = useId();
  const zoomOutTooltipId = useId();
  const zoomInButtonId = useId();
  const zoomOutButtonId = useId();
  const zoomInTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const zoomOutTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const handleZoomOutMouseEnter = () => {
    if (zoomOutTimeoutRef.current) {
      clearTimeout(zoomOutTimeoutRef.current);
    }
    zoomOutTimeoutRef.current = setTimeout(() => {
      setShowZoomOutTooltip(true);
    }, 500);
  };

  const handleZoomOutMouseLeave = () => {
    if (zoomOutTimeoutRef.current) {
      clearTimeout(zoomOutTimeoutRef.current);
    }
    setShowZoomOutTooltip(false);
  };

  const handleZoomInMouseEnter = () => {
    if (zoomInTimeoutRef.current) {
      clearTimeout(zoomInTimeoutRef.current);
    }
    zoomInTimeoutRef.current = setTimeout(() => {
      setShowZoomInTooltip(true);
    }, 500);
  };

  const handleZoomInMouseLeave = () => {
    if (zoomInTimeoutRef.current) {
      clearTimeout(zoomInTimeoutRef.current);
    }
    setShowZoomInTooltip(false);
  };

  const isZoomOutDisabled = zoom <= MIN_ZOOM;
  const isZoomInDisabled = zoom >= MAX_ZOOM;

  return (
    <>
      <div className="relative inline-block">
        <button
          id={zoomOutButtonId}
          className="tool-button"
          onClick={handleZoomOut}
          onKeyDown={handleZoomOutKeyDown}
          onMouseEnter={handleZoomOutMouseEnter}
          onMouseLeave={handleZoomOutMouseLeave}
          aria-label="Zoom out"
          aria-describedby={showZoomOutTooltip ? zoomOutTooltipId : undefined}
          disabled={isZoomOutDisabled}
          role="button"
          type="button"
          tabIndex={0}>
          <i className={`ms-Icon ms-Icon--ZoomOut`} aria-hidden="true" />
        </button>

        {/* Tooltip */}
        {showZoomOutTooltip && (
          <div
            id={zoomOutTooltipId}
            role="tooltip"
            className="absolute top-full translate-x-8 mt-1 z-50
                       px-1.5 py-0.5 text-[10px] font-normal text-text-default-300 bg-default-200 
                       shadow-default-lg rounded pointer-events-none whitespace-nowrap"
            aria-hidden="false">
            <span>Zoom out</span>
          </div>
        )}
      </div>

      <div className="relative inline-block">
        <button
          id={zoomInButtonId}
          className="tool-button"
          onClick={handleZoomIn}
          onKeyDown={handleZoomInKeyDown}
          onMouseEnter={handleZoomInMouseEnter}
          onMouseLeave={handleZoomInMouseLeave}
          aria-label="Zoom in"
          aria-describedby={showZoomInTooltip ? zoomInTooltipId : undefined}
          disabled={isZoomInDisabled}
          role="button"
          type="button"
          tabIndex={0}>
          <i className={`ms-Icon ms-Icon--ZoomIn`} aria-hidden="true" />
        </button>

        {/* Tooltip */}
        {showZoomInTooltip && (
          <div
            id={zoomInTooltipId}
            role="tooltip"
            className="absolute top-full translate-x-8 mt-1 z-50
                       px-1.5 py-0.5 text-[10px] font-normal text-text-default-300 bg-default-200 
                       shadow-default-lg rounded pointer-events-none whitespace-nowrap"
            aria-hidden="false">
            <span>Zoom in</span>
          </div>
        )}
      </div>
    </>
  );
};

export default ZoomIcons;
