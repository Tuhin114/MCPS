"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

import { MediaToolbar } from "./media-toolbar";
import { MediaTable } from "./media-table";
import type { FileType, MediaStatus } from "@/lib/mcps-data";
import { MediaPagination } from "./pagination";
import { useDownloadMedia, useMediaList } from "@/hooks/useMedia";
import { MyMediaItem } from "@/types/media";

const ITEMS_PER_PAGE = 15;

export default function MyMediaPage() {
  const { data: mediaList, isLoading, isError, error } = useMediaList();
  const { mutate: downloadMedia, error: downloadError } = useDownloadMedia();

  const MediaList = useMemo(() => {
    return mediaList ?? [];
  }, [mediaList]);

  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFileType, setSelectedFileType] = useState<FileType | "all">(
    "all",
  );
  const [selectedStatus, setSelectedStatus] = useState<MediaStatus | "all">(
    "all",
  );
  const [currentPage, setCurrentPage] = useState(1);

  // Local state for optimistic updates (delete/update)
  const [localOverrides, setLocalOverrides] = useState<
    Record<string, Partial<MyMediaItem>>
  >({});
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());

  const mediaItems = useMemo<MyMediaItem[]>(() => {
    return MediaList?.filter((item) => !deletedIds.has(item.id)).map(
      (item) => ({
        ...item,
        ...(localOverrides[item.id] ?? {}),
      }),
    );
  }, [MediaList, localOverrides, deletedIds]);

  const filteredItems = useMemo(() => {
    return mediaItems.filter((item) => {
      const matchesSearch =
        searchQuery === "" ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFileType =
        selectedFileType === "all" || item.fileType === selectedFileType;
      const matchesStatus =
        selectedStatus === "all" || item.status === selectedStatus;
      return matchesSearch && matchesFileType && matchesStatus;
    });
  }, [mediaItems, searchQuery, selectedFileType, selectedStatus]);

  const totalPages = useMemo(
    () => Math.ceil(filteredItems.length / ITEMS_PER_PAGE),
    [filteredItems.length],
  );

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredItems, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  const handleFileTypeFilter = useCallback((fileType: FileType | "all") => {
    setSelectedFileType(fileType);
    setCurrentPage(1);
  }, []);

  const handleStatusFilter = useCallback((status: MediaStatus | "all") => {
    setSelectedStatus(status);
    setCurrentPage(1);
  }, []);

  const handleShare = (item: MyMediaItem, emails: string[]) => {
    console.log(`Sharing ${item.name} with:`, emails);
    // TODO: call share API
  };

  const handleUpdate = (
    item: MyMediaItem,
    name: string,
    encrypted: boolean,
    watermarked: boolean,
    watermarkText: string,
  ) => {
    setLocalOverrides((prev) => ({
      ...prev,
      [item.id]: {
        file_name: name,
        is_encrypted: encrypted,
        is_watermarked: watermarked,
        watermark_text: watermarkText,
      },
    }));
  };

  const handleDelete = (item: MyMediaItem) => {
    setDeletedIds((prev) => new Set(prev).add(item.id));
  };

  const handleDownload = (item: MyMediaItem) => {
    setDownloadingId(item.id);

    downloadMedia(
      {
        id: item.id,
        file_name: item.file_name,
      },
      {
        onError: (error) => {
          toast.error(error.message);
        },
        onSettled: () => {
          setDownloadingId(null);
        },
        onSuccess: () => {
          toast.success("Download started");
        },
      },
    );
  };

  if (isError) {
    return (
      <div className="container mx-auto">
        <Card className="border-border bg-card">
          <CardContent className="flex items-center justify-center min-h-[300px]">
            <p className="text-destructive text-sm">
              {error?.message ?? "Failed to load media"}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <Card className="border-border bg-card py-0">
        <CardContent className="p-4 space-y-4">
          <MediaToolbar
            onSearch={handleSearch}
            onFileTypeFilter={handleFileTypeFilter}
            onStatusFilter={handleStatusFilter}
            searchQuery={searchQuery}
            selectedFileType={selectedFileType}
            selectedStatus={selectedStatus}
          />

          <MediaTable
            items={paginatedItems}
            downloadingId={downloadingId}
            isLoading={isLoading}
            onShare={handleShare}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            onDownload={handleDownload}
          />
          {filteredItems.length > 0 && (
            <div className="border-t border-border pt-4">
              <MediaPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredItems.length}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
