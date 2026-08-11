"use client";

import { usePublicMedia } from "@/hooks/usePublicMedia";
import { Loader2, Lock, Download, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function PublicMediaClient({ id }: { id: string }) {
  const { data, isLoading, isError, error } = usePublicMedia(id);

  if (isLoading) {
    return (
      <Centered>
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground mt-3">Loading file…</p>
      </Centered>
    );
  }

  if (isError || !data) {
    return (
      <Centered>
        <Lock className="h-8 w-8 text-muted-foreground" />
        <p className="text-sm font-medium mt-3">
          {error?.message || "This file is not publicly accessible"}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          The owner may have turned off public sharing, or the link is
          incorrect.
        </p>
      </Centered>
    );
  }

  const { media, contentUrl } = data;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">{media.file_name}</p>
          <p className="text-xs text-muted-foreground">
            {formatBytes(media.size_bytes)} · Shared publicly
          </p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {/* <ReportDialog mediaId={media.id} /> */}
          <Button asChild size="sm" variant="outline">
            <a href={contentUrl} download={media.file_name}>
              <Download className="h-3.5 w-3.5 mr-1.5" />
              Download
            </a>
          </Button>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <MediaPreview
          mimeType={media.mime_type}
          fileName={media.file_name}
          contentUrl={contentUrl}
        />
      </main>
    </div>
  );
}

function MediaPreview({
  mimeType,
  fileName,
  contentUrl,
}: {
  mimeType: string;
  fileName: string;
  contentUrl: string;
}) {
  if (mimeType.startsWith("image/")) {
    return (
      <Image
        src={contentUrl}
        alt={fileName}
        width={800}
        height={600}
        className="max-h-[80vh] max-w-full rounded-lg border border-border object-contain"
      />
    );
  }

  if (mimeType.startsWith("video/")) {
    return (
      <video
        src={contentUrl}
        controls
        className="max-h-[80vh] max-w-full rounded-lg border border-border"
      />
    );
  }

  if (mimeType.startsWith("audio/")) {
    return (
      <div className="w-full max-w-md">
        <audio src={contentUrl} controls className="w-full" />
      </div>
    );
  }

  if (mimeType === "application/pdf") {
    return (
      <iframe
        src={contentUrl}
        title={fileName}
        className="w-full h-[80vh] max-w-4xl rounded-lg border border-border"
      />
    );
  }

  // Fallback for docx / zip / unknown types — no inline renderer, offer download.
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <AlertCircle className="h-8 w-8 text-muted-foreground" />
      <p className="text-sm text-muted-foreground max-w-xs">
        Preview isn&apos;t available for this file type. Download it to view.
      </p>
      <Button asChild>
        <a href={contentUrl} download={fileName}>
          <Download className="h-3.5 w-3.5 mr-1.5" />
          Download {fileName}
        </a>
      </Button>
    </div>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      {children}
    </div>
  );
}

function formatBytes(bytes: number): string {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}
