export function isWatermarkSupported(mimeType: string): boolean {
  return mimeType.startsWith("image/") || mimeType === "application/pdf";
}
