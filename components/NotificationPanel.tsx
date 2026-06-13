"use client";

import { useRouter } from "next/navigation";
import {
  Bell,
  ArrowRight,
  CheckCheck,
  Share2,
  ShieldOff,
  ShieldCheck,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from "@/hooks/useNotification";
import {
  notificationMessage,
  type NotificationDetail,
  type NotificationAction,
} from "@/types/notification";

const MAX_VISIBLE = 15;

// ── Icon per action ───────────────────────────────────────────────────────────

function ActionIcon({ action }: { action: NotificationAction }) {
  switch (action) {
    case "Shared":
      return <Share2 className="h-3.5 w-3.5 text-amber-500" />;
    case "Revoked":
      return <ShieldOff className="h-3.5 w-3.5 text-destructive" />;
    case "Upgraded":
      return <ShieldCheck className="h-3.5 w-3.5 text-green-500" />;
    case "Restricted":
      return <EyeOff className="h-3.5 w-3.5 text-orange-400" />;
  }
}

function actionColor(action: NotificationAction): string {
  switch (action) {
    case "Shared":
      return "bg-amber-500/10 border-amber-500/20";
    case "Revoked":
      return "bg-destructive/10 border-destructive/20";
    case "Upgraded":
      return "bg-green-500/10 border-green-500/20";
    case "Restricted":
      return "bg-orange-400/10 border-orange-400/20";
  }
}

// ── Relative time helper ──────────────────────────────────────────────────────

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

// ── Skeleton row ──────────────────────────────────────────────────────────────

function NotificationSkeleton() {
  return (
    <div className="flex items-start gap-3 px-4 py-3">
      <Skeleton className="h-8 w-8 rounded-lg flex-shrink-0" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-3 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}

// ── Single notification row ───────────────────────────────────────────────────

function NotificationItem({
  notif,
  onRead,
}: {
  notif: NotificationDetail;
  onRead: (id: string) => void;
}) {
  const message = notificationMessage(
    notif.action,
    notif.sender_email,
    notif.file_name,
  );

  return (
    <button
      onClick={() => onRead(notif.id)}
      className={cn(
        "w-full flex items-start gap-3 px-4 py-3 text-left transition-colors",
        "hover:bg-surface-hover focus-visible:outline-none focus-visible:bg-surface-hover",
        !notif.is_read && "bg-primary/5",
      )}
    >
      {/* Icon bubble */}
      <div
        className={cn(
          "h-8 w-8 rounded-lg border flex items-center justify-center flex-shrink-0 mt-0.5",
          actionColor(notif.action),
        )}
      >
        <ActionIcon action={notif.action} />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-xs leading-snug text-foreground break-words",
            !notif.is_read && "font-medium",
          )}
        >
          {message}
        </p>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          {relativeTime(notif.created_at)}
        </p>
      </div>

      {/* Unread dot */}
      {!notif.is_read && (
        <span className="mt-1.5 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
      )}
    </button>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function NotificationPanel() {
  const router = useRouter();
  const { data, isLoading } = useNotifications();
  const { mutate: markRead } = useMarkNotificationRead();
  const { mutate: markAllRead, isPending: isMarkingAll } =
    useMarkAllNotificationsRead();

  const allNotifications = data?.notifications ?? [];
  const unreadCount = data?.unread_count ?? 0;
  const visibleNotifications = allNotifications.slice(0, MAX_VISIBLE);
  const hasMore = allNotifications.length > MAX_VISIBLE;

  const handleRead = (id: string) => {
    markRead(id);
    router.push("/protected/share-with-me");
  };

  const handleMarkAllRead = () => markAllRead();

  const badgeCount = unreadCount > 99 ? "99+" : unreadCount;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative size-9 text-muted-foreground hover:bg-surface-hover hover:text-foreground"
          aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
        >
          <Bell className="size-4.5" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground leading-none">
              {badgeCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[380px] p-0 bg-card border-border shadow-xl rounded-xl overflow-hidden"
      >
        {/* Panel header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-foreground" />
            <span className="text-sm font-semibold text-foreground">
              Notifications
            </span>
            {unreadCount > 0 && (
              <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded-full bg-primary/15 text-primary">
                {unreadCount} new
              </span>
            )}
          </div>

          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllRead}
              disabled={isMarkingAll}
              className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground gap-1"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Mark all read
            </Button>
          )}
        </div>

        {/* Notification list */}
        <div className="max-h-[420px] overflow-y-auto divide-y divide-border/60">
          {isLoading ? (
            // Skeleton loading state
            Array.from({ length: 5 }).map((_, i) => (
              <NotificationSkeleton key={i} />
            ))
          ) : visibleNotifications.length === 0 ? (
            // Empty state
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                <Bell className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground">
                You have no notifications yet. Keep all caught up!
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 text-center">
                No new notifications right now.
              </p>
            </div>
          ) : (
            visibleNotifications.map((notif) => (
              <NotificationItem
                key={notif.id}
                notif={notif}
                onRead={handleRead}
              />
            ))
          )}
        </div>

        {/* Footer CTA */}
        {!isLoading && (
          <div className="border-t border-border px-4 py-3 bg-surface/50">
            <Button
              variant="ghost"
              size="sm"
              className="w-full h-8 text-xs text-muted-foreground hover:text-foreground gap-1.5 justify-center"
              onClick={() => router.push("/protected/share-with-me")}
            >
              View shared media
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
            {hasMore && (
              <p className="text-center text-[11px] text-muted-foreground mt-1">
                Showing {MAX_VISIBLE} of {allNotifications.length} notifications
              </p>
            )}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
