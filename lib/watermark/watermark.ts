import { applyImageWatermark } from "./watermark-image";
import { applyPdfWatermark } from "./watermark-pdf";

export async function applyWatermark(
  buffer: Buffer,
  mimeType: string,
  watermarkText: string,
): Promise<Buffer> {
  if (mimeType.startsWith("image/")) {
    return applyImageWatermark(buffer, watermarkText);
  }

  if (mimeType === "application/pdf") {
    return applyPdfWatermark(buffer, watermarkText);
  }

  return buffer;
}
