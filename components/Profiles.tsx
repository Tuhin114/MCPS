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

//  Helpers

function getInitials(username: string | null, email: string): string {
  const name = username?.trim() || email.split("@")[0];
  const parts = name.split(/[\s_\-\.]+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

//  Skeleton loader ─

function ProfileSkeleton() {
  return (
    <div className="mx-auto w-full space-y-4 px-4 py-8 animate-pulse">
      {/* Header skeleton */}
      <div className="h-6 w-32 rounded bg-[#1a1a1a]" />
      <div className="h-4 w-56 rounded bg-[#1a1a1a]" />

      {/* Avatar card skeleton */}
      <div className="rounded-xl border border-[#2a2a2a] bg-[#141414] p-6">
        <div className="flex items-center gap-5">
          <div className="h-20 w-20 rounded-full bg-[#2a2a2a]" />
          <div className="space-y-2 flex-1">
            <div className="h-4 w-28 rounded bg-[#2a2a2a]" />
            <div className="h-3 w-44 rounded bg-[#2a2a2a]" />
            <div className="h-7 w-28 rounded bg-[#2a2a2a] mt-3" />
          </div>
        </div>
      </div>

      {/* Details card skeleton */}
      <div className="rounded-xl border border-[#2a2a2a] bg-[#141414] p-6 space-y-5">
        <div className="h-4 w-40 rounded bg-[#2a2a2a]" />
        <div className="h-9 rounded-lg bg-[#2a2a2a]" />
        <div className="h-px bg-[#2a2a2a]" />
        <div className="h-4 w-40 rounded bg-[#2a2a2a]" />
        <div className="h-9 rounded-lg bg-[#2a2a2a]" />
        <div className="h-px bg-[#2a2a2a]" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-10 rounded bg-[#2a2a2a]" />
          <div className="h-10 rounded bg-[#2a2a2a]" />
        </div>
      </div>
    </div>
  );
}

//  Avatar Display ──

function AvatarDisplay({
  avatarUrl,
  initials,
}: {
  avatarUrl: string | null;
  initials: string;
}) {
  return (
    <Avatar className="h-20 w-20 ring-2 ring-amber-500/40 ring-offset-2 ring-offset-[#141414]">
      <AvatarImage
        src={avatarUrl ?? undefined}
        alt="Avatar"
        className="object-cover"
      />

      <AvatarFallback className="bg-gradient-to-br from-amber-400 to-amber-600 text-xl font-bold text-black">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}

//  Section Card ─

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
    <div className="rounded-xl border border-[#2a2a2a] bg-[#141414] overflow-hidden">
      {/* Card header — matches the app's card style */}
      <div className="flex items-start gap-3 border-b border-[#2a2a2a] px-6 py-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-medium text-white">{title}</p>
          <p className="text-xs text-[#666]">{description}</p>
        </div>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

//  Info Row ──

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
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#1f1f1f] text-[#555]">
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-wider text-[#555] mb-1">
          {label}
        </p>
        {children}
      </div>
    </div>
  );
}

//  Main Component ──

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

  // Auth is still resolving or profile is loading
  if (authLoading || isLoading) {
    return <ProfileSkeleton />;
  }

  if (isError || !profile) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-6 py-5 text-center">
          <p className="text-sm font-medium text-red-400">
            Failed to load profile
          </p>
          <p className="mt-1 text-xs text-[#666]">
            Please refresh the page and try again.
          </p>
        </div>
      </div>
    );
  }

  const initials = getInitials(profile.username, profile.email);
  const displayAvatar = avatarPreview ?? profile.avatar_url;

  return (
    <div className="mx-auto w-full space-y-4 px-4 py-8">
      {/* ── Avatar card ── */}
      <SectionCard
        title="Profile Photo"
        description="JPEG, PNG, WebP or GIF · max 5 MB"
        icon={Camera}
      >
        <div className="flex items-center gap-6">
          {/* Avatar with camera overlay */}
          <div className="relative shrink-0">
            <AvatarDisplay avatarUrl={displayAvatar} initials={initials} />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadAvatar.isPending}
              className={cn(
                "absolute inset-0 flex items-center justify-center rounded-full",
                "bg-black/70 opacity-0 transition-all duration-150 hover:opacity-100",
                "focus-visible:opacity-100 focus-visible:outline-none",
                uploadAvatar.isPending && "opacity-100",
              )}
              aria-label="Upload new avatar"
            >
              {uploadAvatar.isPending ? (
                <Loader2 className="h-5 w-5 animate-spin text-amber-400" />
              ) : (
                <Camera className="h-5 w-5 text-amber-400" />
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
            <p className="truncate text-sm font-semibold text-white">
              {profile.username ?? initials}
            </p>
            <p className="truncate text-xs text-[#666]">{profile.email}</p>

            <div className="pt-2 flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadAvatar.isPending}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-3 py-1.5 text-xs font-medium text-[#aaa] transition-colors hover:border-amber-500/50 hover:bg-amber-500/10 hover:text-amber-400 disabled:opacity-50"
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
              <p className="text-xs text-red-400 pt-1">
                {uploadAvatar.error?.message}
              </p>
            )}
            {uploadAvatar.isSuccess && !avatarPreview && (
              <p className="text-xs text-amber-400 pt-1">Photo updated.</p>
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
                  className="h-8 border-[#2a2a2a] bg-[#1a1a1a] text-sm text-white placeholder:text-[#444] focus-visible:border-amber-500/50 focus-visible:ring-1 focus-visible:ring-amber-500/50"
                />
                <button
                  type="button"
                  onClick={saveUsername}
                  disabled={updateProfile.isPending || !draftUsername.trim()}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500 text-black transition-opacity hover:bg-amber-400 disabled:opacity-40"
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
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] text-[#666] transition-colors hover:text-white"
                  aria-label="Cancel"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="flex h-8 flex-1 items-center rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-3 text-sm text-white">
                  {profile.username ?? (
                    <span className="text-[#444]">Not set</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={startEditUsername}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] text-[#555] transition-colors hover:border-amber-500/40 hover:text-amber-400"
                  aria-label="Edit username"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            {updateProfile.isError && (
              <p className="mt-1 text-xs text-red-400">
                {updateProfile.error?.message}
              </p>
            )}
            {updateProfile.isSuccess && !editingUsername && (
              <p className="mt-1 text-xs text-amber-400">
                Username updated successfully.
              </p>
            )}
          </InfoRow>

          <Separator className="bg-[#2a2a2a]" />

          {/* Email — read-only */}
          <InfoRow icon={Mail} label="Email address">
            <div className="flex items-center gap-2">
              <div className="flex h-8 flex-1 items-center rounded-lg border border-[#222] bg-[#111] px-3 text-sm text-[#555] cursor-not-allowed select-none">
                {profile.email}
              </div>
              {/* Read-only badge matching the app's pill style */}
              <span className="inline-flex items-center rounded-full border border-[#2a2a2a] bg-[#1a1a1a] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-[#444]">
                locked
              </span>
            </div>
            <p className="mt-1 text-[11px] text-[#444]">
              Contact support to update your email address.
            </p>
          </InfoRow>

          <Separator className="bg-[#2a2a2a]" />

          {/* Meta dates */}
          <div className="grid grid-cols-2 gap-4">
            <InfoRow icon={Calendar} label="Member since">
              <p className="text-sm text-[#aaa]">
                {new Date(profile.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </InfoRow>
            <InfoRow icon={Clock} label="Last updated">
              <p className="text-sm text-[#aaa]">
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

      {/* ── Security notice — matching the "Security Status" card language ── */}
      <div className="flex items-center gap-3 rounded-xl border border-[#2a2a2a] bg-[#141414] px-5 py-3.5">
        <Shield className="h-4 w-4 shrink-0 text-amber-500" />
        <p className="text-xs text-[#666]">
          Your account is protected. Profile changes are logged for security.
        </p>
        <span className="ml-auto inline-flex shrink-0 items-center rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-500">
          Secure
        </span>
      </div>
    </div>
  );
}
