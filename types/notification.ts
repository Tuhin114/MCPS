export type NotificationType = "Share";

export type NotificationAction =
  | "Shared"
  | "Revoked"
  | "Upgraded"
  | "Restricted";

export interface NotificationRow {
  id: string;
  media_id: string;
  sender_id: string;
  receiver_id: string;
  type: NotificationType;
  action: NotificationAction;
  is_read: boolean;
  created_at: string;
}

export interface NotificationDetail {
  id: string;
  media_id: string;
  file_name: string;
  sender_id: string;
  sender_name: string;
  sender_email: string;
  receiver_id: string;
  type: NotificationType;
  action: NotificationAction;
  is_read: boolean;
  created_at: string;
}

export interface CreateNotificationPayload {
  media_id: string;
  receiver_id: string;
  action: NotificationAction;
  type?: NotificationType; // defaults to "Share"
}

export interface GetNotificationsResponse {
  notifications: NotificationDetail[];
  unread_count: number;
}

export interface CreateNotificationResponse {
  notification: NotificationRow;
}

export interface MarkReadResponse {
  message: string;
}

export interface MarkAllReadResponse {
  message: string;
}

export function notificationMessage(
  action: NotificationAction,
  senderEmail: string,
  fileName: string,
): string {
  switch (action) {
    case "Shared":
      return `${senderEmail} shared "${fileName}" with you.`;
    case "Revoked":
      return `Your access to "${fileName}" has been revoked.`;
    case "Upgraded":
      return `Your access to "${fileName}" has been upgraded to download.`;
    case "Restricted":
      return `Your access to "${fileName}" has been restricted to view only.`;
  }
}
