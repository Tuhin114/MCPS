"use client";

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { ApiError } from "@/types/media";
import { mediaKeys } from "./useMedia";

// ── Type ──────────────────────────────────────────────────────────────────────

export interface PublicMediaResponse {
  /** Media metadata — sensitive encryption fields stripped server-side */
  media: {
    id: string;
    file_name: string;
    file_type: string;
    mime_type: string;
    size_bytes: number;
    is_encrypted: boolean;
    is_watermarked: boolean;
    created_at: string;
    owner_id: string;
  };
  /** Pass directly to <img src> / <video src> / fetch() */
  contentUrl: string;
  /** What the public link allows */
  permission: "view" | "download";
}

// ── Extended query keys ───────────────────────────────────────────────────────

export const publicMediaKeys = {
  ...mediaKeys,
  public: (id: string) => [...mediaKeys.all, "public", id] as const,
};

// ── Fetch helper ──────────────────────────────────────────────────────────────

async function fetchPublicMedia(id: string): Promise<PublicMediaResponse> {
  const res = await fetch(`/api/media/${id}/public`);
  if (!res.ok) {
    const err: ApiError = await res.json();
    throw new Error(err.error || "This file is not publicly accessible");
  }
  return res.json();
}

// ── Hook ──────────────────────────────────────────────────────────────────────

/**
 * Checks whether a media item is publicly shared and fetches its metadata
 * + content URL. No authentication required.
 *
 * Usage:
 *   const { data, isLoading, isError, error } = usePublicMedia(id);
 *   data.contentUrl  → pass to viewer
 *   data.media       → file_name, mime_type, etc.
 *   data.permission  → "view" | "download"
 */
export function usePublicMedia(
  id: string,
  options?: Omit<
    UseQueryOptions<PublicMediaResponse, Error>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery<PublicMediaResponse, Error>({
    queryKey: publicMediaKeys.public(id),
    queryFn: () => fetchPublicMedia(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 min — same as useViewContent
    retry: false, // don't retry 404 / 403
    ...options,
  });
}
