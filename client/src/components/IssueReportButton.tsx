import Button from "./Button";
import ErrorSymbol from "./ErrorSymbol";

interface IssueReportButtonProps {
  highlight?: boolean;
}

const IssueReportButton: React.FC<IssueReportButtonProps> = ({
  highlight = false,
}) => {
  const handleReportIssue = () => {
    const googleFormUrl = "https://forms.gle/RMooZuywkBVUQwtw8";
    window.open(googleFormUrl, "_blank", "noopener,noreferrer");
  };

  const highlightClasses = highlight
    ? "ring-4 ring-yellow-400 ring-opacity-75 animate-bounce"
    : "";

  return (
    <Button
      variant="danger"
      onClick={handleReportIssue}
      className={`fixed bottom-4 left-4 sm:right-4 sm:left-auto z-40 ${highlightClasses}`}
      title="Report an Issue"
      aria-label="Report an issue or request a feature">
      <ErrorSymbol className="sm:mr-2" />
      <span className="hidden sm:inline">Report Bug / Request Feature</span>
      <ErrorSymbol className="ml-2 hidden sm:block" />
    </Button>
  );
};

export default IssueReportButton;
