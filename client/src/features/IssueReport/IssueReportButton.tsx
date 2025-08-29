import React from "react";

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
    <button
      onClick={handleReportIssue}
      className={`btn-primary fixed bottom-4 right-4 z-40 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 p-3 rounded-full transition-all duration-200 transform hover:scale-105 hover:shadow-xl active:scale-95 group ${highlightClasses}`}
      title="Report an Issue"
      aria-label="Report an issue or request a feature">
      <svg
        className="w-6 h-6 group-hover:rotate-12 transition-transform duration-200 mr-2"
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
      Report an Issue Here!
      <svg
        className="w-6 h-6 group-hover:rotate-12 transition-transform duration-200 ml-2"
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
    </button>
  );
};

export default IssueReportButton;
