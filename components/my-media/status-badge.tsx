import { Lock, ShieldCheck, Globe, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  is_encrypted: boolean;
  is_watermarked: boolean;
  is_public?: boolean;
}

export function StatusBadge({
  is_encrypted,
  is_watermarked,
  is_public,
}: StatusBadgeProps) {
  // Public takes visual priority — it's the highest-exposure state and the
  // thing an owner most needs to notice at a glance, regardless of
  // whatever encryption/watermark settings also apply.
  if (is_public) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11.5px] font-medium",
          "border-green-500/25 bg-green-500/10 text-green-600 dark:text-green-400",
        )}
      >
        <Globe className="h-3 w-3" />
        Public
      </span>
    );
  }

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
      <EyeOff className="h-3 w-3" />
      Private
    </span>
  );
}
