import sharp from "sharp";

export async function applyImageWatermark(
  buffer: Buffer,
  watermarkText: string,
): Promise<Buffer> {
  const image = sharp(buffer);

  const metadata = await image.metadata();

  const width = metadata.width ?? 1200;
  const height = metadata.height ?? 800;

  const fontSize = Math.max(Math.min(width, height) / 18, 24);

  let texts = "";

  for (let y = -200; y < height + 200; y += 220) {
    for (let x = -200; x < width + 200; x += 320) {
      texts += `
        <text
          x="${x}"
          y="${y}"
          fill="rgba(255,255,255,0.15)"
          font-size="${fontSize}"
          font-family="Arial"
          font-weight="bold"
          transform="rotate(-30 ${x} ${y})"
        >
          ${watermarkText}
        </text>
      `;
    }
  }

  const svg = `
    <svg width="${width}" height="${height}">
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
    .toBuffer();
}
