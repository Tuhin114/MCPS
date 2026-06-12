import type {
  DeleteMediaResponse,
  UpdateMediaPayload,
  UpdateMediaResponse,
  ShareMediaPayload,
  ShareMediaResponse,
  UpdateSharePermissionPayload,
  UpdateSharePermissionResponse,
  RemoveShareResponse,
} from "@/types/media";

// ── Delete ────────────────────────────────────────────────────────────────────

export async function deleteMediaById(
  id: string,
): Promise<DeleteMediaResponse> {
  const res = await fetch(`/api/media/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to delete media");
  }

  return res.json();
}

// ── Update ────────────────────────────────────────────────────────────────────

export async function updateMediaById(
  id: string,
  payload: UpdateMediaPayload,
): Promise<UpdateMediaResponse> {
  const res = await fetch(`/api/media/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to update media");
  }

  return res.json();
}

// ── Share (add new shared_media row) ─────────────────────────────────────────

export async function shareMedia(
  mediaId: string,
  payload: ShareMediaPayload,
): Promise<ShareMediaResponse> {
  const res = await fetch(`/api/media/${mediaId}/share`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to share media");
  }

  return res.json();
}

// ── Update share permission (PATCH shared_media row) ─────────────────────────

export async function updateSharePermission(
  mediaId: string,
  shareId: string,
  payload: UpdateSharePermissionPayload,
): Promise<UpdateSharePermissionResponse> {
  console.log({
    mediaId,
    shareId,
    payload,
  });
  const res = await fetch(`/api/media/${mediaId}/share/${shareId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to update share permission");
  }

  return res.json();
}

// ── Remove share (DELETE shared_media row) ────────────────────────────────────

export async function removeShare(
  mediaId: string,
  shareId: string,
): Promise<RemoveShareResponse> {
  const res = await fetch(`/api/media/${mediaId}/share/${shareId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to remove share");
  }

  return res.json();
}
