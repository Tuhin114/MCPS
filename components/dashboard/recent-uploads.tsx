"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  FileText,
  FileVideo,
  ImageIcon,
  Music,
  Lock,
  ChevronRight,
} from "lucide-react";

import { type MediaType } from "@/lib/mcps-data";
import { Button } from "@/components/ui/button";
import { RecentUpload } from "@/types/dashboard";

const typeMeta: Record<
  MediaType,
  { icon: typeof FileText; label: string; tint: string }
> = {
  video: { icon: FileVideo, label: "Video", tint: "text-chart-1" },
  image: { icon: ImageIcon, label: "Image", tint: "text-chart-2" },
  audio: { icon: Music, label: "Audio", tint: "text-chart-4" },
  document: { icon: FileText, label: "Document", tint: "text-chart-5" },
};

export function RecentUploads({ data }: { data: RecentUpload[] | undefined }) {
  return (
    <section className="rounded-xl border border-border bg-card">
      <header className="flex items-center justify-between px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold tracking-tight">
            Recent Uploads
          </h2>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            Latest media added to your library
          </p>
        </div>
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="h-8 gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <Link href="/media">
            View all
            <ChevronRight className="size-3.5" />
          </Link>
        </Button>
      </header>

      <div className="border-t border-border">
        {data?.map((file, i) => {
          const meta = typeMeta[file.type as MediaType];
          const Icon = meta.icon;
          return (
            <motion.div
              key={file.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              className="group flex items-center gap-3 border-b border-border px-5 py-2.5 transition-colors duration-200 last:border-b-0 hover:bg-surface-hover"
            >
              <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-surface-secondary ring-1 ring-border">
                <Icon className={`size-4 ${meta.tint}`} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm font-medium text-foreground">
                    {file.name}
                  </span>
                  {file.protected && (
                    <Lock
                      className="size-3 shrink-0 text-primary"
                      aria-label="Protected"
                    />
                  )}
                </div>
                <span className="text-[12px] py-0.5 text-muted-foreground">
                  {meta.label}
                </span>
              </div>

              <span className="hidden w-20 shrink-0 text-right text-xs text-muted-foreground sm:block">
                {file.size}
              </span>
              <span className="hidden w-24 shrink-0 text-right text-xs text-muted-foreground md:block">
                {file.uploadedAt}
              </span>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
