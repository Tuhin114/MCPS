"use client";

import { useRef } from "react";
import { Cloud } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UploadAreaProps {
  onFilesSelected: (files: File[]) => void;
  fileCount: number;
}

export default function UploadArea({
  onFilesSelected,
  fileCount,
}: UploadAreaProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remaining = 5 - fileCount;
    const filesToAdd = files.slice(0, remaining);

    if (files.length > remaining) {
      alert(`Maximum 5 files allowed. You can add ${remaining} more file(s).`);
    }

    onFilesSelected(filesToAdd);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    handleFileChange({
      target: { files: e.dataTransfer.files },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={handleClick}
      className="
      group
      relative
      cursor-pointer
      overflow-hidden
      rounded-2xl
      border-2
      border-dashed
      border-primary/20
      bg-card
      px-8
      py-14
      transition-all
      duration-300
      hover:border-primary/40
      hover:bg-surface-hover
      hover:shadow-lg
      hover:shadow-primary/5
    "
    >
      {/* Glow */}
      <div
        className="
        absolute
        inset-0
        bg-gradient-to-br
        from-primary/[0.03]
        via-transparent
        to-transparent
        opacity-0
        transition-opacity
        duration-300
        group-hover:opacity-100
      "
      />

      <input
        title="Select files to upload"
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileChange}
        className="hidden"
        accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.pptx,.txt"
      />

      <div className="relative flex flex-col items-center text-center">
        <div
          className="
          mb-6
          flex
          h-20
          w-20
          items-center
          justify-center
          rounded-2xl
          border
          border-primary/20
          bg-primary/10
        "
        >
          <Cloud className="h-10 w-10 text-primary" />
        </div>

        <h3 className="text-xl font-semibold text-foreground">
          Drag & Drop files here
        </h3>

        <p className="mt-2 text-sm text-muted-foreground">
          or choose files from your device
        </p>

        <Button
          size="lg"
          className="
          mt-6
          bg-primary
          text-primary-foreground
          hover:bg-primary/90
        "
        >
          Choose Files
        </Button>

        <div className="mt-6 space-y-1">
          <p className="text-sm text-muted-foreground">
            Images, Videos, Audio, PDF, DOCX
          </p>

          <p className="text-xs text-muted-foreground">
            Maximum 5 files • Up to 5 MB each
          </p>
        </div>

        <div
          className="
          mt-6
          rounded-full
          border
          border-primary/20
          bg-primary/10
          px-4
          py-1.5
          text-sm
          font-medium
          text-primary
        "
        >
          {fileCount}/5 Files Selected
        </div>
      </div>
    </div>
  );
}
