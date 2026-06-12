"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  Loader2,
  FileText,
  FileImage,
  File,
  AlertCircle,
  Copy,
  CheckCheck,
  Globe,
} from "lucide-react";

import { formatFileSize } from "@/lib/dashboard-utils";
import { formatDate } from "@/lib/helper";
import DocxViewer from "@/components/viewers/docx-viewer";
import { usePublicMedia } from "@/hooks/usePublicMedia";
import { useParams } from "next/navigation";

// ── Viewer helpers (copied from media-view-drawer) ────────────────────────────

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
  )
    return "docx";
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

const PDFViewer = dynamic(() => import("@/components/viewers/pdf-viewer"), {
  ssr: false,
});

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

function OfficeViewer({
  contentUrl,
  mimeType,
}: {
  contentUrl: string;
  mimeType: string;
}) {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let revoked = false;
    setLoading(true);
    setErr(null);

    fetch(contentUrl)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load file");
        return r.blob();
      })
      .then((blob) => {
        const url = URL.createObjectURL(new Blob([blob], { type: mimeType }));
        if (!revoked) setObjectUrl(url);
      })
      .catch((e) => {
        if (!revoked) setErr(e.message);
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

  if (err)
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
        <File className="h-12 w-12 opacity-20" />
        <p className="text-sm">Could not load document: {err}</p>
      </div>
    );

  return (
    <iframe
      src={objectUrl ?? ""}
      className="w-full h-full rounded-xl border border-border"
      title="Document viewer"
    />
  );
}

// ── Detail row (same as drawer) ───────────────────────────────────────────────

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
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-start gap-2.5 py-2.5">
      <span className="text-muted-foreground mt-0.5 flex-shrink-0">{icon}</span>
      <div className="flex flex-col gap-0.5 min-w-0 flex-1">
        <span className="text-xs text-muted-foreground">{label}</span>
        {valueNode ?? (
          <span className="text-sm text-foreground break-words">
            {value ?? "—"}
          </span>
        )}
      </div>
      {copyable && value && (
        <button
          onClick={handleCopy}
          className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
          title="Copy"
        >
          {copied ? (
            <CheckCheck className="h-3.5 w-3.5 text-green-500" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </button>
      )}
    </div>
  );
}

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

// ── Page ──────────────────────────────────────────────────────────────────────

export default function PublicMediaPage() {
  const params = useParams();

  const mediaId = params.mediaId as string;

  // Step 1: check public access + get metadata/contentUrl
  const { data, isLoading, isError, error } = usePublicMedia(mediaId);

  const media = data?.media;
  const contentUrl = data?.contentUrl;
  const permission = data?.permission;

  const viewerKind = media ? resolveViewerKind(media.mime_type) : null;

  // ── Full-page layout mirrors the drawer (75/25 split) ─────────────────────

  return (
    <div className="h-full w-full bg-background flex flex-col">
      {/* ── Top bar ── */}
      <header className="flex items-center justify-between px-5 py-3 border-b border-border flex-shrink-0 bg-card">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <h1 className="text-base font-semibold text-foreground truncate">
            {isLoading ? "Loading…" : (media?.file_name ?? "File Preview")}
          </h1>
        </div>
      </header>

      {/* ── Body: viewer (75%) + details sidebar (25%) ── */}
      <div className="flex flex-1 min-h-0">
        {/* Left — viewer */}
        <div className="flex flex-col w-full lg:max-w-[75%] shrink-0 overflow-y-auto p-5">
          <div className="flex-1 min-h-[60vh] lg:min-h-0">
            {/* Loading */}
            {isLoading && (
              <div className="flex items-center justify-center h-full min-h-[50vh] gap-3 text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span>Loading preview…</span>
              </div>
            )}

            {/* Error / not found */}
            {isError && (
              <div className="flex flex-col items-center justify-center h-full min-h-[50vh] gap-4 text-destructive">
                <AlertCircle className="h-12 w-12 opacity-60" />
                <p className="text-base font-medium text-center">
                  {error?.message ?? "This file is not publicly accessible"}
                </p>
                <p className="text-sm text-muted-foreground text-center">
                  The link may have expired or the file is no longer shared
                  publicly.
                </p>
              </div>
            )}

            {/* Viewer */}
            {!isLoading && data && media && contentUrl && viewerKind && (
              <div className="h-full min-h-[60vh] rounded-xl overflow-hidden bg-black/40 border border-border/50">
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
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="hidden lg:block w-px bg-border flex-shrink-0 my-4" />

        {/* Right — details sidebar */}
        <div className="hidden lg:flex flex-col overflow-y-auto w-full max-w-[25%] min-w-[25%] shrink-0 px-5 pt-5 pb-6">
          {isLoading ? (
            <div className="flex items-center justify-center flex-1">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : media ? (
            <>
              <div className="pb-3">
                <h2 className="text-sm font-semibold text-foreground">
                  File Details
                </h2>
              </div>

              <div className="divide-y divide-border/60">
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
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  }
                  label="Uploaded On"
                  value={formatDate(media.created_at)}
                />

                <DetailRow
                  icon={<Globe className="h-4 w-4" />}
                  label="Access"
                  value={
                    permission === "download" ? "View & Download" : "View only"
                  }
                />
              </div>
            </>
          ) : null}
        </div>
      </div>

      {/* ── Mobile: details below the viewer ── */}
      {!isLoading && media && (
        <div className="lg:hidden border-t border-border px-5 py-4 space-y-1 bg-card">
          <h2 className="text-sm font-semibold text-foreground mb-3">
            File Details
          </h2>
          <div className="divide-y divide-border/60">
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
              icon={<Globe className="h-4 w-4" />}
              label="Access"
              value={
                permission === "download" ? "View & Download" : "View only"
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
