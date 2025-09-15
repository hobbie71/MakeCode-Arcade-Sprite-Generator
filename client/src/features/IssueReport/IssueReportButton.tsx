import Button from "../../components/Button";

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
      <svg
        className="w-6 h-6 group-hover:rotate-12 transition-transform duration-200 sm:mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
        />
      </svg>
      <span className="hidden sm:inline">Report an Issue Here!</span>
      <svg
        className="hidden sm:inline w-6 h-6 group-hover:rotate-12 transition-transform duration-200 ml-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
        />
      </svg>
    </Button>
  );
};

export default IssueReportButton;
