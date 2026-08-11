import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // bytes — recommended nonce size for GCM
const AUTH_TAG_LENGTH = 16; // bytes
const LEGACY_ALGORITHM = "aes-256-cbc";

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
 * Encrypt a DEK with the master key (AES-256-GCM).
 * Returns a hex string: <iv_hex>:<auth_tag_hex>:<encrypted_dek_hex>
 */
export function encryptDEK(dek: Buffer): string {
  const masterKey = getMasterKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, masterKey, iv);
  const encrypted = Buffer.concat([cipher.update(dek), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted.toString("hex")}`;
}

/**
 * Decrypt an encrypted DEK string (produced by encryptDEK) using the master key.
 * Transparently supports both the current GCM format
 * ("<iv>:<authTag>:<data>") and the legacy CBC format ("<iv>:<data>") for
 * DEKs that were wrapped before this file was upgraded.
 */
export function decryptDEK(encryptedDEK: string): Buffer {
  const masterKey = getMasterKey();
  const parts = encryptedDEK.split(":");

  if (parts.length === 3) {
    // Current format: GCM
    const [ivHex, authTagHex, encHex] = parts;
    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");
    const encryptedData = Buffer.from(encHex, "hex");
    const decipher = crypto.createDecipheriv(ALGORITHM, masterKey, iv);
    decipher.setAuthTag(authTag);
    return Buffer.concat([decipher.update(encryptedData), decipher.final()]);
  }

  if (parts.length === 2) {
    // Legacy format: CBC, no auth tag — kept for backward compatibility only.
    const [ivHex, encHex] = parts;
    const iv = Buffer.from(ivHex, "hex");
    const encryptedData = Buffer.from(encHex, "hex");
    const decipher = crypto.createDecipheriv(LEGACY_ALGORITHM, masterKey, iv);
    return Buffer.concat([decipher.update(encryptedData), decipher.final()]);
  }

  throw new Error(
    "Invalid encrypted_key format — expected <iv>:<authTag>:<data> or legacy <iv>:<data>.",
  );
}

//  File encryption / decryption

export interface EncryptFileResult {
  /** Encrypted file contents ready for upload. */
  encryptedBuffer: Buffer;
  /** Hex-encoded "<iv>:<authTag>" — store in the `iv` column as-is. */
  iv: string;
  /** Master-key-protected DEK — store in `encrypted_key` column. */
  encryptedKey: string;
}

/**
 * Encrypt an in-memory file buffer with AES-256-GCM.
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
  const authTag = cipher.getAuthTag();
  const encryptedKey = encryptDEK(dek);
  return {
    encryptedBuffer,
    iv: `${iv.toString("hex")}:${authTag.toString("hex")}`,
    encryptedKey,
  };
}

/**
 * Decrypt a file buffer using the stored encrypted_key and iv.
 *
 * Backward compatible: if `ivHex` contains no ":" it's treated as a legacy
 * plain-hex CBC IV (files encrypted before this upgrade). New files always
 * store "<iv>:<authTag>" and are decrypted with GCM + tag verification.
 */
export function decryptFile(
  encryptedBuffer: Buffer,
  encryptedKey: string,
  ivField: string,
): Buffer {
  const dek = decryptDEK(encryptedKey);

  if (ivField.includes(":")) {
    // Current format: GCM
    const [ivHex, authTagHex] = ivField.split(":");
    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");
    if (authTag.length !== AUTH_TAG_LENGTH) {
      throw new Error("Invalid auth tag length — file may be corrupted.");
    }
    const decipher = crypto.createDecipheriv(ALGORITHM, dek, iv);
    decipher.setAuthTag(authTag);
    // Throws if the ciphertext or tag was tampered with — this is the
    // integrity check CBC never had.
    return Buffer.concat([decipher.update(encryptedBuffer), decipher.final()]);
  }

  // Legacy format: CBC, no auth tag
  const iv = Buffer.from(ivField, "hex");
  const decipher = crypto.createDecipheriv(LEGACY_ALGORITHM, dek, iv);
  return Buffer.concat([decipher.update(encryptedBuffer), decipher.final()]);
}

/**
 * Convert a Web API File / Blob to a Node Buffer (works in Next.js API routes).
 */
export async function fileToBuffer(file: File | Blob): Promise<Buffer> {
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
