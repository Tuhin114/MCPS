"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatFileSize } from "@/lib/dashboard-utils";
import { formatDate } from "@/lib/helper";
import { useDownloadMedia, useViewContent } from "@/hooks/useMedia";
import { SharedWithMeMedia } from "@/types/share-media";
import { FileTypeBadge } from "../my-media/FileTypeBadge";
import { MediaViewerDrawer } from "../my-media/media-view-drawer";
import { Eye, Users } from "lucide-react";

interface MediaTableProps {
  items: SharedWithMeMedia[];
  isLoading?: boolean;
}

function SkeletonRows() {
  return (
    <>
      {[...Array(5)].map((_, i) => (
        <TableRow key={i} className="border-border/60">
          <TableCell className="py-3.5">
            <Skeleton className="h-3.5 w-40" />
          </TableCell>
          <TableCell className="py-3.5">
            <Skeleton className="h-3.5 w-14" />
          </TableCell>
          <TableCell className="py-3.5">
            <Skeleton className="h-3.5 w-24" />
          </TableCell>
          <TableCell className="py-3.5">
            <Skeleton className="h-5 w-16 rounded-md" />
          </TableCell>
          <TableCell className="py-3.5">
            <div className="flex items-center gap-2.5">
              <Skeleton className="h-7 w-7 rounded-full shrink-0" />
              <div className="space-y-1.5">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-2.5 w-32" />
              </div>
            </div>
          </TableCell>
          <TableCell className="py-3.5 text-right">
            <Skeleton className="h-7 w-14 rounded-lg ml-auto" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

export function MediaTable({ items, isLoading }: MediaTableProps) {
  const [viewingId, setViewingId] = useState<string | null>(null);
  const {
    data: viewData,
    isLoading: isViewLoading,
    isError: isViewError,
    error: viewError,
  } = useViewContent(viewingId ?? "", { enabled: !!viewingId });
  const { mutate: download, isPending: isDownloading } = useDownloadMedia();

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <Table className="min-w-full">
          {/* Header — one clear step above card */}
          <TableHeader>
            <TableRow className="border-border/60 bg-muted/50 hover:bg-muted/50">
              {(
                ["Name", "Size", "Shared on", "Type", "Shared by", ""] as const
              ).map((col) => (
                <TableHead
                  key={col}
                  className={[
                    "h-8 border-b border-border/60 py-0 text-[10.5px] font-semibold uppercase tracking-widest text-muted-foreground/60",
                    col === "" ? "text-right pr-4" : "pl-4",
                  ].join(" ")}
                >
                  {col}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <SkeletonRows />
            ) : items.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={6} className="py-24 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-muted/40">
                      <Users className="h-5 w-5 text-muted-foreground/40" />
                    </div>
                    <div>
                      <p className="text-[13.5px] font-medium text-foreground">
                        No shared files
                      </p>
                      <p className="mt-0.5 text-[12px] text-muted-foreground/60">
                        Try adjusting your search or filter
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              items.map((item, idx) => (
                <TableRow
                  key={item.media_id}
                  className={[
                    "group border-border/40 transition-colors duration-100",
                    "hover:bg-accent/60",
                    idx % 2 === 0 ? "bg-transparent" : "bg-muted/10",
                  ].join(" ")}
                >
                  {/* Name */}
                  <TableCell className="max-w-[220px] py-3.5 pl-4">
                    <span className="block truncate text-[13px] font-medium text-foreground">
                      {item.file_name}
                    </span>
                  </TableCell>

                  {/* Size */}
                  <TableCell className="py-3.5 pl-4 text-[12px] tabular-nums text-muted-foreground">
                    {formatFileSize(item.size_bytes)}
                  </TableCell>

                  {/* Shared on */}
                  <TableCell className="py-3.5 pl-4 text-[12px] text-muted-foreground">
                    {formatDate(item.shared_at)}
                  </TableCell>

                  {/* Type */}
                  <TableCell className="py-3.5 pl-4">
                    <FileTypeBadge mimeType={item.mime_type} />
                  </TableCell>

                  {/* Shared by */}
                  <TableCell className="py-3.5 pl-4">
                    <div className="flex items-center gap-2.5">
                      <Avatar className="h-7 w-7 shrink-0 ring-1 ring-border/60">
                        <AvatarImage src={item.owner.avatar_url ?? ""} />
                        <AvatarFallback className="bg-primary/10 text-[10px] font-semibold text-primary">
                          {item.owner.username?.slice(0, 2).toUpperCase() ??
                            "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate text-[12.5px] font-medium leading-tight text-foreground">
                          {item.owner.username}
                        </p>
                        <p className="truncate text-[11px] leading-tight text-muted-foreground/70">
                          {item.owner.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Action */}
                  <TableCell className="py-3.5 pr-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setViewingId(item.media_id)}
                      className="h-7 gap-1.5 rounded-lg border border-transparent px-3 text-[12px] font-medium text-muted-foreground/70 transition-all duration-100 hover:border-primary/25 hover:bg-primary/8 hover:text-primary group-hover:border-border group-hover:text-muted-foreground"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <MediaViewerDrawer
        open={!!viewingId}
        onClose={() => setViewingId(null)}
        data={viewData}
        isLoading={isViewLoading}
        isError={isViewError}
        error={viewError}
        isDownloading={isDownloading}
        onDownload={download}
      />
    </>
  );
}
