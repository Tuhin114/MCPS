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
    <section className="flex h-full flex-col rounded-xl border border-border bg-card">
      <header className="flex items-center gap-3 px-5 py-4">
        <div className="flex size-9 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-primary/30">
          <ShieldCheck className="size-4.5 text-primary" />
        </div>
        <div className="flex-1">
          <h2 className="text-sm font-semibold tracking-tight">
            Security Status
          </h2>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            Protection layers for your content
          </p>
        </div>
        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary ring-1 ring-primary/20">
          Secure
        </span>
      </header>

      <div className="flex flex-col gap-4 border-t border-border p-5">
        {data?.map((check, i) => (
          <div key={check.label}>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm text-foreground">
                <span className="size-1.5 rounded-full bg-primary shadow-[0_0_6px_var(--color-primary)]" />
                {check.label}
              </span>
              <span className="text-[11px] font-medium text-primary">
                {check.status}
              </span>
            </div>
            <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-surface-hover">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${check.value}%` }}
                transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
                className="h-full rounded-full bg-primary"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
