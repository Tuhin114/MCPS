"use client";

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { ApiError } from "@/types/media";
import { SharedWithMeMedia } from "@/types/share-media";

// Query keys
export const mediaKeys = {
  all: ["shared_with_me_media"] as const,
  lists: () => [...mediaKeys.all, "list"] as const,
};

type MyMediaResponse = {
  media: SharedWithMeMedia[];
};

// Fetch helpers
async function fetchSharedWithMeMediaList(): Promise<SharedWithMeMedia[]> {
  const res = await fetch("/api/shared/lists");

  if (!res.ok) {
    const err: ApiError = await res.json();
    throw new Error(err.error || "Failed to fetch media list");
  }

  const data: MyMediaResponse = await res.json();

  return data.media;
}

// Hooks
export function useSharedWithMeMedia(
  options?: Omit<
    UseQueryOptions<SharedWithMeMedia[], Error>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery<SharedWithMeMedia[], Error>({
    queryKey: mediaKeys.lists(),
    queryFn: fetchSharedWithMeMediaList,
    ...options,
  });
}
