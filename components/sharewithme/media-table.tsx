"use client";

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

import { useState } from "react";
import { useDownloadMedia, useViewContent } from "@/hooks/useMedia";
import { SharedWithMeMedia } from "@/types/share-media";
import { FileTypeBadge } from "../my-media/FileTypeBadge";
import { MediaViewerDrawer } from "../my-media/media-view-drawer";

interface MediaTableProps {
  items: SharedWithMeMedia[];
  isLoading?: boolean;
}

export function MediaTable({ items, isLoading }: MediaTableProps) {
  const [viewingId, setViewingId] = useState<string | null>(null);
  const {
    data: viewData,
    isLoading: isViewLoading,
    isError: isViewError,
    error: viewError,
  } = useViewContent(viewingId ?? "", {
    enabled: !!viewingId, // don't fetch until drawer opens
  });
  const { mutate: download, isPending: isDownloading } = useDownloadMedia();

  const handleView = async (item: SharedWithMeMedia) => {
    setViewingId(item.media_id);
  };

  if (isLoading) {
    return (
      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border bg-muted/40">
              <TableHead className="text-foreground font-semibold">
                Name
              </TableHead>
              <TableHead className="text-foreground font-semibold">
                Size
              </TableHead>
              <TableHead className="text-foreground font-semibold">
                Shared On
              </TableHead>

              <TableHead className="text-foreground font-semibold">
                Type
              </TableHead>
              <TableHead className="text-foreground font-semibold">
                Shared By
              </TableHead>
              <TableHead className="text-right text-foreground font-semibold">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i} className="border-border">
                <TableCell>
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20 ml-auto" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="border border-border rounded-lg overflow-hidden bg-card">
        <div className="flex items-center justify-center min-h-[300px] p-8">
          <div className="text-center">
            <p className="text-muted-foreground text-lg">
              No media files found
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Try adjusting your filters or search query
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-border rounded-lg overflow-x-auto bg-card">
      <Table className="min-w-full table-auto border-collapse border-spacing-0 ">
        <TableHeader className="border-border p-2 bg-card">
          <TableRow className="border-border bg-muted/40">
            <TableHead className="text-foreground font-semibold">
              Name
            </TableHead>
            <TableHead className="text-foreground font-semibold">
              Size
            </TableHead>
            <TableHead className="text-foreground font-semibold">
              Shared On
            </TableHead>
            <TableHead className="text-foreground font-semibold">
              Type
            </TableHead>
            <TableHead className="text-foreground font-semibold">
              Shared By
            </TableHead>
            <TableHead className="text-right text-foreground font-semibold">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow
              key={item.media_id}
              className="border-border hover:bg-muted/30 transition-colors"
            >
              <TableCell className="font-medium text-foreground max-w-xs truncate">
                {item.file_name}
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {formatFileSize(item.size_bytes)}
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {formatDate(item.shared_at)}
              </TableCell>
              <TableCell>
                <FileTypeBadge mimeType={item.mime_type} />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={item.owner.avatar_url ?? ""} />
                    <AvatarFallback>
                      {item.owner.username?.slice(0, 2).toUpperCase() ?? "U"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {item.owner.username}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {item.owner.email}
                    </span>
                  </div>
                </div>
              </TableCell>

              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs font-semibold text-muted-foreground hover:text-primary/80"
                    onClick={() => handleView(item)}
                  >
                    View
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
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
    </div>
  );
}
