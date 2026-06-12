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
  download_count?: number;
  watermark_text: string | null;
  encryption_algorithm: string | null;
  encrypted_key: string | null;
  iv: string | null;
  created_at: string;
}

export type Permission = "view" | "download";

export type MediaStatus = "all" | "protected" | "encrypted" | "public";

export interface MyMediaItem {
  id: string;
  file_name: string;
  file_type: string;
  mime_type: string;
  owner_id: string;
  size_bytes: number;
  is_encrypted: boolean;
  is_watermarked: boolean;
  watermark_text: string | null;
  created_at: string;
  shared_with: SharedWith[];
}

export interface SharedWith {
  share_id: string;
  media_id: string;
  owner_id: string;
  permission: Permission;
  created_at: string | null;
  expires_at: string | null;
  updated_at: string | null;
  shared_with: {
    id: string;
    username: string;
    email: string;
    avatar_url: string;
  };
}

export type LocalSharedUsers = {
  share_id?: string;
  shared_user_id: string;
  shared_user_name: string;
  shared_user_email: string;
  shared_user_avatar_url: string;
  permission: "view" | "download";
  expires_at?: string | null;
  isNew?: boolean;
  permissionChanged?: boolean;
  markedForRemoval?: boolean;
};

export interface MySharedUsers {
  id: string;
  username: string;
  email: string;
  avatar_url: string;
}
export interface AllUsers {
  id: string;
  username: string;
  email: string;
  avatar_url: string;
}

export interface SharedUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  permission: Permission;
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

export interface MediaResponse {
  media: Media;
}

export interface ViewMediaResponse {
  url: string;
}

export interface DeleteMediaResponse {
  message: string;
}

export interface UpdateMediaPayload {
  file_name?: string;
  is_encrypted?: boolean;
  is_watermarked?: boolean;
  watermark_text?: string | null;
}

export interface UpdateMediaResponse {
  media: import("./media").Media;
}

export interface ShareMediaPayload {
  shared_with: string;
  permission: Permission;
}

export interface ShareMediaResponse {
  share: SharedMediaRow;
}

export interface UpdateSharePermissionPayload {
  permission: "view" | "download";
  expires_at?: string | null;
}

export interface UpdateSharePermissionResponse {
  share: SharedMediaRow;
}

export type RemoveSharePayload = {
  mediaId: string;
  shareId: string;
};

export interface RemoveShareResponse {
  message: string;
}

export interface SharedMediaRow {
  id: string;
  media_id: string;
  owner_id: string;
  shared_with: string;
  permission: "view" | "download";
  expires_at: string | null;
  created_at: string;
  updated_at: string;
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
