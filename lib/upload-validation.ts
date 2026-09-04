export const MAX_UPLOAD_BYTES = 20 * 1024 * 1024; // 20 MB — adjust to taste

export const ALLOWED_MIME_PREFIXES = ["image/", "video/", "audio/"];

export const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "text/plain",
  "text/csv",
]);

export interface UploadValidationResult {
  valid: boolean;
  error?: string;
}

export function validateUpload(file: File): UploadValidationResult {
  if (!file || file.size === 0) {
    return { valid: false, error: "File is empty" };
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    const maxMb = Math.round(MAX_UPLOAD_BYTES / 1024 / 1024);
    return {
      valid: false,
      error: `File is too large. Maximum allowed size is ${maxMb} MB.`,
    };
  }

  const mime = file.type || "";
  const allowedByPrefix = ALLOWED_MIME_PREFIXES.some((p) => mime.startsWith(p));
  const allowedExact = ALLOWED_MIME_TYPES.has(mime);

  if (!allowedByPrefix && !allowedExact) {
    return {
      valid: false,
      error: `File type "${mime || "unknown"}" is not supported.`,
    };
  }

  return { valid: true };
}
