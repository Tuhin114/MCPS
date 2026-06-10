import { encryptFile, fileToBuffer } from "@/lib/encryption";
import { getFileType } from "@/lib/helper";
import { applyWatermark } from "@/lib/watermark/watermark";
import {
  AllUsers,
  Media,
  MyMediaItem,
  MySharedUsers,
  UploadMediaPayload,
} from "@/types/media";
import { SupabaseClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";

const BUCKET = "protected-media";

export async function uploadMedia(
  supabase: SupabaseClient,
  userId: string,
  file: UploadMediaPayload,
): Promise<Media> {
  const ext = file.file.name.split(".").pop() ?? "";
  const generatedFileName = `${uuidv4()}${ext ? `.${ext}` : ""}`;
  const file_type = getFileType(file.file);
  const shouldEncrypt = file.encryption ?? false;

  let uploadBuffer: Buffer = await fileToBuffer(file.file);
  let storagePath = `${userId}/${generatedFileName}`;
  let encryptedKey: string | null = null;
  let ivHex: string | null = null;
  let encryptionAlgorithm: string | null = null;

  // Watermark first
  if (file.watermark && file.watermarkText) {
    uploadBuffer = await applyWatermark(
      uploadBuffer,
      file.file.type,
      file.watermarkText,
    );
  }

  // Encrypt the file if requested
  if (shouldEncrypt) {
    const result = encryptFile(uploadBuffer);
    uploadBuffer = result.encryptedBuffer;
    encryptedKey = result.encryptedKey;
    ivHex = result.iv;
    encryptionAlgorithm = "AES-256-CBC";
    // Store encrypted files under a separate prefix
    storagePath = `${userId}/enc_${generatedFileName}`;
  }

  // Upload to Supabase Storage
  const { error: storageError } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, uploadBuffer, {
      cacheControl: "3600",
      upsert: false,
      // Use octet-stream for encrypted blobs so the browser never tries to
      // interpret the raw cipher-text as the original mime type.
      contentType: shouldEncrypt ? "application/octet-stream" : file.file.type,
    });

  if (storageError) {
    throw new Error(`Storage upload failed: ${storageError.message}`);
  }

  // Insert metadata into DB
  const { data, error: dbError } = await supabase
    .from("media")
    .insert({
      owner_id: userId,
      file_name: file.file.name,
      file_type: file_type,
      mime_type: file.file.type,
      storage_path: storagePath,
      size_bytes: file.file.size,
      is_encrypted: shouldEncrypt,
      is_watermarked: file.watermark ?? false,
      watermark_text: file.watermarkText || null,
      encryption_algorithm: encryptionAlgorithm,
      encrypted_key: encryptedKey, // master-key-wrapped DEK
      iv: ivHex, // hex IV for file cipher
    })
    .select()
    .single();

  if (dbError) {
    // Roll back the storage upload to keep things consistent
    await supabase.storage.from(BUCKET).remove([storagePath]);
    throw new Error(`Database insert failed: ${dbError.message}`);
  }

  return data as Media;
}
export async function getMediaList(
  supabase: SupabaseClient,
  userId: string,
): Promise<MyMediaItem[]> {
  const { data, error } = await supabase.rpc("get_media_with_shared", {
    p_user_id: userId,
  });

  if (error) {
    throw new Error(`Failed to fetch media list: ${error.message}`);
  }

  return data ?? [];
}

export async function getMediaById(
  supabase: SupabaseClient,
  userId: string,
  id: string,
): Promise<Media> {
  const { data, error } = await supabase
    .from("media")
    .select("*")
    .eq("id", id)
    .eq("owner_id", userId)
    .single();

  if (error || !data) {
    throw new Error("Media not found");
  }

  return data as Media;
}

export async function viewMedia(
  supabase: SupabaseClient,
  userId: string,
  id: string,
): Promise<string> {
  const media = await getMediaById(supabase, userId, id);

  const { data } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(media.storage_path, 3600); // 1 hour

  if (!data?.signedUrl) {
    throw new Error("Failed to generate signed URL");
  }

  return data.signedUrl;
}

export async function downloadMedia(
  supabase: SupabaseClient,
  userId: string,
  id: string,
): Promise<{ blob: Blob; media: Media }> {
  const media = await getMediaById(supabase, userId, id);

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .download(media.storage_path);

  if (error || !data) {
    throw new Error(`Failed to download file: ${error?.message}`);
  }

  return { blob: data, media };
}

export async function deleteMedia(
  supabase: SupabaseClient,
  userId: string,
  id: string,
): Promise<void> {
  const media = await getMediaById(supabase, userId, id);

  const { error: storageError } = await supabase.storage
    .from(BUCKET)
    .remove([media.storage_path]);

  if (storageError) {
    throw new Error(
      `Failed to delete file from storage: ${storageError.message}`,
    );
  }

  const { error: dbError } = await supabase
    .from("media")
    .delete()
    .eq("id", id)
    .eq("owner_id", userId);

  if (dbError) {
    throw new Error(`Failed to delete media record: ${dbError.message}`);
  }
}

export async function getSharedUsers(
  supabase: SupabaseClient,
  userId: string,
): Promise<MySharedUsers[]> {
  const { data, error } = await supabase.rpc("get_shared_users", {
    p_user_id: userId,
  });

  if (error) {
    throw new Error(`Failed to fetch shared users: ${error.message}`);
  }

  return data.shared_with ?? [];
}

export async function getAllUsers(
  supabase: SupabaseClient,
): Promise<AllUsers[]> {
  const { data, error } = await supabase.from("profiles").select("*");

  if (error) {
    throw new Error(`Failed to fetch all users: ${error.message}`);
  }

  return data ?? [];
}
