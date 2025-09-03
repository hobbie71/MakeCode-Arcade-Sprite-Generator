import { ImageExportFormats } from "../../../types/export";

interface Props {
  format: ImageExportFormats;
  onClick: () => void;
}

const ExportButton = ({ format, onClick }: Props) => {
  return (
    <button className="btn-primary" onClick={onClick}>
      Download as {format.toUpperCase()}
    </button>
  );
};

export default ExportButton;
