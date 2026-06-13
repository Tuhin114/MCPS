"use client";

import { motion } from "framer-motion";
import { Shield, Download, Share2, ShieldAlert, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { overviewMetrics } from "@/lib/activity-data";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

const icons: Record<string, React.ElementType> = {
  protected: Shield,
  downloads: Download,
  shares: Share2,
  security: ShieldAlert,
};

const colorMap: Record<string, { text: string; glow: string; stroke: string }> = {
  amber: { text: "text-amber-400", glow: "from-amber-500/15", stroke: "#f59e0b" },
  blue: { text: "text-blue-400", glow: "from-blue-500/15", stroke: "#3b82f6" },
  purple: { text: "text-purple-400", glow: "from-purple-500/15", stroke: "#a855f7" },
  red: { text: "text-red-400", glow: "from-red-500/15", stroke: "#ef4444" },
};

export function ActivityOverview() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {overviewMetrics.map((metric, i) => {
        const Icon = icons[metric.id];
        const colors = colorMap[metric.color];
        const sparkData = metric.spark.map((v, idx) => ({ idx, v }));
        const isUp = metric.direction === "up";

        return (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
          >
            <Card className="group relative overflow-hidden p-5 transition-colors hover:border-zinc-700/80">
              <div
                className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${colors.glow} to-transparent opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100`}
              />
              <div className="flex items-start justify-between">
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-800/80 ${colors.text}`}>
                  <Icon className="h-4 w-4" strokeWidth={1.75} />
                </div>
                <div
                  className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                    isUp ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                  }`}
                >
                  {isUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {Math.abs(metric.trend)}%
                </div>
              </div>

              <div className="mt-4">
                <p className="text-2xl font-semibold tracking-tight text-zinc-50 tabular-nums">
                  {metric.display}
                </p>
                <p className="mt-1 text-xs text-zinc-500">{metric.label}</p>
              </div>

              <div className="mt-3 h-10 w-full opacity-70 transition-opacity group-hover:opacity-100">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sparkData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                    <defs>
                      <linearGradient id={`spark-${metric.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={colors.stroke} stopOpacity={0.35} />
                        <stop offset="100%" stopColor={colors.stroke} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="v"
                      stroke={colors.stroke}
                      strokeWidth={1.5}
                      fill={`url(#spark-${metric.id})`}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
