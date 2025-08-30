// Context imports
import { useZoom } from "../../contexts/ZoomContext/useZoom";

const ZoomIcons = () => {
  const { setZoom } = useZoom();

  return (
    <>
      <button
        className="tool-button"
        onClick={() => setZoom((prevZoom) => prevZoom - 0.2)}
        aria-label="ZoomOut"
        type="button">
        <i className={`ms-Icon ms-Icon--ZoomOut`} aria-hidden="true" />
      </button>
      <button
        className="tool-button"
        onClick={() => setZoom((prevZoom) => prevZoom + 0.2)}
        aria-label="ZoomIn"
        type="button">
        <i className={`ms-Icon ms-Icon--ZoomIn`} aria-hidden="true" />
      </button>
    </>
  );
};

export default ZoomIcons;
