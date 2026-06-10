"use client";

import { useEffect, useState } from "react";
import mammoth from "mammoth";
import { Loader2, FileText } from "lucide-react";

interface DocxViewerProps {
  src: string;
}

export default function DocxViewer({ src }: DocxViewerProps) {
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadDocument = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(src);

        if (!response.ok) {
          throw new Error("Failed to load document");
        }

        const arrayBuffer = await response.arrayBuffer();

        const result = await mammoth.convertToHtml({
          arrayBuffer,
        });

        if (mounted) {
          setHtml(result.value);
        }
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error ? err.message : "Failed to preview document",
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadDocument();

    return () => {
      mounted = false;
    };
  }, [src]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full gap-3 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span>Loading document...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-destructive">
        <FileText className="h-10 w-10 opacity-60" />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto bg-background">
      <div className="mx-auto max-w-4xl p-8">
        <article
          className="prose prose-neutral dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{
            __html: html,
          }}
        />
      </div>
    </div>
  );
}
