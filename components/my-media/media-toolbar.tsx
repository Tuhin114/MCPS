"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Upload } from "lucide-react";
import { MediaStatus, FileType } from "@/types/media";
import Link from "next/link";

interface MediaToolbarProps {
  onSearch: (query: string) => void;
  onFileTypeFilter: (fileType: FileType | "all") => void;
  onStatusFilter: (status: MediaStatus | "all") => void;
  searchQuery: string;
  selectedFileType: FileType | "all";
  selectedStatus: MediaStatus | "all";
}

export function MediaToolbar({
  onSearch,
  onFileTypeFilter,
  onStatusFilter,
  searchQuery,
  selectedFileType,
  selectedStatus,
}: MediaToolbarProps) {
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(localQuery);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [localQuery]);

  const handleSearchChange = (value: string) => {
    setLocalQuery(value);
    setIsSearching(true);
  };

  return (
    <div className="flex gap-3">
      {/* Search Bar */}
      <div className="relative flex-1 bg-surface border-border rounded-md overflow-hidden">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search media..."
          value={localQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10 bg-surface border-border"
        />
        {isSearching && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
          </div>
        )}
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3 flex-1">
          <Select
            value={selectedFileType}
            onValueChange={(value) =>
              onFileTypeFilter(value as FileType | "all")
            }
          >
            <SelectTrigger className="w-full sm:w-[150px] bg-surface border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="image">Image</SelectItem>
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="audio">Audio</SelectItem>
              <SelectItem value="document">Document</SelectItem>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="presentation">Presentation</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={selectedStatus}
            onValueChange={(value) =>
              onStatusFilter(value as MediaStatus | "all")
            }
          >
            <SelectTrigger className="w-full sm:w-[150px] bg-surface border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="fully-protected">Protected</SelectItem>
              <SelectItem value="encrypted">Encrypted</SelectItem>
              <SelectItem value="public">Public</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Upload Button */}
        <Button className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-foreground gap-2">
          <Upload className="h-4 w-4" />
          <Link href="/protected/upload"> Upload New</Link>
        </Button>
      </div>
    </div>
  );
}
