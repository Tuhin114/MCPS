import { FileText, FileVideo, ImageIcon, Music, type LucideIcon } from "lucide-react"

import type { MediaType } from "@/lib/mcps-data"

export const typeMeta: Record<MediaType, { icon: LucideIcon; label: string; tint: string }> = {
  video: { icon: FileVideo, label: "Video", tint: "text-chart-1" },
  image: { icon: ImageIcon, label: "Image", tint: "text-chart-2" },
  audio: { icon: Music, label: "Audio", tint: "text-chart-4" },
  document: { icon: FileText, label: "Document", tint: "text-chart-5" },
}
