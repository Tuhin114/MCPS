"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import type {
  Profile,
  ProfileError,
  UpdateProfilePayload,
} from "@/types/profile";

//  Query keys ──

export const profileKeys = {
  all: ["profiles"] as const,
  detail: (id: string) => [...profileKeys.all, "detail", id] as const,
};

//  Fetch helpers

async function fetchProfile(id: string): Promise<Profile> {
  const res = await fetch(`/api/profiles/${id}`);
  if (!res.ok) {
    const err: ProfileError = await res.json();
    throw new Error(err.error || "Failed to fetch profile");
  }
  const data = await res.json();
  return data.profile as Profile;
}

async function patchProfile(
  id: string,
  payload: UpdateProfilePayload,
): Promise<Profile> {
  const res = await fetch(`/api/profiles/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err: ProfileError = await res.json();
    throw new Error(err.error || "Failed to update profile");
  }
  const data = await res.json();
  return data.profile as Profile;
}

async function postAvatar(id: string, file: File): Promise<Profile> {
  const formData = new FormData();
  formData.append("avatar", file);

  const res = await fetch(`/api/profiles/${id}/avatar`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    const err: ProfileError = await res.json();
    throw new Error(err.error || "Avatar upload failed");
  }
  const data = await res.json();
  return data.profile as Profile;
}

//  Hooks ──

/**
 * Fetch a profile by user ID.
 *
 * Usage:
 *   const { data: profile, isLoading } = useProfile(userId);
 */
export function useProfile(
  id: string,
  options?: Omit<UseQueryOptions<Profile, Error>, "queryKey" | "queryFn">,
) {
  return useQuery<Profile, Error>({
    queryKey: profileKeys.detail(id),
    queryFn: () => fetchProfile(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  });
}

/**
 * Update mutable profile fields (currently: username).
 * Email is read-only and must NOT be passed in the payload.
 *
 * Usage:
 *   const { mutate: updateProfile, isPending } = useUpdateProfile(userId);
 *   updateProfile({ username: "new-name" });
 */
export function useUpdateProfile(userId: string) {
  const queryClient = useQueryClient();

  return useMutation<Profile, Error, UpdateProfilePayload>({
    mutationFn: (payload) => patchProfile(userId, payload),
    onSuccess: (updated) => {
      // Overwrite the cached profile so the UI reflects changes immediately
      queryClient.setQueryData(profileKeys.detail(userId), updated);
    },
  });
}

/**
 * Upload a new avatar image.
 *
 * Usage:
 *   const { mutate: uploadAvatar, isPending } = useUploadAvatar(userId);
 *   uploadAvatar(file);   // file: File (from <input type="file">)
 */
export function useUploadAvatar(userId: string) {
  const queryClient = useQueryClient();

  return useMutation<Profile, Error, File>({
    mutationFn: (file) => postAvatar(userId, file),
    onSuccess: (updated) => {
      queryClient.setQueryData(profileKeys.detail(userId), updated);
    },
  });
}
