import { decryptFile, fileToBuffer } from "@/lib/encryption";
import { applyWatermark } from "@/lib/watermark/watermark";
import type { Media } from "@/types/media";

export class MediaServingError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function prepareMediaBuffer(
  media: Media,
  rawBlob: Blob,
): Promise<Buffer> {
  let fileBuffer: Buffer;

  if (media.is_encrypted) {
    if (!media.encrypted_key || !media.iv) {
      throw new MediaServingError("Encryption metadata missing", 500);
    }
    try {
      const encryptedBuffer = await fileToBuffer(rawBlob);
      fileBuffer = decryptFile(encryptedBuffer, media.encrypted_key, media.iv);
    } catch (err) {
      console.error("[prepareMediaBuffer] Decryption failed:", err);
      throw new MediaServingError("Failed to decrypt file", 500);
    }
  } else {
    fileBuffer = await fileToBuffer(rawBlob);
  }

  if (media.is_watermarked && media.watermark_text) {
    try {
      fileBuffer = await applyWatermark(
        fileBuffer,
        media.mime_type,
        media.watermark_text,
      );
    } catch (err) {
      // Don't fail the whole request if watermarking breaks on a malformed
      // file — better to serve the unwatermarked file than a 500.
      console.error("[prepareMediaBuffer] Watermarking failed:", err);
    }
  }

  return fileBuffer;
}
