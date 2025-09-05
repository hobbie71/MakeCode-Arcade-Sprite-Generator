// Context imports
import { useZoom } from "../../contexts/ZoomContext/useZoom";

const ZoomIcons = () => {
  const { setZoom } = useZoom();

  const handleZoomIn = () => {
    setZoom((prevZoom) => {
      let newZoom = prevZoom + 0.2;
      if (newZoom > 3) newZoom = 3;
      return newZoom;
    });
  };

  const handleZoomOut = () => {
    setZoom((prevZoom) => {
      let newZoom = prevZoom - 0.2;
      if (newZoom <= 0) newZoom = 0.2;
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
