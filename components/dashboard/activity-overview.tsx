"use client";

import { motion } from "motion/react";

import { cn } from "@/lib/utils";
import { Activity } from "@/types/dashboard";

const dotStyles: Record<string, string> = {
  success: "bg-green-500 group-hover:shadow-green-500/50",
  info: "bg-amber-500 group-hover:shadow-amber-500/50",
  warning: "bg-red-500 group-hover:shadow-red-500/50",
};

export function ActivityOverview({ data }: { data?: Activity[] | undefined }) {
  return (
    <section className="flex h-full flex-col rounded-2xl border border-white/5 bg-black/40 backdrop-blur-xl shadow-2xl">
      <header className="px-6 py-5 bg-white/[0.02] border-b border-white/5">
        <h2 className="text-base font-bold tracking-tight text-foreground">
          Activity Overview
        </h2>
        <p className="mt-1 text-xs font-medium text-muted-foreground/80">
          Recent events across your workspace
        </p>
      </header>

      <div className="p-6">
        <ol className="relative ml-2">
          <span
            className="absolute bottom-2 left-[5px] top-2 w-px bg-white/10"
            aria-hidden
          />
          {data?.map((activity, i) => (
            <motion.li
              key={activity.id}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
              className="group relative -mx-2 flex gap-4 rounded-xl px-2 py-3 transition-colors duration-200 hover:bg-white/[0.03]"
            >
              <span className="relative z-10 mt-1 flex size-3 shrink-0 items-center justify-center">
                <span
                  className={cn(
                    "size-2.5 rounded-full ring-4 ring-black transition-shadow duration-300 group-hover:shadow-[0_0_12px_2px]",
                    dotStyles[activity.status] || "bg-blue-500 group-hover:shadow-blue-500/50"
                  )}
                />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-sm font-semibold text-foreground group-hover:text-amber-50 transition-colors">
                    {activity.title}
                  </p>
                  <span className="shrink-0 text-xs font-medium text-muted-foreground/60 group-hover:text-amber-500/70 transition-colors">
                    {activity.created_at}
                  </span>
                </div>
                <p className="mt-1 text-xs font-medium leading-relaxed text-muted-foreground/80">
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
