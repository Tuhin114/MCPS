import { SharedWithMeMedia } from "@/types/share-media";
import { SupabaseClient } from "@supabase/supabase-js";

export async function getSharedWithMeMediaList(
  supabase: SupabaseClient,
  userId: string,
): Promise<SharedWithMeMedia[]> {
  const { data, error } = await supabase.rpc("get_shared_with_me_media", {
    p_user_id: userId,
  });

  if (error) {
    throw new Error(`Failed to fetch media list: ${error.message}`);
  }

  return data ?? [];
}
