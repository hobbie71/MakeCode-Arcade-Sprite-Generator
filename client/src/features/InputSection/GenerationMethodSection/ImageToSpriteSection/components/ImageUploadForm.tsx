import React, { useRef, useState, useId } from "react";

// Hooks
import { useImageFileHandler } from "../../../hooks/useImageFileHandler";
import { useLoading } from "../../../../../context/LoadingContext/useLoading";

const ImageUploadForm = () => {
  // Hooks
  const { importImageManually } = useImageFileHandler();
  const { isGenerating } = useLoading();

  // Generate unique IDs for accessibility
  const instructionsId = useId();
  const errorId = useId();
  const liveRegionId = useId();

  // States
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [liveMessage, setLiveMessage] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (isGenerating) return;
    if (!isDragging) {
      setIsDragging(true);
      setLiveMessage("Drop zone active. Release to upload image.");
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (isGenerating) return;
    setIsDragging(false);
    setLiveMessage("");
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (isGenerating) return;
    setIsDragging(false);
    setError(null);
    setLiveMessage("");

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      importImageManually(file);
      setLiveMessage(`Image ${file.name} uploaded successfully.`);
    } else {
      const errorMsg = "Please upload a valid image file.";
      setError(errorMsg);
      setLiveMessage(errorMsg);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isGenerating) return;
    setError(null);
    setLiveMessage("");
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      importImageManually(file);
      setLiveMessage(`Image ${file.name} uploaded successfully.`);
    } else {
      const errorMsg = "Please upload a valid image file.";
      setError(errorMsg);
      setLiveMessage(errorMsg);
    }
  };

  const handleClick = () => {
    if (isGenerating) return;
    inputRef.current?.click();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (isGenerating) return;
    // Handle Enter and Space keys for accessibility (similar to MUI Button)
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      inputRef.current?.click();
    }
  };

  // Build aria-describedby dynamically
  const ariaDescribedBy = [instructionsId, error ? errorId : null]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      {/* Live region for screen reader announcements */}
      <div
        id={liveRegionId}
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true">
        {liveMessage}
      </div>

      <div
        className={`card card-body border-2 border-dashed transition-colors duration-200 flex flex-col items-center justify-center text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
          isDragging
            ? "border-blue-400 bg-blue-800"
            : "border-white bg-transparent"
        } ${
          isGenerating
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={isGenerating ? -1 : 0}
        role="button"
        aria-label="Upload image file"
        aria-describedby={ariaDescribedBy}
        aria-invalid={error ? "true" : "false"}
        aria-disabled={isGenerating}>
        {/* Decorative icon - hidden from screen readers */}
        <svg
          className="w-10 h-10 mb-3 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
          aria-hidden="true"
          focusable="false">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M8 12l4-4m0 0l4 4m-4-4v12"
          />
        </svg>

        {/* Instructions - referenced by aria-describedby */}
        <div id={instructionsId} className="paragraph text-center text-white">
          <p>Drag and Drop an Image Here</p>
          <p>or</p>
          <p>Click to Browse Files</p>
        </div>

        {/* Hidden file input */}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleInputChange}
          tabIndex={-1}
          aria-hidden="true"
          id="image-upload-input"
        />
      </div>

      {/* Error message - referenced by aria-describedby when present */}
      {error && (
        <p
          id={errorId}
          className="text-error mt-2"
          role="alert"
          aria-live="assertive">
          {error}
        </p>
      )}
    </>
  );
};

export default ImageUploadForm;
