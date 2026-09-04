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
            whileHover={{ scale: 1.02, y: -2 }}
            className="group relative overflow-hidden rounded-2xl border border-white/5 bg-black/40 backdrop-blur-xl p-5 transition-all duration-300 hover:border-amber-500/30 hover:bg-white/5 hover:shadow-xl hover:shadow-amber-500/10 cursor-default"
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-500/[0.03] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative flex items-start justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </span>
              <div className="flex size-10 items-center justify-center rounded-xl bg-black/50 border border-white/5 transition-transform duration-300 group-hover:scale-110 group-hover:border-amber-500/20 group-hover:bg-amber-500/10">
                <Icon className="size-4.5 text-muted-foreground transition-colors duration-300 group-hover:text-amber-500" />
              </div>
            </div>
            <div className="relative mt-4 flex items-end justify-between">
              <span className="text-3xl font-black tracking-tight text-foreground">
                {stat.value}
              </span>
              <div
                className={cn(
                  "flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold border",
                  stat.trend === "up"
                    ? "bg-green-500/10 text-green-400 border-green-500/20"
                    : "bg-red-500/10 text-red-400 border-red-500/20",
                )}
              >
                <TrendIcon className="size-3.5" />
                {stat.delta}
              </div>
            </div>
            <p className="relative mt-2 text-xs font-medium text-muted-foreground/80">
              {stat.hint}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}
