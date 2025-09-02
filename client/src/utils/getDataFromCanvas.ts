import { rgbaToHsla, type HSLA, type RGBA } from "./colorConversion";

export const getImageDataFromCanvas = (
  canvas: HTMLCanvasElement
): ImageData => {
  const imageData = canvas
    .getContext("2d")
    ?.getImageData(0, 0, canvas.width, canvas.height);

  if (!imageData) throw new Error("Failed to get Image Data");
  return imageData;
};

export const getRgbaDataFromCanvas = (canvas: HTMLCanvasElement): RGBA[][] => {
  const imageData = getImageDataFromCanvas(canvas);

  const colorData = imageData.data;
  const rgbaData: RGBA[][] = Array.from({ length: canvas.height }, () => []);

  let row = 0;
  let col = 0;
  for (let i = 0; i < colorData.length; i += 4) {
    const r = colorData[i];
    const g = colorData[i + 1];
    const b = colorData[i + 2];
    const a = colorData[i + 3];

    const color: RGBA = { r, g, b, a };

    rgbaData[row].push(color);
    col++;
    if (col === canvas.width) {
      col = 0;
      row++;
      if (row >= canvas.height) break;
    }
  }

  return rgbaData;
};

export const getHslaDataFromCanvas = (canvas: HTMLCanvasElement): HSLA[][] => {
  const RgbaData = getRgbaDataFromCanvas(canvas);
  const HslaData: HSLA[][] = [];

  for (const row of RgbaData) {
    const hslaRow: HSLA[] = [];
    for (const rgba of row) {
      const { r, g, b, a } = rgba;
      hslaRow.push(rgbaToHsla(r, g, b, a));
    }
    HslaData.push(hslaRow);
  }

  return HslaData;
};
