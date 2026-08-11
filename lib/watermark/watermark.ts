import { applyImageWatermark } from "./watermark-image";
import { applyPdfWatermark } from "./watermark-pdf";
import { isWatermarkSupported } from "./watermark-support";

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

// Re-exported for any existing server-side imports of
// `isWatermarkSupported` from this file — but prefer importing directly
// from ./watermark-support in any NEW client-component code, so nothing
// ever accidentally pulls sharp/pdf-lib into a client bundle again.
export { isWatermarkSupported };
