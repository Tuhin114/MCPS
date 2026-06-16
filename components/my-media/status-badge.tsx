import { Lock, ShieldCheck, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  is_encrypted: boolean;
  is_watermarked: boolean;
}

export function StatusBadge({
  is_encrypted,
  is_watermarked,
}: StatusBadgeProps) {
  if (is_watermarked) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11.5px] font-medium",
          "border-primary/25 bg-primary/10 text-primary",
        )}
      >
        <ShieldCheck className="h-3 w-3" />
        Protected
      </span>
    );
  }

  if (is_encrypted) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11.5px] font-medium",
          "border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400",
        )}
      >
        <Lock className="h-3 w-3" />
        Encrypted
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11.5px] font-medium",
        "border-border bg-muted/50 text-muted-foreground",
      )}
    >
      <Globe className="h-3 w-3" />
      Public
    </span>
  );
}
