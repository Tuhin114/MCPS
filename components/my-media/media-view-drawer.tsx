"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  Download,
  Lock,
  Droplets,
  FileText,
  FileImage,
  File,
  AlertCircle,
  X,
  Copy,
  Users,
} from "lucide-react";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatFileSize } from "@/lib/dashboard-utils";
import { formatDate } from "@/lib/helper";
import type { useViewContent, useDownloadMedia } from "@/hooks/useMedia";
import { DialogTitle } from "../ui/dialog";
import dynamic from "next/dynamic";
import DocxViewer from "../viewers/docx-viewer";

// ── Types ──────────────────────────────────────────────────────────────────────

type ViewContentData = NonNullable<ReturnType<typeof useViewContent>["data"]>;
type DownloadMutate = ReturnType<typeof useDownloadMedia>["mutate"];

interface MediaViewerDrawerProps {
  open: boolean;
  onClose: () => void;
  data: ViewContentData | null | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isDownloading: boolean;
  onDownload: DownloadMutate;
}

type ViewerKind =
  | "image"
  | "video"
  | "audio"
  | "pdf"
  | "docx"
  | "office"
  | "text"
  | "unsupported";

function resolveViewerKind(mimeType: string): ViewerKind {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType === "application/pdf") return "pdf";
  if (mimeType.startsWith("text/")) return "text";
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.startsWith("audio/")) return "audio";
  if (
    mimeType ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return "docx";
  }
  if (
    [
      "application/msword",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ].includes(mimeType)
  )
    return "office";
  return "unsupported";
}

// File type badge color

function FileTypeBadge({ fileType }: { fileType: string }) {
  const colorMap: Record<string, string> = {
    video: "text-violet-400",
    image: "text-blue-400",
    audio: "text-green-400",
    document: "text-amber-400",
    pdf: "text-red-400",
    presentation: "text-orange-400",
  };
  const color = colorMap[fileType?.toLowerCase()] ?? "text-muted-foreground";
  return <span className={`font-medium capitalize ${color}`}>{fileType}</span>;
}

function ImageViewer({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="flex items-center justify-center w-full h-full bg-black rounded-xl overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="max-w-full max-h-full object-contain"
      />
    </div>
  );
}

function VideoViewer({ src }: { src: string }) {
  return (
    <div className="w-full h-full bg-black rounded-xl overflow-hidden flex items-center justify-center">
      <video src={src} controls className="max-w-full max-h-full rounded-xl" />
    </div>
  );
}

function AudioViewer({ src }: { src: string }) {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <audio src={src} controls className="w-full" />
    </div>
  );
}

const PDFViewer = dynamic(() => import("@/components/viewers/pdf-viewer"), {
  ssr: false,
});

function OfficeViewer({
  contentUrl,
  mimeType,
}: {
  contentUrl: string;
  mimeType: string;
}) {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let revoked = false;
    setLoading(true);
    setError(null);

    fetch(contentUrl)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load file");
        return r.blob();
      })
      .then((blob) => {
        const typedBlob = new Blob([blob], { type: mimeType });
        const url = URL.createObjectURL(typedBlob);
        if (!revoked) setObjectUrl(url);
      })
      .catch((e) => {
        if (!revoked) setError(e.message);
      })
      .finally(() => {
        if (!revoked) setLoading(false);
      });

    return () => {
      revoked = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentUrl]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-full gap-3 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span>Loading document…</span>
      </div>
    );

  if (error)
    return <UnsupportedViewer message={`Could not load document: ${error}`} />;

  return (
    <iframe
      src={objectUrl ?? ""}
      className="w-full h-full rounded-xl border border-border"
      title="Document viewer"
    />
  );
}

function TextViewer({ src }: { src: string }) {
  const [text, setText] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(src)
      .then((r) => r.text())
      .then(setText)
      .finally(() => setLoading(false));
  }, [src]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );

  return (
    <pre className="w-full h-full overflow-auto rounded-xl border border-border bg-muted p-4 text-sm font-mono whitespace-pre-wrap break-words">
      {text}
    </pre>
  );
}

