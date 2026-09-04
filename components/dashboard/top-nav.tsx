"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

import { getNavMeta } from "@/lib/nav";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { NotificationPanel } from "@/components/NotificationPanel";

import { createClient } from "@/lib/supabase/client";

export function TopNav() {
  const pathname = usePathname();
  const meta = getNavMeta(pathname);
  
  const [userEmail, setUserEmail] = useState("Loading...");
  const [initials, setInitials] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) {
        setUserEmail(user.email);
        setInitials(user.email.substring(0, 2).toUpperCase());
      } else {
        setUserEmail("Unknown User");
        setInitials("U");
      }
    });
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 border-b border-white/5 bg-black/40 px-4 backdrop-blur-xl md:px-6">
      <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-amber-500 transition-colors" />

      <div className="flex flex-col">
        <h1 className="text-sm font-bold leading-none tracking-tight text-foreground">
          {meta.title}
        </h1>
        <p className="mt-1 hidden text-xs font-medium text-muted-foreground/80 sm:block">
          {meta.subtitle}
        </p>
      </div>

      <div className="ml-auto flex items-center gap-3">
        {/* Notification bell with unread badge + popover panel */}
        <NotificationPanel />
      </div>
    </header>
  );
}
