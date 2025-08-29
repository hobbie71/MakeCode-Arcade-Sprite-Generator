import React, { useRef, useState } from "react";

// Hooks
import { useImageFileHandler } from "@/features/InputSection/hooks/useImageFileHandler";

const ImageUploadForm = () => {
  // Hooks
  const { importImageManually } = useImageFileHandler();

  // States
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setError(null);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      importImageManually(file);
    } else {
      setError("Please upload a valid image file.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      importImageManually(file);
    } else {
      setError("Please upload a valid image file.");
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div
      className={`card card-body border-2 border-dashed transition-colors duration-200 cursor-pointer flex flex-col items-center justify-center text-center ${
        isDragging
          ? "border-blue-400 bg-blue-800"
          : "border-white bg-transparent"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      tabIndex={0}
      role="button"
      aria-label="Upload image">
      <svg
        className="w-10 h-10 mb-23 text-white"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M8 12l4-4m0 0l4 4m-4-4v12"
        />
      </svg>
      <div className="paragraph text-center text-white">
        <p className="">Drag and Drop an Image Here</p>
        <p className="">or</p>
        <p className="">Click to Browse Files</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleInputChange}
        tabIndex={-1}
      />
      {error && <p className="text-error mt-2">{error}</p>}
    </div>
  );
};

export default ImageUploadForm;
