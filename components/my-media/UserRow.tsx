import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Eye, Download, X } from "lucide-react";
import { avatarColor, getInitials } from "@/lib/helper";

import { LocalSharedUsers, Permission } from "@/types/media";

export function UserRow({
  entry,
  disabled,
  onPermissionChange,
  onRemove,
}: {
  entry: LocalSharedUsers;
  disabled: boolean;
  onPermissionChange: (id: string, permission: Permission) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-border bg-surface hover:bg-muted/30 transition-colors group">
      <Avatar className="h-9 w-9 flex-shrink-0">
        <AvatarFallback
          className={`text-xs font-semibold text-white ${avatarColor(entry.shared_user_id)}`}
        >
          {getInitials(entry.shared_user_name)}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-sm font-medium text-foreground truncate">
            {entry.shared_user_name}
          </p>
          {entry.isNew && (
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-500 border border-amber-500/20">
              NEW
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground truncate">
          {entry.shared_user_email}
        </p>
      </div>

      <Select
        value={entry.permission}
        onValueChange={(val) =>
          onPermissionChange(entry.shared_user_id, val as Permission)
        }
        disabled={disabled}
      >
        <SelectTrigger className="w-[160px] h-8 text-xs bg-card border-border flex-shrink-0">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="view">
            <span className="flex items-center gap-2 text-xs">
              <Eye className="h-3.5 w-3.5" /> View Only
            </span>
          </SelectItem>
          <SelectItem value="download">
            <span className="flex items-center gap-2 text-xs">
              <Download className="h-3.5 w-3.5" /> Download
            </span>
          </SelectItem>
        </SelectContent>
      </Select>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onRemove(entry.shared_user_id)}
        disabled={disabled}
        className="h-8 w-8 p-0 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10"
      >
        <X className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
