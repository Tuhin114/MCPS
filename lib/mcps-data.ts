export type MediaType = "video" | "image" | "audio" | "document";

export interface MediaFile {
  id: string;
  name: string;
  type: MediaType;
  size: string;
  uploadedAt: string;
  protected: boolean;
}

export type FileType =
  | "image"
  | "video"
  | "audio"
  | "document"
  | "pdf"
  | "presentation";

export interface SharedUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  permissions: ("view" | "download")[];
  isNew?: boolean;
}

export interface MediaItem {
  id: string;
  name: string;
  fileType: FileType;
  size: number;
  status: MediaStatus;
  uploadedDate: Date;
  lastModified: Date;
  sharedWith: SharedUser[];
  description?: string;
  encrypted?: boolean;
  watermarked?: boolean;
  watermarkText?: string;
}

export const stats = [
  {
    key: "total-media",
    label: "Total Media",
    value: "1,284",
    delta: "+12.4%",
    trend: "up" as const,
    hint: "vs. last month",
    icon: "files",
  },
  {
    key: "protected-media",
    label: "Protected Media",
    value: "1,147",
    delta: "+8.1%",
    trend: "up" as const,
    hint: "89% of library",
    icon: "shield",
  },
  {
    key: "downloads",
    label: "Downloads",
    value: "24,910",
    delta: "+3.2%",
    trend: "up" as const,
    hint: "last 30 days",
    icon: "download",
  },
  {
    key: "storage-usage",
    label: "Storage Usage",
    value: "412 GB",
    delta: "-1.8%",
    trend: "down" as const,
    hint: "of 1 TB",
    icon: "database",
  },
];

export const recentUploads: MediaFile[] = [
  {
    id: "1",
    name: "product-launch-keynote.mp4",
    type: "video",
    size: "1.2 GB",
    uploadedAt: "2 min ago",
    protected: true,
  },
  {
    id: "2",
    name: "brand-guidelines-2026.pdf",
    type: "document",
    size: "18.4 MB",
    uploadedAt: "26 min ago",
    protected: true,
  },
  {
    id: "3",
    name: "campaign-hero-banner.png",
    type: "image",
    size: "8.1 MB",
    uploadedAt: "1 hour ago",
    protected: true,
  },
  {
    id: "4",
    name: "podcast-episode-142.mp3",
    type: "audio",
    size: "94.2 MB",
    uploadedAt: "3 hours ago",
    protected: false,
  },
  {
    id: "5",
    name: "investor-deck-q1.pdf",
    type: "document",
    size: "12.7 MB",
    uploadedAt: "5 hours ago",
    protected: true,
  },
  {
    id: "6",
    name: "behind-the-scenes.mov",
    type: "video",
    size: "640 MB",
    uploadedAt: "Yesterday",
    protected: true,
  },
];

export interface Activity {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  status: "success" | "info" | "warning";
}

export const activities: Activity[] = [
  {
    id: "1",
    title: "Media protected",
    description: "AES-256 watermark applied to product-launch-keynote.mp4",
    timestamp: "2 min ago",
    status: "success",
  },
  {
    id: "2",
    title: "New share created",
    description: "campaign-hero-banner.png shared with marketing team",
    timestamp: "40 min ago",
    status: "info",
  },
  {
    id: "3",
    title: "Access revoked",
    description: "External link for investor-deck-q1.pdf was disabled",
    timestamp: "2 hours ago",
    status: "warning",
  },
  {
    id: "4",
    title: "Bulk upload completed",
    description: "32 assets uploaded to Brand Library",
    timestamp: "5 hours ago",
    status: "success",
  },
  {
    id: "5",
    title: "Encryption verified",
    description: "Integrity scan passed for 1,147 protected files",
    timestamp: "Yesterday",
    status: "info",
  },
];

