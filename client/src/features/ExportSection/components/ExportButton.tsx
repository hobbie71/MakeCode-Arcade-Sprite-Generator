import { ImageExportFormats } from "@/types/export";

interface Props {
  format: ImageExportFormats;
  onClick: () => void;
}

const ExportButton = ({ format, onClick }: Props) => {
  return (
    <button
      className="text-white px-4 py-2 rounded mr-4 shadow hover:opacity-80 transition-opacity"
      onClick={onClick}
      style={{
        backgroundColor: "#058b9b",
        boxShadow: "2px 2px 0px #087984",
        border: "none",
        outline: "none",
        appearance: "none",
      }}>
      Download as {format.toUpperCase()}
    </button>
  );
};

export default ExportButton;
