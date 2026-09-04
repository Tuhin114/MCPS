"use client";

import { motion } from "motion/react";
import { ShieldCheck } from "lucide-react";
import { SecurityCheck } from "@/types/dashboard";

export function SecurityStatus({
  data,
}: {
  data: SecurityCheck[] | undefined;
}) {
  return (
    <section className="flex h-full flex-col rounded-2xl border border-white/5 bg-black/40 backdrop-blur-xl shadow-2xl">
      <header className="flex items-center gap-4 px-6 py-5 bg-white/[0.02] border-b border-white/5">
        <div className="flex size-11 items-center justify-center rounded-xl bg-green-500/10 border border-green-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
          <ShieldCheck className="size-5.5 text-green-500" />
        </div>
        <div className="flex-1">
          <h2 className="text-base font-bold tracking-tight text-foreground">
            Security Status
          </h2>
          <p className="mt-1 text-xs font-medium text-muted-foreground/80">
            Protection layers for your content
          </p>
        </div>
        <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-bold text-green-400 border border-green-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
          Secure
        </span>
      </header>

      <div className="flex flex-col gap-6 p-6">
        {data?.map((check, i) => (
          <div key={check.label} className="group">
            <div className="flex items-center justify-between mb-2.5">
              <span className="flex items-center gap-3 text-sm font-semibold text-foreground group-hover:text-amber-50 transition-colors">
                <span className="size-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)] group-hover:shadow-[0_0_12px_rgba(245,158,11,0.9)] transition-shadow" />
                {check.label}
              </span>
              <span className="text-xs font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                {check.status}
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${check.value}%` }}
                transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
                className="h-full rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
