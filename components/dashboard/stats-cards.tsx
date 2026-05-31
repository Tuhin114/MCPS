"use client";

import { motion } from "motion/react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Database,
  Download,
  Files,
  Shield,
} from "lucide-react";

import { stats } from "@/lib/mcps-data";
import { cn } from "@/lib/utils";
import { DashboardStats } from "@/types/dashboard";

const iconMap = {
  files: Files,
  shield: Shield,
  download: Download,
  database: Database,
};

export function StatsCards({}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat, i) => {
        const Icon = iconMap[stat.icon as keyof typeof iconMap];
        const TrendIcon = stat.trend === "up" ? ArrowUpRight : ArrowDownRight;
        return (
          <motion.div
            key={stat.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.06, ease: "easeOut" }}
            whileHover={{ scale: 1.02 }}
            className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 transition-colors duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-black/30"
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.04] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative flex items-start justify-between">
              <span className="text-sm text-muted-foreground">
                {stat.label}
              </span>
              <div className="flex size-9 items-center justify-center rounded-lg bg-surface-hover ring-1 ring-border transition-colors duration-300 group-hover:bg-primary/15 group-hover:ring-primary/30">
                <Icon className="size-4 text-muted-foreground transition-colors duration-300 group-hover:text-primary" />
              </div>
            </div>
            <div className="relative mt-3 flex items-end justify-between">
              <span className="text-2xl font-semibold tracking-tight">
                {stat.value}
              </span>
              <div
                className={cn(
                  "flex items-center gap-0.5 text-xs font-medium",
                  stat.trend === "up"
                    ? "text-primary"
                    : "text-muted-foreground",
                )}
              >
                <TrendIcon className="size-3.5" />
                {stat.delta}
              </div>
            </div>
            <p className="relative mt-1 text-[11px] text-muted-foreground">
              {stat.hint}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}
