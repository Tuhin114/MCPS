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
  video: { icon: FileVideo, label: "Video", tint: "text-amber-500" },
  image: { icon: ImageIcon, label: "Image", tint: "text-green-500" },
  audio: { icon: Music, label: "Audio", tint: "text-purple-500" },
  document: { icon: FileText, label: "Document", tint: "text-blue-500" },
};

export function RecentUploads({ data }: { data: RecentUpload[] | undefined }) {
  return (
    <section className="flex h-full flex-col rounded-2xl border border-white/5 bg-black/40 backdrop-blur-xl overflow-hidden shadow-2xl">
      <header className="flex items-center justify-between px-6 py-5 bg-white/[0.02]">
        <div>
          <h2 className="text-base font-bold tracking-tight text-foreground">
            Recent Uploads
          </h2>
          <p className="mt-1 text-xs font-medium text-muted-foreground/80">
            Latest media added to your secure vault
          </p>
        </div>
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="h-8 gap-1 text-xs font-semibold text-amber-500 hover:text-amber-400 hover:bg-amber-500/10 transition-colors"
        >
          <Link href="/media">
            View all
            <ChevronRight className="size-3.5" />
          </Link>
        </Button>
      </header>

      <div className="border-t border-white/5">
        {data?.map((file, i) => {
          const meta = typeMeta[file.type as MediaType];
          const Icon = meta.icon;
          return (
            <motion.div
              key={file.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              className="group flex items-center gap-4 border-b border-white/5 px-6 py-4 transition-colors duration-200 last:border-b-0 hover:bg-white/[0.03]"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-black/50 border border-white/5 shadow-inner">
                <Icon className={`size-4.5 ${meta.tint}`} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm font-semibold text-foreground group-hover:text-amber-50 transition-colors">
                    {file.name}
                  </span>
                  {file.protected && (
                    <Lock
                      className="size-3 shrink-0 text-amber-500"
                      aria-label="Protected"
                    />
                  )}
                </div>
                <span className="text-[12px] font-medium py-0.5 text-muted-foreground/70">
                  {meta.label}
                </span>
              </div>

              <span className="hidden w-20 shrink-0 text-right text-xs font-medium text-muted-foreground/60 sm:block">
                {file.size}
              </span>
              <span className="hidden w-24 shrink-0 text-right text-xs font-medium text-muted-foreground/60 md:block group-hover:text-amber-500/80 transition-colors">
                {file.uploadedAt}
              </span>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
