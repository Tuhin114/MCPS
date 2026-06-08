import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// This check can be removed, it is just for tutorial purposes
export const hasEnvVars =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// import type { MediaListResponse } from "@/types/media";
// import type { MediaItem, SharedUser } from "@/lib/mcps-data";

// function deriveStatus(
//   is_encrypted: boolean,
//   is_watermarked: boolean,
// ): "fully-protected" | "encrypted" | "public" {
//   if (is_encrypted && is_watermarked) return "fully-protected";
//   if (is_encrypted) return "encrypted";
//   return "public";
// }

export function deriveFileType(
  file_type: string | null,
  mime_type: string | null,
): "image" | "video" | "audio" | "document" | "pdf" | "presentation" {
  const mime = mime_type ?? "";
  const type = file_type ?? "";

  if (type === "image" || mime.startsWith("image/")) return "image";
  if (type === "video" || mime.startsWith("video/")) return "video";
  if (type === "audio" || mime.startsWith("audio/")) return "audio";
  if (mime === "application/pdf") return "pdf";
  if (mime.includes("presentationml") || mime.includes("powerpoint"))
    return "presentation";
  return "document";
}

// export function transformMediaList(data: MediaListResponse[]): MediaItem[] {
//   return data.map(({ media, shared_with }) => ({
//     id: media.id,
//     name: media.file_name,
//     fileType: deriveFileType(media.file_type, media.mime_type),
//     size: media.size_bytes,
//     status: deriveStatus(media.is_encrypted, media.is_watermarked),
//     uploadedDate: new Date(media.created_at),
//     lastModified: new Date(media.created_at),
//     encrypted: media.is_encrypted,
//     watermarked: media.is_watermarked,
//     watermarkText: media.watermark_text ?? "",
//     description: media.file_name,
//     sharedWith: shared_with.map(
//       (s): SharedUser => ({
//         id: s.id,
//         name: s.shared_with.username,
//         email: s.shared_with.email,
//         avatar: s.shared_with.avatar_url,
//         permission: s.permission,
//       }),
//     ),
//   }));
// }
