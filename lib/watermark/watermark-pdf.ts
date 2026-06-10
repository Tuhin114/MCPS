import { PDFDocument, rgb, degrees, StandardFonts } from "pdf-lib";

export async function applyPdfWatermark(
  buffer: Buffer,
  watermarkText: string,
): Promise<Buffer> {
  const pdfDoc = await PDFDocument.load(buffer);

  const pages = pdfDoc.getPages();

  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  for (const page of pages) {
    const { width, height } = page.getSize();

    const fontSize = 40;

    for (let y = 100; y < height; y += 250) {
      for (let x = -100; x < width; x += 300) {
        page.drawText(watermarkText, {
          x,
          y,
          size: fontSize,
          font,
          rotate: degrees(45),
          opacity: 0.15,
          color: rgb(0.6, 0.6, 0.6),
        });
      }
    }
  }

  const bytes = await pdfDoc.save();

  return Buffer.from(bytes);
}
