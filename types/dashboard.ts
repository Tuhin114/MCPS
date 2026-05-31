export interface DashboardStats {
  totalMedia: number;
  protectedMedia: number;
  downloads: number;
  storageGB: number;
}

export interface RecentUpload {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  protected: boolean;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  status: "success" | "info" | "warning";
  created_at: string;
}

export interface StorageBreakdown {
  label: string;
  value: number;
  fill: string;
}

export interface SecurityCheck {
  label: string;
  value: number;
  status: string;
}

export interface DashboardData {
  stats: DashboardStats;
  recentUploads: RecentUpload[];
  activities: Activity[];
  storageBreakdown: StorageBreakdown[];
  securityChecks: SecurityCheck[];
}
