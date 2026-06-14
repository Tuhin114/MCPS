import { Loader2 } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { avatarColor, getInitials } from "@/lib/helper";

export function SuggestionsDropdown({
  isLoading,
  show,
  suggestions,
  onSelect,
}: {
  isLoading: boolean;
  show: boolean;
  suggestions: {
    id: string;
    username: string;
    email: string;
    avatar_url: string;
  }[];
  onSelect: (user: {
    id: string;
    username: string;
    email: string;
    avatar_url: string;
  }) => void;
}) {
  if (!show && !isLoading) return null;

  return (
    <div className="absolute top-[38px] left-0 right-[100px] bg-card border border-border rounded-lg shadow-xl z-50 overflow-hidden">
      {isLoading ? (
        <div className="flex items-center justify-center h-10">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        </div>
      ) : show && suggestions.length > 0 ? (
        suggestions.map((user) => (
          <button
            key={user.id}
            onMouseDown={() => onSelect(user)}
            className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-muted/40 transition-colors border-b border-border last:border-b-0 text-left"
          >
            <Avatar className="h-7 w-7 flex-shrink-0">
              <AvatarImage src={user.avatar_url} alt={user.username} />
              <AvatarFallback
                className={`text-[10px] font-semibold text-white ${avatarColor(user.id)}`}
              >
                {getInitials(user.username)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xs font-medium text-foreground">
                {user.username}
              </p>
              <p className="text-[11px] text-muted-foreground">{user.email}</p>
            </div>
          </button>
        ))
      ) : null}
    </div>
  );
}
