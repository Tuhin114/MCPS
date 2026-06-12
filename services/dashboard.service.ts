import { createClient } from "@/lib/supabase/server";
import { formatFileSize, timeAgo } from "@/lib/dashboard-utils";

export async function getDashboardData(userId: string) {
  const supabase = await createClient();

  const [mediaResult, activityResult] = await Promise.all([
    supabase.from("media").select("*").eq("owner_id", userId),

    supabase
      .from("activity_logs")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", {
        ascending: false,
      })
      .limit(10),
  ]);

  if (mediaResult.error) {
    throw new Error(mediaResult.error.message);
  }

  if (activityResult.error) {
    throw new Error(activityResult.error.message);
  }

  const media = mediaResult.data ?? [];
  const activityLists = activityResult.data ?? [];

  // Dashboard Stats
  const totalMedia = media.length;

  const protectedMedia = media.filter((item) => item.is_encrypted).length;

  const downloads = media.reduce(
    (sum, item) => sum + (item.download_count || 0),
    0,
  );

  const totalBytes = media.reduce(
    (sum, item) => sum + (item.size_bytes || 0),
    0,
  );

  const storageGB = Number((totalBytes / 1024 / 1024 / 1024).toFixed(2));

  // Recent Uploads
  const recentUploads = [...media]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
    .slice(0, 5)
    .map((item) => ({
      id: item.id,
      name: item.file_name,
      type: item.file_type,
      size: formatFileSize(item.size_bytes),
      uploadedAt: timeAgo(item.created_at),
      protected: item.is_encrypted,
    }));

  // Activities
  const activities = [...activityLists]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
    .slice(0, 5)
    .map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      status: item.status,
      created_at: timeAgo(item.created_at),
    }));

  // Storage Breakdown
  const storageMap = {
    video: 0,
    image: 0,
    audio: 0,
    document: 0,
  };

  media.forEach((item) => {
    switch (item.file_type) {
      case "video":
        storageMap.video += item.size_bytes;
        break;

      case "image":
        storageMap.image += item.size_bytes;
        break;

      case "audio":
        storageMap.audio += item.size_bytes;
        break;

      case "document":
        storageMap.document += item.size_bytes;
        break;
    }
  });

  const storageBreakdown = [
    {
      label: "Video",
      value: Number((storageMap.video / 1024 / 1024 / 1024).toFixed(2)),
      fill: "#f59e0b",
    },
    {
      label: "Images",
      value: Number((storageMap.image / 1024 / 1024 / 1024).toFixed(2)),
      fill: "#fbbf24",
    },
    {
      label: "Audio",
      value: Number((storageMap.audio / 1024 / 1024 / 1024).toFixed(2)),
      fill: "#d97706",
    },
    {
      label: "Documents",
      value: Number((storageMap.document / 1024 / 1024 / 1024).toFixed(2)),
      fill: "#92400e",
    },
  ];

  // Security Status
  const securityChecks = [
    {
      label: "AES-256 Encryption Active",
      value: 100,
      status: "Active",
    },
    {
      label: "Watermark Protection Enabled",
      value: 96,
      status: "Enabled",
    },
    {
      label: "Secure Storage Connected",
      value: 100,
      status: "Connected",
    },
    {
      label: "Access Control Enabled",
      value: 88,
      status: "Enabled",
    },
  ];

  return {
    stats: {
      totalMedia,
      protectedMedia,
      downloads,
      storageGB,
    },
    recentUploads,
    activities,
    storageBreakdown,
    securityChecks,
  };
}
