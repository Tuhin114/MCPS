import sharp from "sharp";
import TextToSVG from "text-to-svg";
import path from "path";
import {
  WATERMARK_CONFIG,
  buildTileGrid,
  computeFontSize,
} from "./watermark-config";

/**
 * Renders `watermarkText` as a uniform, tiled overlay onto an image.
 *
 * Tile spacing and font size scale with the image's own dimensions (see
 * watermark-config.ts), so density looks the same on a 400px thumbnail and
 * a 6000px photo — the old version used a fixed pixel step that bunched up
 * or spread out depending on image size.
 */
export async function applyImageWatermark(
  buffer: Buffer,
  watermarkText: string,
): Promise<Buffer> {
  const image = sharp(buffer);
  const metadata = await image.metadata();

  const width = metadata.width ?? 1200;
  const height = metadata.height ?? 800;

  const textToSVG = TextToSVG.loadSync(
    path.join(process.cwd(), "public", "fonts", "Inter_18pt-Bold.ttf"),
  );

  const fontSize = computeFontSize(width, height);
  const tiles = buildTileGrid(width, height);

  const svgPath = textToSVG.getD(watermarkText, { fontSize });

  const paths = tiles
    .map(
      ({ x, y }) => `
        <g
          transform="translate(${x.toFixed(1)}, ${y.toFixed(1)}) rotate(${WATERMARK_CONFIG.rotationDegrees})"
          opacity="${WATERMARK_CONFIG.opacity}"
        >
          <path d="${svgPath}" fill="white" />
        </g>
      `,
    )
    .join("");

  const svg = `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="${width}"
      height="${height}"
    >
      ${paths}
    </svg>
  `;

  return image
    .composite([
      {
        input: Buffer.from(svg),
      },
    ])
    .toBuffer();
}
