"use client";

import { motion } from "framer-motion";
import {
  Share2,
  Download,
  Users,
  ShieldAlert,
  FileArchive,
  FileText,
  Image as ImageIcon,
  FileVideo,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import {
  mostSharedFiles,
  topDownloadedFiles,
  mostActiveUsers,
  recentAlerts,
} from "@/lib/activity-data";

const fileIcons: Record<string, React.ElementType> = {
  ZIP: FileArchive,
  PDF: FileText,
  PNG: ImageIcon,
  MP4: FileVideo,
};

function InsightCard({
  title,
  icon: Icon,
  iconColor,
  children,
  delay,
}: {
  title: string;
  icon: React.ElementType;
  iconColor: string;
  children: React.ReactNode;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card className="h-full transition-colors hover:border-zinc-700/80">
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle>{title}</CardTitle>
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800/80 ${iconColor}`}
          >
            <Icon className="h-4 w-4" strokeWidth={1.75} />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">{children}</CardContent>
      </Card>
    </motion.div>
  );
}

export function AdvancedInsights() {
  const maxShares = Math.max(...mostSharedFiles.map((f) => f.shares));
  const maxDownloads = Math.max(...topDownloadedFiles.map((f) => f.downloads));
  const maxActions = Math.max(...mostActiveUsers.map((u) => u.actions));

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <InsightCard
        title="Most Shared Files"
        icon={Share2}
        iconColor="text-purple-400"
        delay={0}
      >
        {mostSharedFiles.map((file) => {
          const Icon = fileIcons[file.type];
          const pct = (file.shares / maxShares) * 100;
          return (
            <div key={file.name} className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs">
                <Icon className="h-3.5 w-3.5 shrink-0 text-zinc-500" />
                <span className="truncate text-zinc-300">{file.name}</span>
                <span className="ml-auto shrink-0 font-medium tabular-nums text-zinc-400">
                  {file.shares}
                </span>
              </div>
              <div className="h-1 w-full overflow-hidden rounded-full bg-zinc-800/80">
                <div
                  className="h-full rounded-full bg-purple-500/70"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </InsightCard>

      <InsightCard
        title="Top Downloaded Files"
        icon={Download}
        iconColor="text-blue-400"
        delay={0.06}
      >
        {topDownloadedFiles.map((file) => {
          const Icon = fileIcons[file.type];
          const pct = (file.downloads / maxDownloads) * 100;
          return (
            <div key={file.name} className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs">
                <Icon className="h-3.5 w-3.5 shrink-0 text-zinc-500" />
                <span className="truncate text-zinc-300">{file.name}</span>
                <span className="ml-auto shrink-0 font-medium tabular-nums text-zinc-400">
                  {file.downloads.toLocaleString()}
                </span>
              </div>
              <div className="h-1 w-full overflow-hidden rounded-full bg-zinc-800/80">
                <div
                  className="h-full rounded-full bg-blue-500/70"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </InsightCard>

      <InsightCard
        title="Most Active Users"
        icon={Users}
        iconColor="text-amber-400"
        delay={0.12}
      >
        {mostActiveUsers.map((user) => {
          const pct = (user.actions / maxActions) * 100;
          return (
            <div key={user.name} className="flex items-center gap-2.5">
              <Avatar className="h-7 w-7 text-[10px]">{user.initials}</Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-300">{user.name}</span>
                  <span className="font-medium tabular-nums text-zinc-400">
                    {user.actions}
                  </span>
                </div>
                <div className="h-1 w-full overflow-hidden rounded-full bg-zinc-800/80">
                  <div
                    className="h-full rounded-full bg-amber-500/70"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </InsightCard>

      <InsightCard
        title="Recent Security Alerts"
        icon={ShieldAlert}
        iconColor="text-red-400"
        delay={0.18}
      >
        {recentAlerts.map((alert) => (
          <div
            key={alert.title}
            className="rounded-lg border border-red-500/10 bg-red-500/5 p-2.5"
          >
            <p className="text-xs font-medium text-zinc-200">{alert.title}</p>
            <div className="mt-1 flex items-center justify-between text-[11px] text-zinc-500">
              <span className="truncate">{alert.location}</span>
              <span className="shrink-0">{alert.time}</span>
            </div>
          </div>
        ))}
      </InsightCard>
    </div>
  );
}
