export const WATERMARK_CONFIG = {
  /** Rotation applied to every tile, in degrees. */
  rotationDegrees: -30,
  /** Opacity of the watermark text, 0–1. */
  opacity: 0.15,
  /** Horizontal gap between tile centers, as a fraction of page/image width. */
  columnGapRatio: 0.32,
  /** Vertical gap between tile centers, as a fraction of page/image height. */
  rowGapRatio: 0.22,
  /** Font size as a fraction of min(width, height), clamped between min/max. */
  fontSizeRatio: 1 / 18,
  fontSizeMin: 18,
  fontSizeMax: 48,
} as const;

/** Clamp a computed font size into a sane readable range. */
export function computeFontSize(width: number, height: number): number {
  const raw = Math.min(width, height) * WATERMARK_CONFIG.fontSizeRatio;
  return Math.max(
    WATERMARK_CONFIG.fontSizeMin,
    Math.min(raw, WATERMARK_CONFIG.fontSizeMax),
  );
}

/**
 * Build a uniform grid of (x, y) tile centers covering the page/image,
 * including some overflow past the edges so rotated text still covers
 * corners fully.
 */
export function buildTileGrid(width: number, height: number) {
  const colGap = Math.max(width * WATERMARK_CONFIG.columnGapRatio, 80);
  const rowGap = Math.max(height * WATERMARK_CONFIG.rowGapRatio, 80);

  const overflowX = colGap;
  const overflowY = rowGap;

  const points: { x: number; y: number }[] = [];

  for (let y = -overflowY; y < height + overflowY; y += rowGap) {
    // Stagger alternate rows by half a column-gap so tiles don't line up
    // into obvious vertical streaks.
    const rowIndex = Math.round((y + overflowY) / rowGap);
    const xOffset = rowIndex % 2 === 0 ? 0 : colGap / 2;

    for (let x = -overflowX + xOffset; x < width + overflowX; x += colGap) {
      points.push({ x, y });
    }
  }

  return points;
}
