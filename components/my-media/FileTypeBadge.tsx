import { Badge } from "@/components/ui/badge";
import {
  FileImage,
  FileVideo,
  FileAudio,
  FileText,
  FileSpreadsheet,
  Presentation,
  File,
} from "lucide-react";

interface FileTypeBadgeProps {
  mimeType: string | null;
}

function getFileType(mimeType: string | null) {
  if (!mimeType) {
    return {
      label: "Unknown",
      icon: File,
    };
  }
  if (mimeType.startsWith("image/")) {
    return {
      label: "Image",
      icon: FileImage,
    };
  }

  if (mimeType.startsWith("video/")) {
    return {
      label: "Video",
      icon: FileVideo,
    };
  }

  if (mimeType.startsWith("audio/")) {
    return {
      label: "Audio",
      icon: FileAudio,
    };
  }

  if (mimeType === "application/pdf") {
    return {
      label: "PDF",
      icon: FileText,
    };
  }

  if (mimeType.includes("presentation") || mimeType.includes("powerpoint")) {
    return {
      label: "Presentation",
      icon: Presentation,
    };
  }

  if (mimeType.includes("spreadsheet") || mimeType.includes("excel")) {
    return {
      label: "Spreadsheet",
      icon: FileSpreadsheet,
    };
  }

  if (mimeType.includes("document") || mimeType.includes("word")) {
    return {
      label: "Document",
      icon: FileText,
    };
  }

  return {
    label: "File",
    icon: File,
  };
}

export function FileTypeBadge({ mimeType }: FileTypeBadgeProps) {
  const { label, icon: Icon } = getFileType(mimeType);

  return (
    <Badge variant="outline" className="gap-1.5 font-normal">
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  );
}
