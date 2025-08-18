import { useEffect, useRef, useState } from "react";

import Prism from "prismjs";
import "prismjs/themes/prism.css";
import "prismjs/components/prism-python";

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
        className="whitespace-pre-wrap break-all p-4 border border-gray-200 rounded max-h-60 overflow-auto cursor-pointer hover:bg-gray-50 transition-colors duration-200"
        style={{ backgroundColor: "#f6f6f6" }}
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
        <div className="absolute top-2 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg pointer-events-none">
          Click to copy
        </div>
      )}

      {/* Copy confirmation animation */}
      {copied && (
        <div
          className="absolute top-2 right-2 text-white text-xs px-2 py-1 rounded shadow-lg animate-pulse"
          style={{ backgroundColor: "#058b9b" }}>
          Copied!
        </div>
      )}
    </div>
  );
};

export default CodeDisplay;
