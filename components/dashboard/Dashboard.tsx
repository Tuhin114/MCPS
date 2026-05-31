"use client";
import { StatsCards } from "./stats-cards";
import { RecentUploads } from "./recent-uploads";
import { ActivityOverview } from "./activity-overview";
import { StorageAnalytics } from "./storage-analytics";
import { SecurityStatus } from "./security-status";
import { QuickActions } from "./quick-actions";
import { useDashboardData } from "@/hooks/useDashboardData";

export default function Dashboard() {
  const { data, isLoading, error } = useDashboardData();
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading dashboard</div>;
  }
  return (
    <>
      <section aria-label="Key metrics">
        <StatsCards />
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RecentUploads data={data?.recentUploads} />
        </div>
        <div>
          <ActivityOverview data={data?.activities} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <StorageAnalytics data={data?.storageBreakdown} />
        <SecurityStatus data={data?.securityChecks} />
      </div>

      <QuickActions />
    </>
  );
}
