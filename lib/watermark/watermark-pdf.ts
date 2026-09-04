import { PDFDocument, rgb, degrees, StandardFonts } from "pdf-lib";
import {
  WATERMARK_CONFIG,
  buildTileGrid,
  computeFontSize,
} from "./watermark-config";

/**
 * Renders `watermarkText` as a uniform, tiled overlay onto every page of a
 * PDF, using the same spacing/rotation/opacity formula as the image
 * watermarker (see watermark-config.ts) so the two look consistent instead
 * of being tuned independently.
 */
export async function applyPdfWatermark(
  buffer: Buffer,
  watermarkText: string,
): Promise<Buffer> {
  const pdfDoc = await PDFDocument.load(buffer);
  const pages = pdfDoc.getPages();
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  for (const page of pages) {
    const { width, height } = page.getSize();
    const fontSize = computeFontSize(width, height);
    const tiles = buildTileGrid(width, height);

    for (const { x, y } of tiles) {
      page.drawText(watermarkText, {
        x,
        y,
        size: fontSize,
        font,
        rotate: degrees(WATERMARK_CONFIG.rotationDegrees),
        opacity: WATERMARK_CONFIG.opacity,
        color: rgb(0.6, 0.6, 0.6),
      });
    }
  }

  const bytes = await pdfDoc.save();
  return Buffer.from(bytes);
}
