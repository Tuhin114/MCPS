"use client";

import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Share2, Search, Users, UserPlus, Loader2, Globe } from "lucide-react";
import { isValidEmail } from "@/lib/helper";
import { getUser, useSharedUsers } from "@/hooks/useMedia";
import {
  useShareMedia,
  useUpdateSharePermission,
  useRemoveShare,
} from "@/hooks/useMediaAction";
import { useSendNotification } from "@/hooks/useNotification";
import { SuggestionsDropdown } from "./SuggestionsDropdown";
import { UserRow } from "./UserRow";
import { LocalSharedUsers, MyMediaItem, Permission } from "@/types/media";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface ShareMediaDialogProps {
  item: MyMediaItem;
  onShare?: (item: MyMediaItem, emails: string[]) => void;
  trigger?: React.ReactNode;
  onDialogClose?: () => void;
}

export function ShareMediaDialog({
  item,
  onShare,
  trigger,
  onDialogClose,
}: ShareMediaDialogProps) {
  const queryClient = useQueryClient();
  const { data: MySharedWithUsers, isLoading: isLoadingSuggestions } =
    useSharedUsers();

  const { mutateAsync: shareMedia, isPending: isSharing } = useShareMedia();
  const {
    mutateAsync: updateSharePermission,
    isPending: isUpdatingPermission,
  } = useUpdateSharePermission();
  const { mutateAsync: removeShare, isPending: isRemoving } = useRemoveShare();
  const { mutateAsync: sendNotification } = useSendNotification();

  const isSaving = isSharing || isUpdatingPermission || isRemoving;

  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isAddingByEmail, setIsAddingByEmail] = useState(false);

  // Seed from item.shared_with — carry shareId for existing rows so we can PATCH/DELETE them
  const [sharedUsers, setSharedUsers] = useState<LocalSharedUsers[]>(
    (item.shared_with ?? []).map((u) => ({
      share_id: u.share_id,
      shared_user_id: u.shared_with.id,
      shared_user_name: u.shared_with.username,
      shared_user_email: u.shared_with.email,
      shared_user_avatar_url: u.shared_with.avatar_url,
      permission: u.permission,
      expires_at: u.expires_at,
      isNew: false,
      permissionChanged: false,
      markedForRemoval: false,
    })),
  );

  // Track previous permissions so we can determine Upgraded vs Restricted
  const [originalPermissions] = useState<Record<string, Permission>>(
    Object.fromEntries(
      (item.shared_with ?? []).map((u) => [u.shared_with.id, u.permission]),
    ),
  );

  const visibleUsers = useMemo(
    () => sharedUsers.filter((u) => !u.markedForRemoval),
    [sharedUsers],
  );

  const sharedEmails = useMemo(
    () => new Set(visibleUsers.map((u) => u.shared_user_email.toLowerCase())),
    [visibleUsers],
  );

  const suggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return (MySharedWithUsers ?? []).filter(
      (u) =>
        !sharedEmails.has(u.email.toLowerCase()) &&
        (u.email.toLowerCase().includes(q) ||
          u.username.toLowerCase().includes(q)),
    );
  }, [searchQuery, sharedEmails, MySharedWithUsers]);

  const canAddNew = useMemo(
    () =>
      isValidEmail(searchQuery) && !sharedEmails.has(searchQuery.toLowerCase()),
    [searchQuery, sharedEmails],
  );

  const addUser = (
    user: Omit<
      LocalSharedUsers,
      "isNew" | "permissionChanged" | "markedForRemoval"
    >,
  ) => {
    setSharedUsers((prev) => [
      ...prev,
      {
        ...user,
        permission: user.permission ?? "view",
        isNew: true,
        permissionChanged: false,
        markedForRemoval: false,
      },
    ]);
    setSearchQuery("");
    setShowSuggestions(false);
  };

  const handleSelectSuggestion = (user: {
    id: string;
    username: string;
    email: string;
    avatar_url: string;
  }) => {
    addUser({
      shared_user_id: user.id,
      shared_user_name: user.username,
      shared_user_email: user.email,
      shared_user_avatar_url: user.avatar_url,
      permission: "view",
    });
  };

  const addByEmail = async () => {
    if (!canAddNew) return;

    const existing = MySharedWithUsers?.find(
      (u) => u.email.toLowerCase() === searchQuery.toLowerCase(),
    );
    if (existing) {
      addUser({
        shared_user_id: existing.id,
        shared_user_name: existing.username,
        shared_user_email: existing.email,
        shared_user_avatar_url: existing.avatar_url,
        permission: "view",
      });
      return;
    }

    setIsAddingByEmail(true);
    try {
      const result = await getUser(searchQuery);
      if (result.length > 0) {
        const user = result[0];
        addUser({
          shared_user_id: user.id,
          shared_user_name: user.username,
          shared_user_email: user.email,
          shared_user_avatar_url: user.avatar_url,
          permission: "view",
        });
      } else {
        alert("User not found");
      }
    } finally {
      setIsAddingByEmail(false);
    }
  };

  const updatePermission = (userId: string, permission: Permission) => {
    setSharedUsers((prev) =>
      prev.map((u) =>
        u.shared_user_id === userId
          ? {
              ...u,
              permission,
              permissionChanged: !u.isNew,
            }
          : u,
      ),
    );
  };

  const removeUser = (userId: string) => {
    setSharedUsers((prev) =>
      prev
        .map((u) =>
          u.shared_user_id === userId && !u.isNew
            ? { ...u, markedForRemoval: true }
            : u,
        )
        .filter((u) => !(u.shared_user_id === userId && u.isNew)),
    );
  };

  // ── handleSave — fans out DB mutations + fires notifications in parallel ─────
  const handleSave = async () => {
    const ops: Promise<unknown>[] = [];
    const notificationOps: Promise<unknown>[] = [];

    for (const u of sharedUsers) {
      if (u.isNew && !u.markedForRemoval) {
        // New share → POST shared_media + notify "Shared"
        ops.push(
          shareMedia({
            mediaId: item.id,
            payload: {
              shared_with: u.shared_user_id,
              permission: u.permission,
            },
          }),
        );
        notificationOps.push(
          sendNotification({
            media_id: item.id,
            receiver_id: u.shared_user_id,
            action: "Shared",
          }).catch(() => {
            /* non-critical — don't block save */
          }),
        );
      } else if (!u.isNew && u.markedForRemoval && u.share_id) {
        // Removed → DELETE shared_media + notify "Revoked"
        ops.push(
          removeShare({
            mediaId: item.id,
            shareId: u.share_id,
          }),
        );
        notificationOps.push(
          sendNotification({
            media_id: item.id,
            receiver_id: u.shared_user_id,
            action: "Revoked",
          }).catch(() => {}),
        );
      } else if (!u.isNew && u.permissionChanged && u.share_id) {
        // Permission changed → PATCH shared_media + notify Upgraded/Restricted
        ops.push(
          updateSharePermission({
            mediaId: item.id,
            shareId: u.share_id,
            payload: { permission: u.permission },
          }),
        );

        const prev = originalPermissions[u.shared_user_id];
        const action =
          prev === "view" && u.permission === "download"
            ? "Upgraded"
            : "Restricted";

        notificationOps.push(
          sendNotification({
            media_id: item.id,
            receiver_id: u.shared_user_id,
            action,
          }).catch(() => {}),
        );
      }
    }

    await Promise.all(ops);
    // Fire notifications after DB ops succeed (non-blocking for UX)
    Promise.all(notificationOps);

    setSharedUsers((prev) =>
      prev.map((u) => ({
        ...u,
        isNew: false,
        permissionChanged: false,
      })),
    );

    await queryClient.invalidateQueries({ queryKey: ["media"] });

    onShare?.(
      item,
      visibleUsers.map((u) => u.shared_user_email),
    );
    toast.success("Media shared successfully");
    setOpen(false);
  };

  const handleCopyPublicLink = async () => {
    const link = `${window.location.origin}/public/${item.id}/view-content`;
    await navigator.clipboard.writeText(link);
    toast.success("Public link copied to clipboard");
  };

  const handleOpenChange = (val: boolean) => {
    if (isSaving) return;
    setOpen(val);
    if (!val) onDialogClose?.();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="ghost" size="sm" className="h-8 px-2">
            <Share2 className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[560px] bg-card border-border p-0 gap-0 overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-lg bg-amber-500/15 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
              <Share2 className="h-5 w-5 text-amber-500" />
            </div>
            <DialogHeader className="space-y-0.5 text-left">
              <DialogTitle className="text-base font-semibold text-foreground">
                Share Media
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Share anyone having account in this platform with their email id
                and manage their permissions.
              </DialogDescription>
            </DialogHeader>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-4 space-y-4">
          {/* Search + Add */}
          <div className="relative">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() =>
                    setTimeout(() => setShowSuggestions(false), 150)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") addByEmail();
                  }}
                  disabled={isSaving}
                  className="pl-9 bg-surface border-border text-sm h-9"
                />
              </div>
              <Button
                onClick={addByEmail}
                disabled={!canAddNew || isAddingByEmail || isSaving}
                size="sm"
                className="h-9 gap-1.5 bg-amber-500 hover:bg-amber-600 text-white flex-shrink-0 disabled:opacity-40"
              >
                {isAddingByEmail ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <UserPlus className="h-3.5 w-3.5" />
                )}
                Add User
              </Button>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1.5 ml-0.5">
              Search by name or email
            </p>

            <SuggestionsDropdown
              isLoading={isLoadingSuggestions}
              show={showSuggestions && suggestions.length > 0}
              suggestions={suggestions}
              onSelect={handleSelectSuggestion}
            />
          </div>

          {!item.is_encrypted && (
            <div className="mt-4 mb-4 rounded-lg border bg-green-500/10 p-3">
              <div className="flex items-start gap-2">
                <Globe className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-green-600 dark:text-green-400">
                      Public Media
                    </p>
                    <p className="text-xs text-green-600/80 dark:text-green-400/80 mt-1">
                      This media is not encrypted. Anyone with the link can view
                      this content.
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="default"
                    className="shrink-0"
                    onClick={handleCopyPublicLink}
                  >
                    Generate Public Link
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Shared Users List */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <p className="text-xs font-semibold text-foreground uppercase tracking-wide">
                Shared With
              </p>
              {visibleUsers.length > 0 && (
                <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                  {visibleUsers.length}
                </span>
              )}
            </div>

            {visibleUsers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 rounded-lg border border-dashed border-border bg-surface/50">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mb-3">
                  <Users className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground">
                  No users have access
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Add users above to share this media
                </p>
              </div>
            ) : (
              <div className="space-y-1.5 max-h-[260px] overflow-y-auto pr-0.5">
                {visibleUsers.map((entry) => (
                  <UserRow
                    key={entry.shared_user_id}
                    entry={entry}
                    disabled={isSaving}
                    onPermissionChange={updatePermission}
                    onRemove={removeUser}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border flex items-center justify-between bg-surface/50">
          <p className="text-xs text-muted-foreground">
            {visibleUsers.length === 0
              ? "No users have access"
              : `${visibleUsers.length} user${visibleUsers.length !== 1 ? "s" : ""} have access`}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleOpenChange(false)}
              disabled={isSaving}
              className="border-border text-foreground"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
              className="bg-amber-500 hover:bg-amber-600 text-white gap-1.5"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Saving…
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
