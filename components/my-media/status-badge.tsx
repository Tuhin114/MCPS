import { Badge } from "@/components/ui/badge";
import { Lock, Shield, Globe } from "lucide-react";

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
      <Badge
        variant="outline"
        className="gap-1.5 bg-blue-500/30  text-white border-400 border-blue-500/20"
      >
        <Shield className="h-3 w-3" />
        Watermarked
      </Badge>
    );
  }

  if (is_encrypted) {
    return (
      <Badge
        variant="outline"
        className="gap-1.5 bg-amber-500/5 text-amber-400 border-amber-500/20"
      >
        <Lock className="h-3 w-3" />
        Encrypted
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className="gap-1.5 bg-green-500/5 text-green-400 border-green-500/20muted-foreground"
    >
      <Globe className="h-3 w-3" />
      Public
    </Badge>
  );
}