function UnsupportedViewer({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 text-muted-foreground">
      <File className="h-16 w-16 opacity-20" />
      <p className="text-sm text-center">
        {message ?? "Preview is not available for this file type."}
      </p>
      <p className="text-xs">Download the file to open it locally.</p>
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
  valueNode,
  copyable,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
  valueNode?: React.ReactNode;
  copyable?: boolean;
}) {
  const handleCopy = () => {
    if (value) navigator.clipboard.writeText(value);
  };

  return (
    <div className="flex items-center justify-between gap-3 py-3">
      <div className="flex items-center gap-3 text-muted-foreground min-w-0">
        <span className="flex-shrink-0">{icon}</span>
        <span className="text-sm">{label}</span>
      </div>
      <div className="flex items-center gap-1.5 min-w-0">
        {valueNode ?? (
          <span className="text-sm font-medium text-foreground truncate">
            {value}
          </span>
        )}
        {copyable && value && (
          <Button onClick={handleCopy} variant="ghost" size="sm">
            <Copy className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
}

//  Drawer

export function MediaViewerDrawer({
  open,
  onClose,
  data,
  isLoading,
  isError,
  error,
  isDownloading,
  onDownload,
}: MediaViewerDrawerProps) {
  const media = data?.media;
  const contentUrl = data?.contentUrl;
  const permission = data?.permission;

  const viewerKind = media ? resolveViewerKind(media.mime_type) : null;
  const canDownload = permission === "owner" || permission === "download";

  const handleDownload = () => {
    if (!media) return;
    onDownload({ id: media.id, file_name: media.file_name });
  };

  return (
    <Drawer open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogTitle></DialogTitle>
      <DrawerContent className="h-full flex flex-col rounded-t-2xl overflow-hidden focus:outline-none">
        {/* ── Top bar ── */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 flex-shrink-0">
          <h2 className="text-base font-semibold text-foreground truncate max-w-[60%]">
            {isLoading ? "Loading…" : (media?.file_name ?? "File Preview")}
          </h2>
          <Button onClick={onClose} variant="ghost">
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        <div className="flex flex-1 min-h-0 gap-0">
          <div className="flex flex-col w-full max-w-[75%] shrink-0 overflow-y-auto">
            {/* Viewer area */}
            <div className="flex-1 min-h-0 px-5 pb-4">
              {isLoading && (
                <div className="flex items-center justify-center h-full gap-3 text-muted-foreground">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span>Loading preview…</span>
                </div>
              )}

              {(isError || (!isLoading && !data)) && (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-destructive">
                  <AlertCircle className="h-12 w-12 opacity-60" />
                  <p className="text-base font-medium">
                    {error?.message ?? "Failed to load file"}
                  </p>
                </div>
              )}

              {!isLoading && data && media && contentUrl && viewerKind && (
                <div className="h-full rounded-xl overflow-hidden bg-black/40 border border-border/50">
                  {viewerKind === "image" && (
                    <ImageViewer src={contentUrl} alt={media.file_name} />
                  )}
                  {viewerKind === "video" && <VideoViewer src={contentUrl} />}
                  {viewerKind === "audio" && <AudioViewer src={contentUrl} />}
                  {viewerKind === "pdf" && <PDFViewer src={contentUrl} />}
                  {viewerKind === "docx" && <DocxViewer src={contentUrl} />}
                  {viewerKind === "office" && (
                    <OfficeViewer
                      contentUrl={contentUrl}
                      mimeType={media.mime_type}
                    />
                  )}
                  {viewerKind === "text" && <TextViewer src={contentUrl} />}
                  {viewerKind === "unsupported" && (
                    <div className="flex flex-col items-center justify-center h-full gap-4 text-muted-foreground">
                      <FileText className="h-16 w-16 opacity-20" />
                      <p className="text-sm">
                        Preview unavailable for{" "}
                        <span className="font-medium">{media.mime_type}</span>
                      </p>
                      {canDownload && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleDownload}
                          disabled={isDownloading}
                          className="gap-2"
                        >
                          {isDownloading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Download className="h-4 w-4" />
                          )}
                          Download to view
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ── Divider ── */}
          <div className="w-px bg-border flex-shrink-0 my-4" />

          {/* ── Right: Media Details 25% ── */}
          <div className="flex flex-col overflow-y-auto w-full max-w-[25%] min-w-[25%] shrink-0 px-5 pt-4 pb-3">
            {isLoading ? (
              <div className="flex items-center justify-center flex-1">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : media ? (
              <>
                <div className="px-5 pt-1 pb-3">
                  <h3 className="text-sm font-semibold text-foreground">
                    Media Details
                  </h3>
                </div>

                <div className="px-5 divide-y divide-border/60">
                  <DetailRow
                    icon={<FileText className="h-4 w-4" />}
                    label="File Name"
                    value={media.file_name}
                    copyable
                  />
                  <DetailRow
                    icon={<File className="h-4 w-4" />}
                    label="File Type"
                    valueNode={<FileTypeBadge fileType={media.file_type} />}
                  />
                  <DetailRow
                    icon={<FileImage className="h-4 w-4" />}
                    label="File Size"
                    value={formatFileSize(media.size_bytes)}
                  />
                  <DetailRow
                    icon={
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <rect
                          x="3"
                          y="4"
                          width="18"
                          height="18"
                          rx="2"
                          ry="2"
                        />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                    }
                    label="Uploaded On"
                    value={formatDate(media.created_at)}
                  />
                  {typeof media.download_count === "number" && (
                    <DetailRow
                      icon={<Download className="h-4 w-4" />}
                      label="Downloads"
                      value={String(media.download_count)}
                    />
                  )}
                  {media.is_encrypted && media.encryption_algorithm && (
                    <DetailRow
                      icon={<Lock className="h-4 w-4" />}
                      label="Encryption"
                      value={media.encryption_algorithm}
                    />
                  )}
                  {media.is_watermarked && media.watermark_text && (
                    <DetailRow
                      icon={<Droplets className="h-4 w-4" />}
                      label="Watermark"
                      value={media.watermark_text}
                    />
                  )}
                  {permission && permission !== "owner" && (
                    <DetailRow
                      icon={<Users className="h-4 w-4" />}
                      label="Your Access"
                      value={
                        permission === "download"
                          ? "View & Download"
                          : "View only"
                      }
                    />
                  )}
                </div>

                {/* Actions */}
                <div className="mt-auto px-5 pb-6 pt-4 space-y-2.5">
                  <Separator className="mb-4" />
                  {canDownload && (
                    <Button
                      onClick={handleDownload}
                      disabled={isDownloading}
                      className="w-full bg-amber-500 hover:bg-amber-600 text-foreground font-semibold gap-2"
                    >
                      {isDownloading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Download className="h-4 w-4" />
                      )}
                      {isDownloading ? "Downloading…" : "Download File"}
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="w-full gap-2 border-border"
                  >
                    <Users className="h-4 w-4" />
                    Manage Sharing
                  </Button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
