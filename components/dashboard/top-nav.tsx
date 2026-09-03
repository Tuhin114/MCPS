"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-full p-0.5 outline-none transition-transform hover:scale-105">
              <Avatar className="size-9 ring-2 ring-white/10 hover:ring-amber-500/50 shadow-lg transition-all duration-300">
                <AvatarFallback className="bg-gradient-to-br from-amber-400 to-amber-600 text-xs font-black text-black">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-xl border border-white/10 bg-black/90 backdrop-blur-xl shadow-2xl p-2">
            <DropdownMenuLabel className="flex flex-col gap-1 p-2">
              <span className="text-sm font-bold text-foreground overflow-hidden text-ellipsis whitespace-nowrap">{userEmail.split('@')[0]}</span>
              <span className="text-xs font-medium text-muted-foreground/80 overflow-hidden text-ellipsis whitespace-nowrap">
                {userEmail}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/10 my-1" />
            <DropdownMenuItem className="cursor-pointer rounded-lg px-3 py-2 text-sm font-medium hover:bg-white/5 focus:bg-white/5 focus:text-amber-500 transition-colors">
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer rounded-lg px-3 py-2 text-sm font-medium hover:bg-white/5 focus:bg-white/5 focus:text-amber-500 transition-colors">
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer rounded-lg px-3 py-2 text-sm font-medium hover:bg-white/5 focus:bg-white/5 focus:text-amber-500 transition-colors">
              Billing
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/10 my-1" />
            <DropdownMenuItem 
              onClick={handleSignOut}
              className="cursor-pointer rounded-lg px-3 py-2 text-sm font-bold text-red-500 hover:bg-red-500/10 focus:bg-red-500/10 focus:text-red-400 transition-colors"
            >
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
