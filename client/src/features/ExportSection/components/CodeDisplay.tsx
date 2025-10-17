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

  return (
    <div className="relative">
      <pre
        className="card-body rounded-3xl bg-default-light-300 max-h-60 overflow-auto cursor-pointer hover:bg-neutral-300 transition-colors duration-200"
        onClick={handleCopy}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        title="Click to copy">
        <code ref={codeRef} className={`language-${codingLanguage}`}>
          {children}
        </code>
      </pre>

      {/* Tooltip */}
      {showTooltip && !copied && (
        <div className="absolute-center bg-info-500 text-text-default-300 text-sm px-3 py-2 rounded-3xl shadow-lg pointer-events-none">
          Click to copy
        </div>
      )}

      {/* Copy confirmation animation */}
      {copied && (
        <div className="absolute-center bg-success-500 text-text-default-300 text-sm px-3 py-2 rounded-3xl shadow-lg animate-pulse">
          Copied!
        </div>
      )}
    </div>
  );
};

export default CodeDisplay;
