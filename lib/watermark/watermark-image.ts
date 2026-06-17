import sharp from "sharp";
import { createCanvas } from "@napi-rs/canvas";

export async function applyImageWatermark(
  buffer: Buffer,
  watermarkText: string,
): Promise<Buffer> {
  const image = sharp(buffer);
  const metadata = await image.metadata();

  const width = metadata.width ?? 1200;
  const height = metadata.height ?? 800;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  const fontSize = Math.max(Math.min(width, height) / 18, 24);

  ctx.font = `bold ${fontSize}px sans-serif`;
  ctx.fillStyle = "rgba(255,255,255,0.15)";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (let y = -200; y < height + 200; y += 220) {
    for (let x = -200; x < width + 200; x += 320) {
      ctx.save();

      ctx.translate(x, y);
      ctx.rotate((-30 * Math.PI) / 180);

      ctx.fillText(watermarkText, 0, 0);

      ctx.restore();
    }
  }

  const overlayBuffer = await canvas.encode("png");

  return image
    .composite([
      {
        input: overlayBuffer,
        top: 0,
        left: 0,
      },
    ])
    .toBuffer();
}
