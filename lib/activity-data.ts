// Shared dummy data for the Activity & Analytics page

export const overviewMetrics = [
  {
    id: "protected",
    label: "Protected Files",
    value: 1284,
    display: "1,284",
    trend: 12,
    direction: "up" as const,
    color: "amber",
    spark: [40, 42, 45, 44, 48, 52, 55, 58, 60, 64, 68, 72],
  },
  {
    id: "downloads",
    label: "Downloads",
    value: 24910,
    display: "24,910",
    trend: 8,
    direction: "up" as const,
    color: "blue",
    spark: [60, 58, 62, 65, 63, 68, 70, 74, 72, 78, 82, 86],
  },
  {
    id: "shares",
    label: "Shares",
    value: 3482,
    display: "3,482",
    trend: 15,
    direction: "up" as const,
    color: "purple",
    spark: [30, 32, 31, 35, 38, 40, 44, 46, 50, 54, 58, 63],
  },
  {
    id: "security",
    label: "Security Events",
    value: 17,
    display: "17",
    trend: -32,
    direction: "down" as const,
    color: "red",
    spark: [80, 75, 70, 65, 60, 50, 45, 40, 35, 30, 25, 22],
  },
];

export const activitySeries = [
  { date: "Jun 1", protected: 38, downloads: 210, shares: 60 },
  { date: "Jun 2", protected: 42, downloads: 240, shares: 72 },
  { date: "Jun 3", protected: 35, downloads: 198, shares: 55 },
  { date: "Jun 4", protected: 50, downloads: 280, shares: 84 },
  { date: "Jun 5", protected: 61, downloads: 320, shares: 96 },
  { date: "Jun 6", protected: 55, downloads: 295, shares: 88 },
  { date: "Jun 7", protected: 70, downloads: 360, shares: 110 },
  { date: "Jun 8", protected: 64, downloads: 340, shares: 102 },
  { date: "Jun 9", protected: 78, downloads: 390, shares: 120 },
  { date: "Jun 10", protected: 85, downloads: 410, shares: 132 },
  { date: "Jun 11", protected: 92, downloads: 450, shares: 145 },
  { date: "Jun 12", protected: 101, downloads: 480, shares: 158 },
];

export const protectionBreakdown = [
  { name: "Encrypted", value: 540, color: "#f59e0b" },
  { name: "Encrypted + Watermarked", value: 412, color: "#fbbf24" },
  { name: "Shared", value: 218, color: "#a855f7" },
  { name: "Public", value: 114, color: "#52525b" },
];

export const securityInsights = [
  { label: "AES-256 Protected Files", value: 1142, total: 1284, status: "Secure", tone: "emerald" as const },
  { label: "Watermarked Files", value: 896, total: 1284, status: "Active", tone: "amber" as const },
  { label: "Public Files", value: 114, total: 1284, status: "Review", tone: "red" as const },
  { label: "Shared Files", value: 218, total: 1284, status: "Monitored", tone: "purple" as const },
];

export const categoryStyles = {
  protection: { tone: "amber" as const, label: "Protection" },
  sharing: { tone: "purple" as const, label: "Sharing" },
  downloads: { tone: "blue" as const, label: "Downloads" },
  security: { tone: "emerald" as const, label: "Security" },
  alert: { tone: "red" as const, label: "Alert" },
};

export type ActivityCategory = keyof typeof categoryStyles;

export interface ActivityEvent {
  id: string;
  user: { name: string; initials: string };
  title: string;
  description: string;
  timestamp: string;
  category: ActivityCategory;
}

