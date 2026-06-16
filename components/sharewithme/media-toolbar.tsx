"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Loader2, SlidersHorizontal } from "lucide-react";
import { FileType } from "@/types/media";

interface MediaToolbarProps {
  onSearch: (query: string) => void;
  onFileTypeFilter: (fileType: FileType | "all") => void;
  searchQuery: string;
  selectedFileType: FileType | "all";
  totalResults?: number;
}

export function MediaToolbar({
  onSearch,
  onFileTypeFilter,
  searchQuery,
  selectedFileType,
  totalResults,
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

  const hasActiveFilter = selectedFileType !== "all" || localQuery !== "";
  const isTypeFiltered = selectedFileType !== "all";

  return (
    <div className="flex items-center gap-2">
      {/* Search — distinct input background */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/50" />
        <Input
          placeholder="Search by name…"
          value={localQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="h-9 pl-9 pr-9 text-[13px] bg-card border-border placeholder:text-muted-foreground/40 focus-visible:ring-1 focus-visible:ring-primary/40 focus-visible:border-primary/40 transition-colors"
        />
        {isSearching && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-primary/60" />
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="h-5 w-px bg-border shrink-0" />

      {/* Type filter — clearly different surface */}
      <div className="flex items-center gap-1.5">
        <SlidersHorizontal className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
        <Select
          value={selectedFileType}
          onValueChange={(value) => onFileTypeFilter(value as FileType | "all")}
        >
          <SelectTrigger
            className={[
              "h-9 w-[130px] text-[12.5px] transition-colors",
              isTypeFiltered
                ? "border-primary/30 bg-primary/8 text-primary font-medium"
                : "border-border bg-card text-muted-foreground hover:text-foreground",
            ].join(" ")}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="border-border bg-popover text-popover-foreground shadow-xl">
            {[
              "all",
              "image",
              "video",
              "audio",
              "document",
              "pdf",
              "presentation",
            ].map((val) => (
              <SelectItem
                key={val}
                value={val}
                className="text-[12.5px] focus:bg-accent focus:text-accent-foreground"
              >
                {val === "all"
                  ? "All types"
                  : val.charAt(0).toUpperCase() + val.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Live result count — only while filtering */}
      {hasActiveFilter && totalResults !== undefined && (
        <span className="shrink-0 rounded-full border border-border bg-muted/40 px-2.5 py-1 text-[11px] font-medium text-muted-foreground tabular-nums">
          {totalResults} result{totalResults !== 1 ? "s" : ""}
        </span>
      )}
    </div>
  );
}
