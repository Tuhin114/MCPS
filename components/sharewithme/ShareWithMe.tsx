"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import type { FileType } from "@/lib/mcps-data";

import { useSharedWithMeMedia } from "@/hooks/useSharedWithMe";
import { MediaToolbar } from "./media-toolbar";
import { MediaTable } from "./media-table";
import { MediaPagination } from "../my-media/pagination";

const ITEMS_PER_PAGE = 15;

export default function ShareWithMe() {
  const { data: mediaList, isLoading, isError, error } = useSharedWithMeMedia();

  const MediaList = useMemo(() => {
    return mediaList ?? [];
  }, [mediaList]);

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
            searchQuery={searchQuery}
            selectedFileType={selectedFileType}
          />

          <MediaTable items={paginatedItems} isLoading={isLoading} />
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
