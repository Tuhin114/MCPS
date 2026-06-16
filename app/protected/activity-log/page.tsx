import { ActivityOverview } from "@/components/activity/activity-overview";
import {
  ProtectionActivityChart,
  ProtectionBreakdownChart,
} from "@/components/activity/analytics-charts";
import { SecurityInsights } from "@/components/activity/security-insights";
import { ActivityFeed } from "@/components/activity/activity-feed";
import { ProtectionHealth } from "@/components/activity/protection-health";
import { ActivityHeatmap } from "@/components/activity/activity-heatmap";
import { AdvancedInsights } from "@/components/activity/advanced-insights";

export default function ActivityAnalyticsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 lg:px-8">
        <ActivityOverview />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-10">
          <div className="lg:col-span-7">
            <ProtectionActivityChart />
          </div>
          <div className="lg:col-span-3">
            <ProtectionBreakdownChart />
          </div>
        </div>

        <SecurityInsights />

        <ActivityFeed />

        <AdvancedInsights />

        <ProtectionHealth />

        <ActivityHeatmap />
      </div>
    </div>
  );
}
