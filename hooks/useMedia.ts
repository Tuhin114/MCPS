"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import type {
  Media,
  UploadMediaResponse,
  ApiError,
  UploadMediaPayload,
  MySharedUsers,
  AllUsers,
  MyMediaItem,
  MediaResponse,
} from "@/types/media";

// Query keys
export const mediaKeys = {
  all: ["media"] as const,
  lists: () => [...mediaKeys.all, "list"] as const,
  detail: (id: string) => [...mediaKeys.all, "detail", id] as const,
  sharedUsers: () => [...mediaKeys.all, "shared-users"] as const,
  users: () => [...mediaKeys.all, "users"] as const,
};

type MyMediaResponse = {
  media: MyMediaItem[];
};

// Fetch helpers
async function fetchMediaList(): Promise<MyMediaItem[]> {
  const res = await fetch("/api/media/lists");

  if (!res.ok) {
    const err: ApiError = await res.json();
    throw new Error(err.error || "Failed to fetch media list");
  }

  const data: MyMediaResponse = await res.json();

  return data.media;
}

async function fetchMedia(id: string): Promise<Media> {
  const res = await fetch(`/api/media/${id}`);
  if (!res.ok) {
    const err: ApiError = await res.json();
    throw new Error(err.error || "Failed to fetch media");
  }
  const data: MediaResponse = await res.json();
  return data.media;
}

async function uploadFile(payload: UploadMediaPayload): Promise<Media> {
  const formData = new FormData();

  formData.append("file", payload.file);

  if (payload.encryption) formData.append("encryption", "true");
  if (payload.watermark) formData.append("watermark", "true");
  if (payload.watermarkText)
    formData.append("watermarkText", payload.watermarkText);

  const res = await fetch("/api/media/upload", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err: ApiError = await res.json();
    throw new Error(err.error || "Upload failed");
  }

  const data: UploadMediaResponse = await res.json();
  return data.media;
}

async function fetchSharedUsers(): Promise<MySharedUsers[]> {
  const res = await fetch("/api/media/shared-users");
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to fetch shared users");
  }
  const data = await res.json();
  return data.shared_users ?? [];
}

export async function getUser(email: string): Promise<AllUsers[]> {
  const res = await fetch(`/api/media/all-users?email=${email}`);

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to fetch users");
  }

  return await res.json();
}

// Hooks
export function useMediaList(
  options?: Omit<UseQueryOptions<MyMediaItem[], Error>, "queryKey" | "queryFn">,
) {
  return useQuery<MyMediaItem[], Error>({
    queryKey: mediaKeys.lists(),
    queryFn: fetchMediaList,
    ...options,
  });
}

export function useMedia(
  id: string,
  options?: Omit<UseQueryOptions<Media, Error>, "queryKey" | "queryFn">,
) {
  return useQuery<Media, Error>({
    queryKey: mediaKeys.detail(id),
    queryFn: () => fetchMedia(id),
    enabled: !!id,
    ...options,
  });
}

export function useUploadMedia() {
  const queryClient = useQueryClient();

  return useMutation<Media, Error, UploadMediaPayload>({
    mutationFn: uploadFile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mediaKeys.lists() });
    },
  });
}

export function useSharedUsers() {
  return useQuery<MySharedUsers[], Error>({
    queryKey: mediaKeys.sharedUsers(),
    queryFn: fetchSharedUsers,
  });
}

// export function useGetUser(email: string) {
//   return useQuery<AllUsers[], Error>({
//     queryKey: ["users", email],
//     queryFn: () => getUser(email),
//     enabled: !!email.trim(),
//   });
// }