export const mediaLibrary: MediaFile[] = [
  {
    id: "m1",
    name: "product-launch-keynote.mp4",
    type: "video",
    size: "1.2 GB",
    uploadedAt: "Today",
    protected: true,
  },
  {
    id: "m2",
    name: "brand-guidelines-2026.pdf",
    type: "document",
    size: "18.4 MB",
    uploadedAt: "Today",
    protected: true,
  },
  {
    id: "m3",
    name: "campaign-hero-banner.png",
    type: "image",
    size: "8.1 MB",
    uploadedAt: "Today",
    protected: true,
  },
  {
    id: "m4",
    name: "podcast-episode-142.mp3",
    type: "audio",
    size: "94.2 MB",
    uploadedAt: "Yesterday",
    protected: false,
  },
  {
    id: "m5",
    name: "investor-deck-q1.pdf",
    type: "document",
    size: "12.7 MB",
    uploadedAt: "Yesterday",
    protected: true,
  },
  {
    id: "m6",
    name: "behind-the-scenes.mov",
    type: "video",
    size: "640 MB",
    uploadedAt: "2 days ago",
    protected: true,
  },
  {
    id: "m7",
    name: "annual-report-cover.jpg",
    type: "image",
    size: "5.4 MB",
    uploadedAt: "3 days ago",
    protected: true,
  },
  {
    id: "m8",
    name: "ad-spot-30s-final.mp4",
    type: "video",
    size: "320 MB",
    uploadedAt: "4 days ago",
    protected: true,
  },
  {
    id: "m9",
    name: "interview-raw-audio.wav",
    type: "audio",
    size: "212 MB",
    uploadedAt: "5 days ago",
    protected: false,
  },
  {
    id: "m10",
    name: "press-kit-photos.zip",
    type: "image",
    size: "148 MB",
    uploadedAt: "1 week ago",
    protected: true,
  },
  {
    id: "m11",
    name: "contract-template.pdf",
    type: "document",
    size: "2.1 MB",
    uploadedAt: "1 week ago",
    protected: true,
  },
  {
    id: "m12",
    name: "promo-teaser.mp4",
    type: "video",
    size: "88 MB",
    uploadedAt: "2 weeks ago",
    protected: true,
  },
];

export interface SharedFile extends MediaFile {
  sharedBy: string;
  permission: "View" | "Download" | "Edit";
}

export const sharedWithMe: SharedFile[] = [
  {
    id: "s1",
    name: "Q1-marketing-plan.pdf",
    type: "document",
    size: "9.8 MB",
    uploadedAt: "1 hour ago",
    protected: true,
    sharedBy: "Maya Lin",
    permission: "View",
  },
  {
    id: "s2",
    name: "event-recap-reel.mp4",
    type: "video",
    size: "410 MB",
    uploadedAt: "Yesterday",
    protected: true,
    sharedBy: "Theo Park",
    permission: "Download",
  },
  {
    id: "s3",
    name: "logo-variations.png",
    type: "image",
    size: "6.2 MB",
    uploadedAt: "2 days ago",
    protected: true,
    sharedBy: "Avery Chen",
    permission: "Edit",
  },
  {
    id: "s4",
    name: "soundtrack-master.mp3",
    type: "audio",
    size: "72 MB",
    uploadedAt: "3 days ago",
    protected: false,
    sharedBy: "Jordan Ito",
    permission: "View",
  },
  {
    id: "s5",
    name: "board-presentation.pdf",
    type: "document",
    size: "15.3 MB",
    uploadedAt: "1 week ago",
    protected: true,
    sharedBy: "Maya Lin",
    permission: "Download",
  },
];

export const storageBreakdown = [
  { label: "Video", value: 248, fill: "#f59e0b" },
  { label: "Images", value: 92, fill: "#fbbf24" },
  { label: "Audio", value: 48, fill: "#d97706" },
  { label: "Documents", value: 24, fill: "#92400e" },
];
export const securityChecks = [
  { label: "AES-256 Encryption Active", value: 100, status: "Active" },
  { label: "Watermark Protection Enabled", value: 96, status: "Enabled" },
  { label: "Secure Storage Connected", value: 100, status: "Connected" },
  { label: "Access Control Enabled", value: 88, status: "Enabled" },
];

export const DUMMY_FILES = [
  {
    id: "1",
    name: "mountain.jpg",
    type: "image",
    size: "2.45 MB",
    thumbnail:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop",
  },
  {
    id: "2",
    name: "nature-video.mp4",
    type: "video",
    size: "24.5 MB",
    thumbnail:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop",
  },
  {
    id: "3",
    name: "presentation.pdf",
    type: "document",
    size: "3.2 MB",
  },
  {
    id: "4",
    name: "music-track.mp3",
    type: "audio",
    size: "8.7 MB",
  },
  {
    id: "5",
    name: "design-doc.docx",
    type: "document",
    size: "4.5 MB",
  },
];
