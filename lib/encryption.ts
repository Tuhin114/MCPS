/**
 * AES-256-CBC file encryption / decryption helpers (Node.js crypto — server-side only).
 *
 * Key hierarchy
 * ─────────────
 * 1. A random 256-bit DEK (Data Encryption Key) is generated per file.
 * 2. The DEK is encrypted with the MASTER_ENCRYPTION_KEY from .env using
 *    AES-256-CBC so it can be stored safely in the `encrypted_key` column.
 * 3. The file itself is encrypted with the DEK + a random 128-bit IV stored
 *    in the `iv` column (hex-encoded).
 *
 * .env requirement
 * ────────────────
 *   MASTER_ENCRYPTION_KEY=<64 hex chars = 32 bytes>
 *
 * Generate one with:
 *   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
 */

import crypto from "crypto";

const ALGORITHM = "aes-256-cbc";
const IV_LENGTH = 16; // bytes — AES block size

// Master key

function getMasterKey(): Buffer {
  const hex = process.env.MASTER_ENCRYPTION_KEY;
  if (!hex || hex.length !== 64) {
    throw new Error(
      "MASTER_ENCRYPTION_KEY must be set in .env as 64 hex characters (32 bytes).",
    );
  }
  return Buffer.from(hex, "hex");
}

//  DEK helpers

/** Generate a fresh random 256-bit DEK. */
export function generateDEK(): Buffer {
  return crypto.randomBytes(32);
}

/**
 * Encrypt a DEK with the master key.
 * Returns a hex string: <iv_hex>:<encrypted_dek_hex>
 */
export function encryptDEK(dek: Buffer): string {
  const masterKey = getMasterKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, masterKey, iv);
  const encrypted = Buffer.concat([cipher.update(dek), cipher.final()]);
  return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
}

/**
 * Decrypt an encrypted DEK string (produced by encryptDEK) using the master key.
 * Returns the raw DEK Buffer.
 */
export function decryptDEK(encryptedDEK: string): Buffer {
  const masterKey = getMasterKey();
  const [ivHex, encHex] = encryptedDEK.split(":");
  if (!ivHex || !encHex) {
    throw new Error("Invalid encrypted_key format — expected <iv>:<data>.");
  }
  const iv = Buffer.from(ivHex, "hex");
  const encryptedData = Buffer.from(encHex, "hex");
  const decipher = crypto.createDecipheriv(ALGORITHM, masterKey, iv);
  return Buffer.concat([decipher.update(encryptedData), decipher.final()]);
}

//  File encryption / decryption

export interface EncryptFileResult {
  /** Encrypted file contents ready for upload. */
  encryptedBuffer: Buffer;
  /** Hex-encoded IV used for file encryption. */
  iv: string;
  /** Master-key-protected DEK — store in `encrypted_key` column. */
  encryptedKey: string;
}

/**
 * Encrypt an in-memory file buffer.
 * A fresh DEK + IV are generated on every call.
 */
export function encryptFile(fileBuffer: Buffer): EncryptFileResult {
  const dek = generateDEK();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, dek, iv);
  const encryptedBuffer = Buffer.concat([
    cipher.update(fileBuffer),
    cipher.final(),
  ]);
  const encryptedKey = encryptDEK(dek);
  return {
    encryptedBuffer,
    iv: iv.toString("hex"),
    encryptedKey,
  };
}

/**
 * Decrypt a file buffer using the stored encrypted_key and iv.
 * Both are hex strings as stored in the media table.
 */
export function decryptFile(
  encryptedBuffer: Buffer,
  encryptedKey: string,
  ivHex: string,
): Buffer {
  const dek = decryptDEK(encryptedKey);
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv(ALGORITHM, dek, iv);
  return Buffer.concat([decipher.update(encryptedBuffer), decipher.final()]);
}

/**
 * Convert a Web API File / Blob to a Node Buffer (works in Next.js API routes).
 */
export async function fileToBuffer(file: File | Blob): Promise<Buffer> {
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
