"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { generateHeatmapData } from "@/lib/activity-data";

const intensityColors = [
  "bg-zinc-800/60",
  "bg-amber-900/50",
  "bg-amber-700/60",
  "bg-amber-500/70",
  "bg-amber-400",
];

const months = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"];

export function ActivityHeatmap() {
  const data = generateHeatmapData();
  const [hovered, setHovered] = useState<{ week: number; day: number; value: number } | null>(null);

  const weeks = 53;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Protection Activity Heatmap</CardTitle>
        <CardDescription>Protection actions over the last 12 months</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto pb-2">
          <div className="inline-flex flex-col gap-2 min-w-[760px]">
            <div className="flex pl-8 text-[11px] text-zinc-500">
              {months.map((m) => (
                <div key={m} style={{ width: `${(weeks / months.length) * 13.5}px` }}>
                  {m}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <div className="flex flex-col gap-[3px] pt-[1px] text-[10px] text-zinc-500">
                {["", "Mon", "", "Wed", "", "Fri", ""].map((d, i) => (
                  <div key={i} className="h-[11px] leading-[11px]">
                    {d}
                  </div>
                ))}
              </div>
              <div className="relative grid grid-flow-col gap-[3px]">
                {Array.from({ length: weeks }).map((_, w) => (
                  <div key={w} className="grid grid-rows-7 gap-[3px]">
                    {Array.from({ length: 7 }).map((_, d) => {
                      const cell = data.find((x) => x.week === w && x.day === d)!;
                      return (
                        <motion.div
                          key={`${w}-${d}`}
                          initial={{ opacity: 0, scale: 0.6 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.2, delay: (w * 7 + d) * 0.0015 }}
                          onMouseEnter={() => setHovered(cell)}
                          onMouseLeave={() => setHovered(null)}
                          className={`h-[11px] w-[11px] rounded-[2px] ${intensityColors[cell.value]} cursor-pointer transition-transform hover:scale-125`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pl-8 pt-1">
              <p className="h-4 text-xs text-zinc-500">
                {hovered
                  ? `${hovered.value === 0 ? "No" : hovered.value} protection action${hovered.value === 1 ? "" : "s"} on this day`
                  : "Hover a cell to see activity"}
              </p>
              <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
                <span>Less</span>
                {intensityColors.map((c, i) => (
                  <span key={i} className={`h-[11px] w-[11px] rounded-[2px] ${c}`} />
                ))}
                <span>More</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
