"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { mediaKeys } from "@/hooks/useMedia";
import {
  deleteMediaById,
  updateMediaById,
  shareMedia,
  updateSharePermission,
  removeShare,
} from "@/services/media.actions.service";
import type {
  DeleteMediaResponse,
  UpdateMediaPayload,
  UpdateMediaResponse,
  ShareMediaPayload,
  ShareMediaResponse,
  UpdateSharePermissionPayload,
  UpdateSharePermissionResponse,
  RemoveShareResponse,
  RemoveSharePayload,
} from "@/types/media";

// ── Delete Media ──────────────────────────────────────────────────────────────

export function useDeleteMedia() {
  const queryClient = useQueryClient();

  return useMutation<DeleteMediaResponse, Error, string>({
    mutationFn: (id) => deleteMediaById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mediaKeys.lists() });
    },
  });
}

// ── Update Media ──────────────────────────────────────────────────────────────

interface UpdateMediaVariables {
  id: string;
  payload: UpdateMediaPayload;
}

export function useUpdateMedia() {
  const queryClient = useQueryClient();

  return useMutation<UpdateMediaResponse, Error, UpdateMediaVariables>({
    mutationFn: ({ id, payload }) => updateMediaById(id, payload),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: mediaKeys.lists() });
      queryClient.invalidateQueries({ queryKey: mediaKeys.detail(id) });
    },
  });
}

// ── Share Media (add new shared_media row) ────────────────────────────────────

interface ShareMediaVariables {
  mediaId: string;
  payload: ShareMediaPayload;
}

export function useShareMedia() {
  const queryClient = useQueryClient();

  return useMutation<ShareMediaResponse, Error, ShareMediaVariables>({
    mutationFn: ({ mediaId, payload }) => shareMedia(mediaId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mediaKeys.lists() });
    },
  });
}

// ── Update Share Permission (PATCH shared_media row) ──────────────────────────

interface UpdateSharePermissionVariables {
  mediaId: string;
  shareId: string;
  payload: UpdateSharePermissionPayload;
}

export function useUpdateSharePermission() {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateSharePermissionResponse,
    Error,
    UpdateSharePermissionVariables
  >({
    mutationFn: ({ mediaId, shareId, payload }) =>
      updateSharePermission(mediaId, shareId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mediaKeys.lists() });
    },
  });
}

// ── Remove Share (DELETE shared_media row) ────────────────────────────────────

export function useRemoveShare() {
  const queryClient = useQueryClient();

  return useMutation<RemoveShareResponse, Error, RemoveSharePayload>({
    mutationFn: ({ mediaId, shareId }) => removeShare(mediaId, shareId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mediaKeys.lists() });
    },
  });
}
