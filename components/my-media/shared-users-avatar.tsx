import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SharedWith } from "@/types/media";

interface SharedUsersAvatarProps {
  users: SharedWith[];
  max?: number;
}

export function SharedUsersAvatar({ users, max = 3 }: SharedUsersAvatarProps) {
  const displayedUsers = users.slice(0, max);
  const hiddenUsers = users.slice(max);
  const hiddenCount = hiddenUsers.length;

  console.log("displayedUsers", displayedUsers);
  return (
    <TooltipProvider>
      <AvatarGroup>
        {displayedUsers.map((user) => (
          <Tooltip key={user.shared_with.id}>
            <TooltipTrigger asChild>
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={user.shared_with.avatar_url}
                  alt={user.shared_with.username}
                />
                <AvatarFallback className="bg-amber-500/20 text-amber-700 text-xs font-semibold">
                  {user.shared_with.avatar_url ||
                    user.shared_with.username
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>

            <TooltipContent>
              <div className="text-sm">
                <p className="font-semibold">{user.shared_with.username}</p>
                <p className="text-xs text-muted-foreground">
                  {user.shared_with.email}
                </p>
              </div>
            </TooltipContent>
          </Tooltip>
        ))}

        {hiddenCount > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <AvatarGroupCount>+{hiddenCount}</AvatarGroupCount>
            </TooltipTrigger>

            <TooltipContent>
              <div className="space-y-1">
                {hiddenUsers.map((user) => (
                  <div key={user.shared_with.id}>
                    <p className="font-semibold text-sm">
                      {user.shared_with.username}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user.shared_with.email}
                    </p>
                  </div>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        )}
      </AvatarGroup>
    </TooltipProvider>
  );
}
