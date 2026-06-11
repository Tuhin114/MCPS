"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// import { DUMMY_FILES } from "@/lib/mcps-data";
import UploadArea from "./upload-area";
import FileCard from "./file-card";
import ProtectionOptions, { ProtectionSettings } from "./protections-options";
import { useUploadMedia } from "@/hooks/useMedia";

interface UploadedFile {
  id: string;
  name: string;
  file: File;
  type: "image" | "video" | "audio" | "document";
  size: string;
  encryption?: boolean;
  watermark?: boolean;
  watermarkText?: string;
  thumbnail?: string;
}

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getFileType = (file: File): "image" | "video" | "audio" | "document" => {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
  if (file.type.startsWith("audio/")) return "audio";

  return "document";
};

export default function UploadMediaPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [protectionSettings, setProtectionSettings] =
    useState<ProtectionSettings>({
      encryptFile: true,
      addWatermark: true,
      watermarkText: "© My Content - All Rights Reserved",
    });
  const [isUploading, setIsUploading] = useState(false);

  const { mutateAsync: uploadMedia } = useUploadMedia();

  const handleFilesSelected = (newFiles: File[]) => {
    const mappedFiles: UploadedFile[] = newFiles.map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      type: getFileType(file),
      size: formatFileSize(file.size),
      file,
      encryption: protectionSettings.encryptFile,
      watermark: protectionSettings.addWatermark,
      watermarkText: protectionSettings.watermarkText,
      thumbnail: file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : undefined,
    }));

    setFiles((prev) => [...prev, ...mappedFiles].slice(0, 5));
  };

  const handleDeleteFile = (id: string) => {
    setFiles((prev) => {
      const fileToDelete = prev.find((file) => file.id === id);

      if (fileToDelete?.thumbnail) {
        URL.revokeObjectURL(fileToDelete.thumbnail);
      }

      return prev.filter((file) => file.id !== id);
    });
  };

  const handleProtectionChange = (settings: ProtectionSettings) => {
    setProtectionSettings(settings);
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      return;
    }

    setIsUploading(true);

    try {
      const results = await Promise.allSettled(
        files.map((item) =>
          uploadMedia({
            file: item.file,
            encryption: protectionSettings.encryptFile,
            watermark: protectionSettings.addWatermark,
            watermarkText: protectionSettings.watermarkText,
          }),
        ),
      );

      const successfulUploads = results.filter(
        (result) => result.status === "fulfilled",
      ).length;

      const failedUploads = results.filter(
        (result) => result.status === "rejected",
      ).length;

      console.log(`${successfulUploads} uploaded, ${failedUploads} failed`);

      if (successfulUploads > 0) {
        setFiles([]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <main className="flex-1 overflow-y-auto">
        {/* Content */}
        <div className="space-y-4 px-4 sm:px-8 lg:px-12 py-6">
          {/* Upload Area */}
          <Card className="border border-gray-700 bg-transparent p-8">
            <UploadArea
              onFilesSelected={handleFilesSelected}
              fileCount={files.length}
            />
          </Card>

          {/* Files Grid */}
          {files.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">
                  Selected Files ({files.length}/5)
                </h2>
                <span className="text-sm text-gray-400">
                  You can upload up to 5 files
                </span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                {files.map((file) => (
                  <FileCard
                    key={file.id}
                    {...file}
                    onDelete={handleDeleteFile}
                  />
                ))}
              </div>
            </div>
          ) : (
            <Card className="border border-gray-700 bg-gray-900/50 p-12 text-center">
              <p className="text-gray-400">No files selected</p>
              <p className="text-sm text-gray-500">
                Upload up to 5 files to preview them here
              </p>
            </Card>
          )}

          {/* Protection Options */}
          <ProtectionOptions
            settings={protectionSettings}
            onOptionsChange={handleProtectionChange}
          />

          {/* Upload Button */}
          <div className="flex justify-start pt-4">
            <Button
              onClick={handleUpload}
              className="gap-2 bg-primary text-primary-foreground text-md"
              size="lg"
            >
              {isUploading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
