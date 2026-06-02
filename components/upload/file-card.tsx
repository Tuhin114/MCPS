"use client";

import { Trash2, Music, FileText, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

interface FileCardProps {
  id: string;
  name: string;
  type: "image" | "video" | "audio" | "document";
  size: string;
  thumbnail?: string;
  onDelete: (id: string) => void;
}

export default function FileCard({
  id,
  name,
  type,
  size,
  thumbnail,
  onDelete,
}: FileCardProps) {
  //   const getTypeLabel = (type: string) => {
  //     const labels: Record<string, string> = {
  //       image: "Image",
  //       video: "Video",
  //       audio: "Audio",
  //       document: "Document",
  //     };
  //     return labels[type] || type;
  //   };

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
            <Play className="h-12 w-12 text-white fill-white" />
          </div>
        </div>
      );
    }

    if (type === "audio") {
      return (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-900 to-amber-950">
          <div className="text-center">
            <Music className="mx-auto h-8 w-8 text-amber-400" />
            <div className="mt-2 h-8 w-full space-y-1 px-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-1 bg-amber-400/50 rounded" />
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (type === "document") {
      return (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-red-600 to-red-700">
          <FileText className="h-12 w-12 text-white" />
        </div>
      );
    }

    return <div className="h-full w-full bg-gray-700" />;
  };

  return (
    <Card
      className="
      group
      overflow-hidden
      rounded-xl
      border-border
      bg-card
      transition-all
      duration-200
      hover:border-primary/30
      hover:bg-surface-hover
      hover:shadow-lg
      hover:shadow-primary/5
    "
    >
      <div className="relative">
        <div className="aspect-square overflow-hidden bg-surface">
          {renderThumbnail()}
        </div>

        {/* Delete Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(id)}
          className="
          absolute
          right-3
          top-3
          h-8
          w-8
          rounded-lg
          border
          border-red-500/20
          bg-black/60
          text-red-400
          backdrop-blur-md
          transition-all
          hover:border-red-500/40
          hover:bg-red-500/10
          hover:text-red-300
        "
        >
          <Trash2 className="h-4 w-4" />
        </Button>

        {/* Type Badge */}
        {/* <div className="absolute left-3 top-3">
          <Badge
            className="
            border-primary/20
            bg-primary/10
            text-primary
            backdrop-blur-md
          "
          >
            {getTypeLabel(type)}
          </Badge>
        </div> */}
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <h4
            className="
            line-truncate
            text-sm
            font-medium
            text-foreground"
          >
            {name}
          </h4>

          <div className="flex items-center justify-between">
            <span
              className="
              text-xs
              text-muted-foreground
            "
            >
              {size}
            </span>

            <span
              className="
              text-xs
              font-medium
              text-primary
            "
            >
              Protected
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
