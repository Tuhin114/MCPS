import {
  FileImage,
  FileVideo,
  FileAudio,
  FileText,
  FileSpreadsheet,
  Presentation,
  File,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FileTypeBadgeProps {
  mimeType: string | null;
}

type FileTypeConfig = {
  label: string;
  icon: React.ElementType;
  classes: string;
};

function getFileType(mimeType: string | null): FileTypeConfig {
  if (!mimeType)
    return {
      label: "Unknown",
      icon: File,
      classes: "bg-muted/60 text-muted-foreground border-border",
    };
  if (mimeType.startsWith("image/"))
    return {
      label: "Image",
      icon: FileImage,
      classes:
        "bg-violet-500/10 text-violet-500 border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-500/20",
    };
  if (mimeType.startsWith("video/"))
    return {
      label: "Video",
      icon: FileVideo,
      classes:
        "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400 dark:border-blue-500/20",
    };
  if (mimeType.startsWith("audio/"))
    return {
      label: "Audio",
      icon: FileAudio,
      classes: "bg-primary/10 text-primary border-primary/20",
    };
  if (mimeType === "application/pdf")
    return {
      label: "PDF",
      icon: FileText,
      classes:
        "bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400 dark:border-red-500/20",
    };
  if (mimeType.includes("presentation") || mimeType.includes("powerpoint"))
    return {
      label: "Slides",
      icon: Presentation,
      classes:
        "bg-orange-500/10 text-orange-600 border-orange-500/20 dark:text-orange-400",
    };
  if (mimeType.includes("spreadsheet") || mimeType.includes("excel"))
    return {
      label: "Sheet",
      icon: FileSpreadsheet,
      classes:
        "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400",
    };
  if (mimeType.includes("document") || mimeType.includes("word"))
    return {
      label: "Doc",
      icon: FileText,
      classes: "bg-sky-500/10 text-sky-600 border-sky-500/20 dark:text-sky-400",
    };
  return {
    label: "File",
    icon: File,
    classes: "bg-muted/60 text-muted-foreground border-border",
  };
}

export function FileTypeBadge({ mimeType }: FileTypeBadgeProps) {
  const { label, icon: Icon, classes } = getFileType(mimeType);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11.5px] font-medium",
        classes,
      )}
    >
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}
