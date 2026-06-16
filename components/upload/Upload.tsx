"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

import UploadArea from "./upload-area";
import FileCard from "./file-card";
import ProtectionOptions, { ProtectionSettings } from "./protections-options";
import { useUploadMedia } from "@/hooks/useMedia";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface UploadedFile {
  id: string;
  name: string;
  file: File;
  type: "image" | "video" | "audio" | "document";
  size: string;
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
  const router = useRouter();

  const handleFilesSelected = (newFiles: File[]) => {
    const mapped: UploadedFile[] = newFiles.map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      type: getFileType(file),
      size: formatFileSize(file.size),
      file,
      thumbnail: file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : undefined,
    }));
    setFiles((prev) => [...prev, ...mapped].slice(0, 5));
  };

  const handleDeleteFile = (id: string) => {
    setFiles((prev) => {
      const f = prev.find((f) => f.id === id);
      if (f?.thumbnail) URL.revokeObjectURL(f.thumbnail);
      return prev.filter((f) => f.id !== id);
    });
  };

  const handleUpload = async () => {
    if (!files.length) return;
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

      const succeeded = results.filter((r) => r.status === "fulfilled").length;
      const failed = results.filter((r) => r.status === "rejected").length;

      if (succeeded > 0)
        toast.success(
          `${succeeded} file${succeeded > 1 ? "s" : ""} uploaded successfully`,
        );
      if (failed > 0)
        toast.error(`${failed} file${failed > 1 ? "s" : ""} failed to upload`);

      if (failed === 0) {
        setFiles([]);
        router.push("/protected/my-media");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while uploading files");
    } finally {
      setIsUploading(false);
    }
  };

  const slotsLeft = 5 - files.length;

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl space-y-5 px-4 py-8 sm:px-8">
          {/* Upload zone */}
          <UploadArea
            onFilesSelected={handleFilesSelected}
            fileCount={files.length}
          />

          {/* Files section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-[13.5px] font-semibold text-foreground">
                  Selected files
                </h2>
                {files.length > 0 && (
                  <span className="rounded-full border border-primary/20 bg-primary/8 px-2 py-0.5 text-[11px] font-medium text-primary">
                    {files.length} / 5
                  </span>
                )}
              </div>
              {slotsLeft > 0 && files.length > 0 && (
                <span className="text-[12px] text-muted-foreground">
                  {slotsLeft} slot{slotsLeft !== 1 ? "s" : ""} remaining
                </span>
              )}
            </div>

            {files.length > 0 ? (
              <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {files.map((file) => (
                  <FileCard
                    key={file.id}
                    {...file}
                    onDelete={handleDeleteFile}
                  />
                ))}
                {/* Ghost slots */}
                {Array.from({ length: slotsLeft }).map((_, i) => (
                  <div
                    key={`slot-${i}`}
                    onClick={() =>
                      document
                        .querySelector<HTMLInputElement>('input[type="file"]')
                        ?.click()
                    }
                    className="aspect-square cursor-pointer rounded-xl border border-dashed border-border bg-muted/20 transition-colors hover:border-primary/30 hover:bg-primary/5 flex flex-col items-center justify-center gap-1.5"
                  >
                    <span className="text-[11px] text-muted-foreground/60">
                      + Add
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border bg-muted/20 py-10 text-center">
                <p className="text-[13px] font-medium text-muted-foreground">
                  No files selected yet
                </p>
                <p className="mt-1 text-[12px] text-muted-foreground/60">
                  Upload up to 5 files above
                </p>
              </div>
            )}
          </div>

          {/* Protection options */}
          <ProtectionOptions
            settings={protectionSettings}
            onOptionsChange={setProtectionSettings}
          />

          {/* Footer action */}
          <div className="flex items-center justify-between border-t border-border pt-5">
            <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              <span>
                {protectionSettings.encryptFile
                  ? "AES-256 encryption enabled"
                  : "Encryption disabled"}
                {protectionSettings.addWatermark && " · Watermark on"}
              </span>
            </div>

            <Button
              onClick={handleUpload}
              disabled={isUploading || files.length === 0}
              size="default"
              className={cn(
                "gap-2 rounded-lg px-6 text-[13.5px] font-semibold transition-all",
                "bg-primary text-primary-foreground hover:bg-primary/90",
                "disabled:opacity-40",
              )}
            >
              <Upload className="h-4 w-4" />
              {isUploading
                ? "Uploading…"
                : `Upload ${files.length > 0 ? `${files.length} file${files.length > 1 ? "s" : ""}` : ""}`}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
