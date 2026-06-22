"use client";

import { motion } from "motion/react";

import { cn } from "@/lib/utils";
import { Activity } from "@/lib/mcps-data";

const dotStyles: Record<string, string> = {
  success: "bg-green-500 shadow-green-500/40",
  info: "bg-yellow-500 shadow-yellow-500/40",
  warning: "bg-red-500 shadow-red-500/40",
};

export function ActivityOverview({ data }: { data?: Activity[] | undefined }) {
  return (
    <section className="flex h-full flex-col rounded-xl border border-border bg-card">
      <header className="px-5 py-4">
        <h2 className="text-sm font-semibold tracking-tight">
          Activity Overview
        </h2>
        <p className="mt-0.5 text-[11px] text-muted-foreground">
          Recent events across your workspace
        </p>
      </header>

      <div className="border-t border-border p-5">
        <ol className="relative ml-1">
          <span
            className="absolute bottom-2 left-[5px] top-2 w-px bg-border"
            aria-hidden
          />
          {data?.map((activity, i) => (
            <motion.li
              key={activity.id}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
              className="group relative -mx-2 flex gap-3 rounded-lg px-2 py-2 transition-colors duration-200 hover:bg-surface-hover"
            >
              <span className="relative z-10 mt-1.5 flex size-3 shrink-0 items-center justify-center">
                <span
                  className={cn(
                    "size-2.5 rounded-full ring-4 ring-card transition-shadow duration-300 group-hover:shadow-[0_0_10px_2px] group-hover:shadow-current",
                    dotStyles[activity.status],
                  )}
                />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-sm font-medium text-foreground">
                    {activity.title}
                  </p>
                  <span className="shrink-0 text-[11px] text-muted-foreground">
                    {activity.timestamp}
                  </span>
                </div>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  {activity.description}
                </p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
