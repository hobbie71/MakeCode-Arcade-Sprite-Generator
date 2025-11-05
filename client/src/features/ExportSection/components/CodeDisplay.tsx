import { useEffect, useRef, useState } from "react";

import Prism from "prismjs";
import "prismjs/components/prism-python";
import "prismjs/themes/prism.css";

interface Props {
  children: string;
  codingLanguage?: "javascript" | "python";
}

const CodeDisplay = ({ children, codingLanguage = "javascript" }: Props) => {
  const codeRef = useRef<HTMLElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [children, codingLanguage]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 1000); // Hide animation after 1 second
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    // Allow Enter or Space to trigger copy action
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleCopy();
    }
  };

  return (
    <div className="relative">
      <pre
        className="card-body text-start rounded-lg bg-text-default-300 text-default-200 max-h-60 overflow-auto cursor-pointer hover:bg-neutral-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-info-500 focus:ring-offset-2"
        onClick={handleCopy}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        role="button"
        tabIndex={0}
        aria-label={`Copy ${codingLanguage} code to clipboard`}
        aria-live="polite"
        aria-atomic="true">
        <code ref={codeRef} className={`language-${codingLanguage}`}>
          {children}
        </code>
      </pre>

      {/* Tooltip */}
      {showTooltip && !copied && (
        <div
          className="absolute-center bg-info-500 text-text-default-300 text-sm px-3 py-2 rounded-lg shadow-lg pointer-events-none"
          role="tooltip"
          aria-hidden="true">
          Click to copy
        </div>
      )}

      {/* Copy confirmation animation */}
      {copied && (
        <div
          className="absolute-center bg-success-500 text-text-default-300 text-sm px-3 py-2 rounded-lg shadow-lg animate-pulse"
          role="status"
          aria-live="assertive">
          Copied!
        </div>
      )}

      {/* Screen reader only announcement */}
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true">
        {copied && "Code copied to clipboard successfully"}
      </div>
    </div>
  );
};

export default CodeDisplay;
