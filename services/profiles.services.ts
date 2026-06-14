import { Profile, UpdateProfilePayload } from "@/types/profile";
import { SupabaseClient } from "@supabase/supabase-js";

const AVATAR_BUCKET = "avatars";

/**
 * Fetch a single profile by user ID.
 */
export async function getProfile(
  supabase: SupabaseClient,
  userId: string,
): Promise<Profile> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Profile not found");
  }

  return data as Profile;
}

/**
 * Update mutable profile fields (username only — email is immutable).
 */
export async function updateProfile(
  supabase: SupabaseClient,
  userId: string,
  payload: UpdateProfilePayload,
): Promise<Profile> {
  const { data, error } = await supabase
    .from("profiles")
    .update({
      ...payload,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)
    .select()
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Failed to update profile");
  }

  return data as Profile;
}

/**
 * Upload a new avatar image for the user, then update profiles.avatar_url.
 * Replaces any existing avatar under the same path.
 *
 * @param supabase  Supabase client (server or browser)
 * @param userId    The authenticated user's ID
 * @param file      The raw File / Blob to upload
 * @returns         The updated Profile record
 */
export async function uploadAvatar(
  supabase: SupabaseClient,
  userId: string,
  file: File,
): Promise<Profile> {
  const ext = file.name.split(".").pop() ?? "jpg";
  // Always overwrite the same path so old files are replaced automatically.
  const storagePath = `${userId}/avatar.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(AVATAR_BUCKET)
    .upload(storagePath, file, {
      cacheControl: "3600",
      upsert: true, // overwrite existing
      contentType: file.type,
    });

  if (uploadError) {
    throw new Error(`Avatar upload failed: ${uploadError.message}`);
  }

  // Build the public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(storagePath);

  // Persist the URL in the profiles table
  const { data, error: dbError } = await supabase
    .from("profiles")
    .update({ avatar_url: publicUrl, updated_at: new Date().toISOString() })
    .eq("id", userId)
    .select()
    .single();

  if (dbError || !data) {
    throw new Error(dbError?.message ?? "Failed to save avatar URL");
  }

  return data as Profile;
}
