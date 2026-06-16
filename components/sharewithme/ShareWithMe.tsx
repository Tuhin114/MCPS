"use client";

import { useState, useMemo, useEffect, useCallback } from "react";

import { useSharedWithMeMedia } from "@/hooks/useSharedWithMe";
import { MediaToolbar } from "./media-toolbar";
import { MediaTable } from "./media-table";
import { MediaPagination } from "../my-media/pagination";
import { FileType } from "@/types/media";

const ITEMS_PER_PAGE = 15;

export default function ShareWithMe() {
  const { data: mediaList, isLoading, isError, error } = useSharedWithMeMedia();

  const MediaList = useMemo(() => mediaList ?? [], [mediaList]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFileType, setSelectedFileType] = useState<FileType | "all">(
    "all",
  );
  const [currentPage, setCurrentPage] = useState(1);

  const filteredItems = useMemo(() => {
    return MediaList.filter((item) => {
      const matchesSearch =
        searchQuery === "" ||
        item.file_name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFileType =
        selectedFileType === "all" || item.file_type === selectedFileType;
      return matchesSearch && matchesFileType;
    });
  }, [MediaList, searchQuery, selectedFileType]);

  const totalPages = useMemo(
    () => Math.ceil(filteredItems.length / ITEMS_PER_PAGE),
    [filteredItems.length],
  );

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredItems.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredItems, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  const handleFileTypeFilter = useCallback((fileType: FileType | "all") => {
    setSelectedFileType(fileType);
    setCurrentPage(1);
  }, []);

  if (isError) {
    return (
      <div className="flex min-h-[180px] items-center justify-center rounded-xl border border-destructive/20 bg-destructive/5 p-8">
        <p className="text-[13px] text-destructive">
          {error?.message ?? "Failed to load shared files"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5 p-6">
      {/* Toolbar */}
      <MediaToolbar
        onSearch={handleSearch}
        onFileTypeFilter={handleFileTypeFilter}
        searchQuery={searchQuery}
        selectedFileType={selectedFileType}
        totalResults={
          searchQuery || selectedFileType !== "all"
            ? filteredItems.length
            : undefined
        }
      />

      {/* Table */}
      <MediaTable items={paginatedItems} isLoading={isLoading} />

      {/* Pagination */}
      {filteredItems.length > ITEMS_PER_PAGE && (
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
    </div>
  );
}
