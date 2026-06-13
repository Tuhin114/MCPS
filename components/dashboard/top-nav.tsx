"use client";

import { usePathname } from "next/navigation";

import { getNavMeta } from "@/lib/nav";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotificationPanel } from "@/components/NotificationPanel";

export function TopNav() {
  const pathname = usePathname();
  const meta = getNavMeta(pathname);

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-border bg-background/70 px-4 backdrop-blur-xl md:px-6">
      <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground" />

      <div className="flex flex-col">
        <h1 className="text-sm font-semibold leading-none tracking-tight">
          {meta.title}
        </h1>
        <p className="mt-1 hidden text-[11px] text-muted-foreground sm:block">
          {meta.subtitle}
        </p>
      </div>

      <div className="ml-auto flex items-center gap-2">
        {/* Notification bell with unread badge + popover panel */}
        <NotificationPanel />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-lg p-0.5 outline-none transition-colors hover:bg-surface-hover">
              <Avatar className="size-8 ring-1 ring-border">
                <AvatarFallback className="bg-primary/15 text-xs font-medium text-primary">
                  AC
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel className="flex flex-col gap-0.5">
              <span className="text-sm">Avery Chen</span>
              <span className="text-xs font-normal text-muted-foreground">
                avery@mcps.io
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
