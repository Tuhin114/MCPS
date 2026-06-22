"use client";

import { usePathname } from "next/navigation";

import { getNavMeta } from "@/lib/nav";
import { SidebarTrigger } from "@/components/ui/sidebar";
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
      </div>
    </header>
  );
}