export const activityFeed: ActivityEvent[] = [
  {
    id: "evt-1",
    user: { name: "System", initials: "SY" },
    title: 'Protected "marketing-video.mp4"',
    description: "AES-256 encryption and watermark applied.",
    timestamp: "2 minutes ago",
    category: "protection",
  },
  {
    id: "evt-2",
    user: { name: "Alex Chen", initials: "AC" },
    title: 'Shared "campaign-assets.zip"',
    description: "Shared with alex@example.com",
    timestamp: "18 minutes ago",
    category: "sharing",
  },
  {
    id: "evt-3",
    user: { name: "Sarah Johnson", initials: "SJ" },
    title: 'Downloaded "brand-guide.pdf"',
    description: "Downloaded by Sarah Johnson",
    timestamp: "42 minutes ago",
    category: "downloads",
  },
  {
    id: "evt-4",
    user: { name: "System", initials: "SY" },
    title: "Permission Updated",
    description: "Download access revoked from michael@example.com",
    timestamp: "1 hour ago",
    category: "security",
  },
  {
    id: "evt-5",
    user: { name: "Priya Patel", initials: "PP" },
    title: "Public Link Created",
    description: "Share link expires in 7 days.",
    timestamp: "2 hours ago",
    category: "sharing",
  },
  {
    id: "evt-6",
    user: { name: "System", initials: "SY" },
    title: "Security Scan Completed",
    description: "No integrity issues detected across 1,284 files.",
    timestamp: "3 hours ago",
    category: "security",
  },
  {
    id: "evt-7",
    user: { name: "Unknown Device", initials: "??" },
    title: "Unauthorized Access Attempt",
    description: "Blocked login from an unrecognized device in Hanoi, VN.",
    timestamp: "5 hours ago",
    category: "alert",
  },
  {
    id: "evt-8",
    user: { name: "James Lee", initials: "JL" },
    title: "Bulk Protection Applied",
    description: "42 files encrypted and watermarked in /Q3-Launch.",
    timestamp: "7 hours ago",
    category: "protection",
  },
  {
    id: "evt-9",
    user: { name: "System", initials: "SY" },
    title: "Public Link Expired",
    description: '"press-kit-2026.zip" share link has expired.',
    timestamp: "9 hours ago",
    category: "sharing",
  },
  {
    id: "evt-10",
    user: { name: "Maria Gomez", initials: "MG" },
    title: "Access Granted",
    description: "Editor access granted to maria@example.com on /Branding.",
    timestamp: "11 hours ago",
    category: "security",
  },
  {
    id: "evt-11",
    user: { name: "System", initials: "SY" },
    title: "Failed Download Attempt",
    description: 'Blocked download of "finance-report.xlsx" — permission denied.',
    timestamp: "13 hours ago",
    category: "alert",
  },
  {
    id: "evt-12",
    user: { name: "System", initials: "SY" },
    title: 'Watermark Applied to "product-render.png"',
    description: "Dynamic watermark embedded with viewer ID.",
    timestamp: "1 day ago",
    category: "protection",
  },
];

export const mostSharedFiles = [
  { name: "campaign-assets.zip", shares: 142, type: "ZIP" },
  { name: "brand-guide.pdf", shares: 98, type: "PDF" },
  { name: "product-render.png", shares: 76, type: "PNG" },
  { name: "press-kit-2026.zip", shares: 61, type: "ZIP" },
];

export const topDownloadedFiles = [
  { name: "marketing-video.mp4", downloads: 3210, type: "MP4" },
  { name: "brand-guide.pdf", downloads: 2840, type: "PDF" },
  { name: "annual-report.pdf", downloads: 1992, type: "PDF" },
  { name: "logo-pack.zip", downloads: 1540, type: "ZIP" },
];

export const mostActiveUsers = [
  { name: "Sarah Johnson", initials: "SJ", actions: 312 },
  { name: "Alex Chen", initials: "AC", actions: 286 },
  { name: "James Lee", initials: "JL", actions: 204 },
  { name: "Priya Patel", initials: "PP", actions: 178 },
];

export const recentAlerts = [
  { title: "Unauthorized access attempt", location: "Hanoi, VN", time: "5h ago" },
  { title: "Failed download — permission denied", location: "finance-report.xlsx", time: "13h ago" },
  { title: "Unusual download volume detected", location: "Account: m.santos", time: "1d ago" },
];

export const protectionHealth = {
  score: 94,
  breakdown: [
    { label: "Encryption Coverage", value: 96, color: "#f59e0b" },
    { label: "Watermark Coverage", value: 88, color: "#fbbf24" },
    { label: "Access Control Coverage", value: 97, color: "#3b82f6" },
    { label: "Storage Security", value: 92, color: "#10b981" },
  ],
};

// 53 weeks x 7 days grid of intensity values 0-4 (deterministic pseudo-random)
export function generateHeatmapData() {
  const weeks = 53;
  const data: { week: number; day: number; value: number }[] = [];
  let seed = 42;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  for (let w = 0; w < weeks; w++) {
    for (let d = 0; d < 7; d++) {
      const r = rand();
      let value = 0;
      if (r > 0.85) value = 4;
      else if (r > 0.65) value = 3;
      else if (r > 0.45) value = 2;
      else if (r > 0.25) value = 1;
      data.push({ week: w, day: d, value });
    }
  }
  return data;
}
