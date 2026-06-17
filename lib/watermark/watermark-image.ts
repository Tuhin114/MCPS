import sharp from "sharp";
import TextToSVG from "text-to-svg";
import path from "path";

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

  const fontSize = Math.max(Math.min(width, height) / 18, 24);

  const pathData = textToSVG.getD("MCPS TEST", {
    fontSize: 64,
  });

  console.log(pathData);

  let paths = "";

  for (let y = -200; y < height + 200; y += 220) {
    for (let x = -200; x < width + 200; x += 320) {
      const svgPath = textToSVG.getD(watermarkText, {
        fontSize,
      });

      paths += `
        <g
          transform="translate(${x}, ${y}) rotate(-30)"
          opacity="0.15"
        >
          <path
            d="${svgPath}"
            fill="white"
          />
        </g>
      `;
    }
  }

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
