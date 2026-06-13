import type {
  CreateNotificationPayload,
  CreateNotificationResponse,
  GetNotificationsResponse,
  MarkReadResponse,
  MarkAllReadResponse,
} from "@/types/notification.ts";

//  GET /api/notifications

export async function getNotifications(): Promise<GetNotificationsResponse> {
  const res = await fetch("/api/notifications");

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to fetch notifications");
  }

  return res.json();
}

//  POST /api/notifications ─

export async function createNotification(
  payload: CreateNotificationPayload,
): Promise<CreateNotificationResponse> {
  const res = await fetch("/api/notifications", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to create notification");
  }

  return res.json();
}

//  PATCH /api/notifications/[id] — mark single notification read ─

export async function markNotificationRead(
  id: string,
): Promise<MarkReadResponse> {
  const res = await fetch(`/api/notifications/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ is_read: true }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to mark notification as read");
  }

  return res.json();
}

//  PATCH /api/notifications/mark-all-read

export async function markAllNotificationsRead(): Promise<MarkAllReadResponse> {
  const res = await fetch("/api/notifications/mark-all-read", {
    method: "PATCH",
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to mark all notifications as read");
  }

  return res.json();
}
