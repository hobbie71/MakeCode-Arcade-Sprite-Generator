import { ImageExportFormats } from "../../../types/export";
import Button from "../../../components/Button";

interface Props {
  format: ImageExportFormats;
  onClick: () => void;
}

const ExportButton = ({ format, onClick }: Props) => {
  return (
    <Button variant="primary" onClick={onClick}>
      Download as {format.toUpperCase()}
    </Button>
  );
};

export default ExportButton;
