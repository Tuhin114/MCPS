import sharp from "sharp";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function applyImageWatermark(
  buffer: Buffer,
  watermarkText: string,
): Promise<Buffer> {
  const image = sharp(buffer);

  const metadata = await image.metadata();

  const width = metadata.width ?? 1200;
  const height = metadata.height ?? 800;

  const fontSize = Math.max(Math.min(width, height) / 18, 24);

  const safeText = escapeXml(watermarkText);

  let texts = "";

  for (let y = -200; y < height + 200; y += 220) {
    for (let x = -200; x < width + 200; x += 320) {
      texts += `
        <text
          x="${x}"
          y="${y}"
          fill="rgba(255,255,255,0.15)"
          font-size="${fontSize}"
          font-family="sans-serif"
          font-weight="700"
          text-anchor="middle"
          dominant-baseline="middle"
          transform="rotate(-30 ${x} ${y})"
        >
          ${safeText}
        </text>
      `;
    }
  }

  const svg = `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="${width}"
      height="${height}"
      viewBox="0 0 ${width} ${height}"
    >
      ${texts}
    </svg>
  `;

  return image
    .composite([
      {
        input: Buffer.from(svg),
        top: 0,
        left: 0,
      },
    ])
    .png()
    .toBuffer();
}
