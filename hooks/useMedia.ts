"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import type {
  Media,
  MediaListResponse,
  MediaResponse,
  UploadMediaResponse,
  ApiError,
  UploadMediaPayload,
} from "@/types/media";

// Query keys
export const mediaKeys = {
  all: ["media"] as const,
  lists: () => [...mediaKeys.all, "list"] as const,
  detail: (id: string) => [...mediaKeys.all, "detail", id] as const,
};

// Fetch helpers
async function fetchMediaList(): Promise<Media[]> {
  const res = await fetch("/api/media/list");
  if (!res.ok) {
    const err: ApiError = await res.json();
    throw new Error(err.error || "Failed to fetch media list");
  }
  const data: MediaListResponse = await res.json();
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

// Hooks
export function useMediaList(
  options?: Omit<UseQueryOptions<Media[], Error>, "queryKey" | "queryFn">,
) {
  return useQuery<Media[], Error>({
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
