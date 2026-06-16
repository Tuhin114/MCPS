"use client";

import {
  ShieldCheck,
  Lock,
  Share2,
  Download,
  AlertTriangle,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { AnimatedList } from "@/components/ui/animated-list";
import { mockActivities } from "@/lib/mcps-data";

interface Activity {
  id: string;
  title: string;
  description: string;
  type: "protected" | "encrypted" | "shared" | "download" | "warning";
  createdAt: string;
}

const activityConfig = {
  protected: {
    icon: ShieldCheck,
    color: "bg-primary/15 text-primary",
  },
  encrypted: {
    icon: Lock,
    color: "bg-blue-500/15 text-blue-500",
  },
  shared: {
    icon: Share2,
    color: "bg-green-500/15 text-green-500",
  },
  download: {
    icon: Download,
    color: "bg-purple-500/15 text-purple-500",
  },
  warning: {
    icon: AlertTriangle,
    color: "bg-red-500/15 text-red-500",
  },
};

const animatedActivities = [...mockActivities, ...mockActivities];

function SecurityActivityItem({
  title,
  description,
  type,
  createdAt,
}: Activity) {
  const config = activityConfig[type];
  const Icon = config.icon;

  return (
    <figure
      className={cn(
        "mx-3 overflow-hidden rounded-xl border border-border bg-card p-3",
        "transition-all duration-200 hover:bg-accent/50",
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-lg",
            config.color,
          )}
        >
          <Icon className="size-4" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h4 className="truncate text-sm font-medium">{title}</h4>

            <span className="shrink-0 text-xs text-muted-foreground">
              {createdAt}
            </span>
          </div>

          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
    </figure>
  );
}

export function SecurityActivityCard() {
  return (
    <section className="flex h-full flex-col rounded-xl border border-border bg-card">
      <div className="border-b border-border px-5 py-4">
        <h3 className="font-semibold">Activity Overview</h3>
        <p className="text-sm text-muted-foreground">
          Recent events across your workspace
        </p>
      </div>

      <div className="relative flex-1 overflow-hidden">
        <AnimatedList>
          {animatedActivities.map((activity, index) => (
            <SecurityActivityItem
              key={`${activity.id}-${index}`}
              {...activity}
            />
          ))}
        </AnimatedList>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-card to-transparent" />
      </div>
    </section>
  );
}
