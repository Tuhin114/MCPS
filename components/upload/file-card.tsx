"use client";

import { Music, FileText, Play, X } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface FileCardProps {
  id: string;
  name: string;
  type: "image" | "video" | "audio" | "document";
  size: string;
  thumbnail?: string;
  onDelete: (id: string) => void;
}

const TYPE_META: Record<
  string,
  { label: string; bg: string; icon: React.ReactNode }
> = {
  audio: {
    label: "Audio",
    bg: "bg-amber-950/60",
    icon: <Music className="h-7 w-7 text-amber-400" />,
  },
  document: {
    label: "Document",
    bg: "bg-primary/8",
    icon: <FileText className="h-7 w-7 text-primary" />,
  },
};

export default function FileCard({
  id,
  name,
  type,
  size,
  thumbnail,
  onDelete,
}: FileCardProps) {
  const renderThumbnail = () => {
    if (type === "image" && thumbnail) {
      return (
        <Image
          src={thumbnail}
          alt={name}
          className="h-full w-full object-cover"
          width={300}
          height={300}
        />
      );
    }

    if (type === "video" && thumbnail) {
      return (
        <div className="relative h-full w-full">
          <Image
            width={300}
            height={300}
            src={thumbnail}
            alt={name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm ring-1 ring-white/20">
              <Play className="h-4 w-4 fill-white text-white translate-x-0.5" />
            </div>
          </div>
        </div>
      );
    }

    const meta = TYPE_META[type];
    if (meta) {
      return (
        <div
          className={cn(
            "flex h-full w-full items-center justify-center",
            meta.bg,
          )}
        >
          {meta.icon}
        </div>
      );
    }

    return <div className="h-full w-full bg-muted" />;
  };

  const typeLabel =
    TYPE_META[type]?.label ?? type.charAt(0).toUpperCase() + type.slice(1);

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card transition-all duration-200 hover:border-primary/30 hover:shadow-[0_0_0_1px_hsl(var(--primary)/0.15)]">
      {/* Thumbnail */}
      <div className="relative aspect-square overflow-hidden bg-muted/40">
        {renderThumbnail()}

        {/* Type pill */}
        <div className="absolute bottom-2 left-2">
          <span className="rounded-md border border-primary/20 bg-background/80 px-1.5 py-0.5 text-[10px] font-medium text-primary backdrop-blur-sm">
            {typeLabel}
          </span>
        </div>

        {/* Delete */}
        <button
          onClick={() => onDelete(id)}
          className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-md border border-border/60 bg-background/80 text-muted-foreground opacity-0 backdrop-blur-sm transition-all duration-150 hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
          aria-label="Remove file"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Meta */}
      <div className="px-3 py-2.5">
        <p className="truncate text-[12.5px] font-medium text-foreground">
          {name}
        </p>
        <p className="mt-0.5 text-[11px] text-muted-foreground">{size}</p>
      </div>
    </div>
  );
}
