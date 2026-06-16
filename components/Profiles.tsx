// components/profile/profile.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import {
  Camera,
  Check,
  Loader2,
  Pencil,
  Shield,
  User,
  X,
  Mail,
  Calendar,
  Clock,
} from "lucide-react";
import {
  useProfile,
  useUpdateProfile,
  useUploadAvatar,
} from "@/hooks/useProfiles";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

// ── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(username: string | null, email: string): string {
  const name = username?.trim() || email.split("@")[0];
  const parts = name.split(/[\s_\-\.]+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function ProfileSkeleton() {
  return (
    <div className="mx-auto w-full max-w-2xl space-y-4 px-4 py-8 animate-pulse">
      <div className="h-5 w-28 rounded-md bg-muted" />
      <div className="h-3.5 w-52 rounded-md bg-muted/60" />

      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-5">
          <div className="h-20 w-20 rounded-full bg-muted shrink-0" />
          <div className="space-y-2 flex-1">
            <div className="h-4 w-28 rounded-md bg-muted" />
            <div className="h-3 w-44 rounded-md bg-muted/60" />
            <div className="mt-3 h-7 w-28 rounded-lg bg-muted" />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 space-y-5">
        <div className="h-3.5 w-36 rounded-md bg-muted" />
        <div className="h-9 rounded-lg bg-muted" />
        <div className="h-px bg-border" />
        <div className="h-3.5 w-36 rounded-md bg-muted" />
        <div className="h-9 rounded-lg bg-muted" />
        <div className="h-px bg-border" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-10 rounded-md bg-muted" />
          <div className="h-10 rounded-md bg-muted" />
        </div>
      </div>
    </div>
  );
}

// ── Avatar Display ────────────────────────────────────────────────────────────

function AvatarDisplay({
  avatarUrl,
  initials,
}: {
  avatarUrl: string | null;
  initials: string;
}) {
  return (
    <Avatar className="h-20 w-20 ring-2 ring-primary/30 ring-offset-2 ring-offset-card">
      <AvatarImage
        src={avatarUrl ?? undefined}
        alt="Avatar"
        className="object-cover"
      />
      <AvatarFallback className="bg-primary/15 text-xl font-bold text-primary">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}

// ── Section Card ──────────────────────────────────────────────────────────────

function SectionCard({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-start gap-3 border-b border-border bg-muted/30 px-6 py-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="text-[13.5px] font-semibold text-foreground">{title}</p>
          <p className="text-[12px] text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

// ── Info Row ──────────────────────────────────────────────────────────────────

function InfoRow({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border bg-muted/50 text-muted-foreground/60">
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="mb-1.5 text-[10.5px] font-semibold uppercase tracking-widest text-muted-foreground/50">
          {label}
        </p>
        {children}
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export function Profile() {
  const [userId, setUserId] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
      setAuthLoading(false);
    });
  }, []);

  const { data: profile, isLoading, isError } = useProfile(userId || "");
  const updateProfile = useUpdateProfile(userId || "");
  const uploadAvatar = useUploadAvatar(userId || "");

  const [editingUsername, setEditingUsername] = useState(false);
  const [draftUsername, setDraftUsername] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startEditUsername = () => {
    setDraftUsername(profile?.username ?? "");
    setEditingUsername(true);
  };

  const cancelEditUsername = () => {
    setEditingUsername(false);
    setDraftUsername("");
  };

  const saveUsername = () => {
    if (!draftUsername.trim()) return;
    updateProfile.mutate(
      { username: draftUsername.trim() },
      { onSuccess: () => setEditingUsername(false) },
    );
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setAvatarPreview(objectUrl);
    uploadAvatar.mutate(file, {
      onSuccess: () => {
        URL.revokeObjectURL(objectUrl);
        setAvatarPreview(null);
      },
      onError: () => {
        URL.revokeObjectURL(objectUrl);
        setAvatarPreview(null);
      },
    });
    e.target.value = "";
  };

  if (authLoading || isLoading) return <ProfileSkeleton />;

  if (isError || !profile) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-6 py-5 text-center">
          <p className="text-[13px] font-medium text-destructive">
            Failed to load profile
          </p>
          <p className="mt-1 text-[12px] text-muted-foreground">
            Please refresh the page and try again.
          </p>
        </div>
      </div>
    );
  }

  const initials = getInitials(profile.username, profile.email);
  const displayAvatar = avatarPreview ?? profile.avatar_url;

  return (
    <div className="mx-auto w-full max-w-2xl space-y-4 px-4 py-8">
      {/* ── Avatar card ── */}
      <SectionCard
        title="Profile Photo"
        description="JPEG, PNG, WebP or GIF · max 5 MB"
        icon={Camera}
      >
        <div className="flex items-center gap-6">
          {/* Avatar with hover overlay */}
          <div className="relative shrink-0">
            <AvatarDisplay avatarUrl={displayAvatar} initials={initials} />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadAvatar.isPending}
              className={cn(
                "absolute inset-0 flex items-center justify-center rounded-full",
                "bg-foreground/60 opacity-0 backdrop-blur-sm transition-all duration-150 hover:opacity-100",
                "focus-visible:opacity-100 focus-visible:outline-none",
                uploadAvatar.isPending && "opacity-100",
              )}
              aria-label="Upload new avatar"
            >
              {uploadAvatar.isPending ? (
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              ) : (
                <Camera className="h-5 w-5 text-primary" />
              )}
            </button>
            <input
              title=""
              placeholder="Upload avatar"
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
              className="sr-only"
              onChange={handleAvatarChange}
            />
          </div>

          {/* Name + email + button */}
          <div className="min-w-0 flex-1 space-y-1">
            <p className="truncate text-[14px] font-semibold text-foreground">
              {profile.username ?? initials}
            </p>
            <p className="truncate text-[12.5px] text-muted-foreground">
              {profile.email}
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadAvatar.isPending}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-[12px] font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:bg-primary/8 hover:text-primary disabled:opacity-50"
              >
                {uploadAvatar.isPending ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" /> Uploading…
                  </>
                ) : (
                  <>
                    <Camera className="h-3 w-3" /> Change photo
                  </>
                )}
              </button>
            </div>

            {uploadAvatar.isError && (
              <p className="pt-1 text-[12px] text-destructive">
                {uploadAvatar.error?.message}
              </p>
            )}
            {uploadAvatar.isSuccess && !avatarPreview && (
              <p className="pt-1 text-[12px] text-primary">Photo updated.</p>
            )}
          </div>
        </div>
      </SectionCard>

      {/* ── Personal information card ── */}
      <SectionCard
        title="Personal Information"
        description="Update your username — email cannot be changed"
        icon={User}
      >
        <div className="space-y-5">
          {/* Username */}
          <InfoRow icon={User} label="Username">
            {editingUsername ? (
              <div className="flex items-center gap-2">
                <Input
                  id="username"
                  value={draftUsername}
                  onChange={(e) => setDraftUsername(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveUsername();
                    if (e.key === "Escape") cancelEditUsername();
                  }}
                  autoFocus
                  className="h-8 border-border bg-input text-[13px] text-foreground placeholder:text-muted-foreground/40 focus-visible:border-primary/40 focus-visible:ring-1 focus-visible:ring-primary/30"
                />
                <button
                  type="button"
                  onClick={saveUsername}
                  disabled={updateProfile.isPending || !draftUsername.trim()}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-opacity hover:bg-primary/90 disabled:opacity-40"
                  aria-label="Save"
                >
                  {updateProfile.isPending ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Check className="h-3.5 w-3.5" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={cancelEditUsername}
                  disabled={updateProfile.isPending}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
                  aria-label="Cancel"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="flex h-8 flex-1 items-center rounded-lg border border-border bg-input px-3 text-[13px] text-foreground">
                  {profile.username ?? (
                    <span className="text-muted-foreground/40">Not set</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={startEditUsername}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground/60 transition-colors hover:border-primary/30 hover:bg-primary/8 hover:text-primary"
                  aria-label="Edit username"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            {updateProfile.isError && (
              <p className="mt-1.5 text-[12px] text-destructive">
                {updateProfile.error?.message}
              </p>
            )}
            {updateProfile.isSuccess && !editingUsername && (
              <p className="mt-1.5 text-[12px] text-primary">
                Username updated successfully.
              </p>
            )}
          </InfoRow>

          <Separator className="bg-border" />

          {/* Email — read-only */}
          <InfoRow icon={Mail} label="Email address">
            <div className="flex items-center gap-2">
              <div className="flex h-8 flex-1 items-center rounded-lg border border-border bg-muted/40 px-3 text-[13px] text-muted-foreground cursor-not-allowed select-none">
                {profile.email}
              </div>
              <span className="inline-flex items-center rounded-md border border-border bg-muted/50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                locked
              </span>
            </div>
            <p className="mt-1.5 text-[11.5px] text-muted-foreground/60">
              Contact support to update your email address.
            </p>
          </InfoRow>

          <Separator className="bg-border" />

          {/* Meta dates */}
          <div className="grid grid-cols-2 gap-4">
            <InfoRow icon={Calendar} label="Member since">
              <p className="text-[13px] text-foreground">
                {new Date(profile.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </InfoRow>
            <InfoRow icon={Clock} label="Last updated">
              <p className="text-[13px] text-foreground">
                {new Date(profile.updated_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </InfoRow>
          </div>
        </div>
      </SectionCard>

      {/* ── Security notice ── */}
      <div className="flex items-center gap-3 rounded-xl border border-primary/15 bg-primary/5 px-5 py-3.5">
        <Shield className="h-4 w-4 shrink-0 text-primary" />
        <p className="text-[12.5px] text-muted-foreground">
          Your account is protected. Profile changes are logged for security.
        </p>
        <span className="ml-auto inline-flex shrink-0 items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-[10.5px] font-semibold text-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Secure
        </span>
      </div>
    </div>
  );
}
