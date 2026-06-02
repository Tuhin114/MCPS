export interface Media {
  id: string;
  owner_id: string;
  file_name: string;
  file_type: string;
  mime_type: string;
  storage_path: string;
  size_bytes: number;
  is_encrypted: boolean;
  is_watermarked: boolean;
  watermark_text: string | null;
  encryption_algorithm: string | null;
  encrypted_key: string | null;
  iv: string | null;
  created_at: string;
}

export interface UploadMediaPayload {
  file: File;
  encryption?: boolean;
  watermark?: boolean;
  watermarkText?: string;
}

export interface UploadMediaPayload {
  file: File;
}

export interface UploadMediaResponse {
  media: Media;
}

export interface MediaListResponse {
  media: Media[];
}

export interface MediaResponse {
  media: Media;
}

export interface ViewMediaResponse {
  url: string;
}

export interface ApiError {
  error: string;
}

export type FileType =
  | "image"
  | "pdf"
  | "document"
  | "text"
  | "zip"
  | "video"
  | "audio"
  | "unknown";
