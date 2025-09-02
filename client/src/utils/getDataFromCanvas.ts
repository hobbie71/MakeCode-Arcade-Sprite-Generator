export const getImageDataFromCanvas = (canvas: HTMLCanvasElement) => {
  const imageData = canvas
    .getContext("2d")
    ?.getImageData(0, 0, canvas.width, canvas.height);

  if (!imageData) throw new Error("Failed to get Image Data");
  return imageData;
};
