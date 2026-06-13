"use client";

import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { activitySeries, protectionBreakdown } from "@/lib/activity-data";

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-zinc-700/60 bg-zinc-900/95 px-3 py-2 text-xs shadow-xl backdrop-blur-sm">
      <p className="mb-1 font-medium text-zinc-300">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2 text-zinc-400">
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: p.color }} />
          <span className="capitalize">{p.dataKey}</span>
          <span className="ml-auto font-medium text-zinc-200 tabular-nums">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

export function ProtectionActivityChart() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Protection Activity</CardTitle>
        <CardDescription>Protected files, downloads and shares over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4 pb-4">
          {[
            { key: "protected", label: "Protected Files", color: "#f59e0b" },
            { key: "downloads", label: "Downloads", color: "#3b82f6" },
            { key: "shares", label: "Shares", color: "#a855f7" },
          ].map((item) => (
            <div key={item.key} className="flex items-center gap-2 text-xs text-zinc-400">
              <span className="h-2 w-2 rounded-full" style={{ background: item.color }} />
              {item.label}
            </div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="h-[280px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activitySeries} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="gradProtected" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradDownloads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradShares" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#27272a" strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                stroke="#52525b"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                interval={1}
              />
              <YAxis stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} width={36} />
              <Tooltip content={<ChartTooltip />} />
              <Area
                type="monotone"
                dataKey="downloads"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#gradDownloads)"
                animationDuration={1200}
              />
              <Area
                type="monotone"
                dataKey="shares"
                stroke="#a855f7"
                strokeWidth={2}
                fill="url(#gradShares)"
                animationDuration={1200}
              />
              <Area
                type="monotone"
                dataKey="protected"
                stroke="#f59e0b"
                strokeWidth={2}
                fill="url(#gradProtected)"
                animationDuration={1200}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </CardContent>
    </Card>
  );
}

export function ProtectionBreakdownChart() {
  const total = protectionBreakdown.reduce((sum, d) => sum + d.value, 0);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Protection Breakdown</CardTitle>
        <CardDescription>Distribution across protection states</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={protectionBreakdown}
                dataKey="value"
                nameKey="name"
                innerRadius={62}
                outerRadius={88}
                paddingAngle={3}
                strokeWidth={0}
                animationDuration={1000}
              >
                {protectionBreakdown.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0];
                  return (
                    <div className="rounded-lg border border-zinc-700/60 bg-zinc-900/95 px-3 py-2 text-xs shadow-xl backdrop-blur-sm">
                      <div className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: d.payload.color }} />
                        <span className="text-zinc-300">{d.name}</span>
                        <span className="ml-auto font-medium text-zinc-100 tabular-nums">{d.value}</span>
                      </div>
                    </div>
                  );
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-semibold tracking-tight text-zinc-50 tabular-nums">{total}</span>
            <span className="text-[11px] text-zinc-500">Total Files</span>
          </div>
        </div>

        <div className="mt-2 space-y-2.5">
          {protectionBreakdown.map((item) => {
            const pct = Math.round((item.value / total) * 100);
            return (
              <div key={item.name} className="flex items-center gap-2.5 text-xs">
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: item.color }} />
                <span className="text-zinc-400">{item.name}</span>
                <span className="ml-auto font-medium text-zinc-300 tabular-nums">{item.value}</span>
                <span className="w-10 text-right text-zinc-500 tabular-nums">{pct}%</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
