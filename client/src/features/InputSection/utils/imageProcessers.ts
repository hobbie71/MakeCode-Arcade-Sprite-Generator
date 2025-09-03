export const createCanvasFromImage = (
  img: HTMLImageElement
): HTMLCanvasElement => {
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;

  const ctx = canvas.getContext("2d", {
    willReadFrequently: true,
    alpha: true,
  });

  if (!ctx) throw new Error("Failed to get CTX");

  ctx.globalCompositeOperation = "source-over";
  ctx.drawImage(img, 0, 0);

  return canvas;
};

export const fileToImageElement = (file: File): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Failed to load image"));
    reader.readAsDataURL(file);
  });
};
