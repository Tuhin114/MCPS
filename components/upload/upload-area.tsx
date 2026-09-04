"use client";

import { useRef, useState } from "react";
import { CloudUpload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UploadAreaProps {
  onFilesSelected: (files: File[]) => void;
  fileCount: number;
}

export default function UploadArea({
  onFilesSelected,
  fileCount,
}: UploadAreaProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remaining = 5 - fileCount;
    const filesToAdd = files.slice(0, remaining);
    if (files.length > remaining) {
      alert(`Maximum 5 files allowed. You can add ${remaining} more file(s).`);
    }
    onFilesSelected(filesToAdd);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileChange({
      target: { files: e.dataTransfer.files },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  const isFull = fileCount >= 5;

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onClick={!isFull ? handleClick : undefined}
      className={cn(
        "relative cursor-pointer rounded-2xl border-2 border-dashed border-white/20 px-8 py-12 transition-all duration-200",
        isDragging
          ? "border-amber-500/60 bg-amber-500/10 shadow-[0_0_40px_rgba(245,158,11,0.2)]"
          : "border-white/10 hover:border-amber-500/40 hover:shadow-[0_0_30px_rgba(245,158,11,0.1)] hover:bg-white/[0.04]",
        isFull && "cursor-default opacity-60 pointer-events-none",
      )}
    >
      <input
        title="Select files to upload"
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileChange}
        className="hidden"
        accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.pptx,.txt"
      />

      <div className="flex flex-col items-center gap-5 text-center">
        <div
          className={cn(
            "flex h-16 w-16 items-center justify-center rounded-2xl border transition-colors duration-200",
            isDragging
              ? "border-amber-500/40 bg-amber-500/20"
              : "border-white/10 bg-black/50 backdrop-blur-xl border-white/5",
          )}
        >
          <CloudUpload
            className={cn(
              "h-8 w-8 transition-colors",
              isDragging ? "text-amber-500" : "text-muted-foreground",
            )}
          />
        </div>

        <div className="space-y-1.5">
          <h3 className="text-[15px] font-semibold text-foreground">
            {isDragging ? "Release to add files" : "Drop files here or browse"}
          </h3>
          <p className="text-sm text-muted-foreground">
            Images, Videos, Audio, PDF, DOCX · up to 5 MB each
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="outline"
            className="h-8 rounded-lg border-white/10 bg-black/50 backdrop-blur-xl border-white/5 px-4 text-[13px] font-medium hover:border-amber-500/30 hover:bg-amber-500/10 hover:text-amber-500"
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
          >
            Choose files
          </Button>

          <span
            className={cn(
              "rounded-full border px-3 py-1 text-[12px] font-medium tabular-nums",
              fileCount > 0
                ? "border-amber-500/20 bg-amber-500/10 text-amber-500"
                : "border-white/10 bg-white/[0.05] text-muted-foreground",
            )}
          >
            {fileCount} / 5 selected
          </span>
        </div>
      </div>
    </div>
  );
}

