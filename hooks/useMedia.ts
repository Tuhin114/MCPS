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
  viewContent: (id: string) => [...mediaKeys.all, "view-content", id] as const,
  sharedUsers: () => [...mediaKeys.all, "shared-users"] as const,
  users: () => [...mediaKeys.all, "users"] as const,
};

type MyMediaResponse = {
  media: MyMediaItem[];
};

export interface ViewContentResponse {
  /** Media metadata (sensitive encryption fields stripped server-side) */
  media: Omit<Media, "encrypted_key" | "iv">;
  /** URL to call for the actual file bytes — /api/media/[id]/content?inline=1 */
  contentUrl: string;
  /** Effective permission for the current user */
  permission: "owner" | "view" | "download";
}

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

async function downloadFile(
  media: Pick<MyMediaItem, "id" | "file_name">,
): Promise<void> {
  const res = await fetch(`/api/media/${media.id}/content`);

  if (!res.ok) {
    let message = "Download failed";
    try {
      const err: ApiError = await res.json();
      message = err.error || message;
    } catch {
      // ignore JSON parse error
    }
    throw new Error(message);
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);

  // Trigger browser download
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = media.file_name;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);

  // Release the object URL after a short delay
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

/**
 * Fetch metadata + content URL for the view-content page.
 * Does NOT stream the file — the viewer uses contentUrl directly.
 */
async function fetchViewContent(id: string): Promise<ViewContentResponse> {
  const res = await fetch(`/api/media/${id}/view-content`);
  if (!res.ok) {
    const err: ApiError = await res.json();
    throw new Error(err.error || "Failed to load file");
  }
  return res.json();
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

export function useDownloadMedia() {
  return useMutation<void, Error, Pick<Media, "id" | "file_name">>({
    mutationFn: downloadFile,
  });
}

/**
 * Fetches media metadata and the inline content URL for the viewer page.
 * Works for both file owners and shared-with users.
 *
 * Usage:
 *   const { data, isLoading, isError } = useViewContent(mediaId);
 *    data.contentUrl  → pass directly to <img src> / <iframe src> / fetch()
 *    data.media       → file_name, mime_type, size_bytes, is_encrypted, etc.
 *    data.permission  → "owner" | "view" | "download"
 */
export function useViewContent(
  id: string,
  options?: Omit<
    UseQueryOptions<ViewContentResponse, Error>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery<ViewContentResponse, Error>({
    queryKey: mediaKeys.viewContent(id),
    queryFn: () => fetchViewContent(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    ...options,
  });
}
