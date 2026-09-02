"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { mainNav, accountNav, type NavItem } from "@/lib/nav";
import { ThemeSwitcher } from "../theme-switcher";

export function AppSidebar() {
  const pathname = usePathname();
  const { setOpenMobile, isMobile } = useSidebar();

  const renderItem = (item: NavItem) => {
    const isActive =
      item.href === "/protected"
        ? pathname === "/protected"
        : pathname.startsWith(item.href);
    return (
      <SidebarMenuItem key={item.title}>
        <SidebarMenuButton
          asChild
          isActive={isActive}
          tooltip={item.title}
          className={[
            "h-10 gap-3 rounded-xl px-3 text-sm font-medium transition-all duration-200",
            "text-muted-foreground/80 hover:text-amber-50 hover:bg-white/[0.03]",
            isActive && "bg-amber-500/10 text-amber-500 font-bold shadow-[inset_3px_0_0_0_#f59e0b] hover:bg-amber-500/15"
          ].filter(Boolean).join(" ")}
        >
          <Link
            href={item.href}
            onClick={() => isMobile && setOpenMobile(false)}
          >
            <item.icon className="size-4.5 shrink-0" />
            <span>{item.title}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-white/5 bg-black">
      {/* ── Logo ── */}
      <SidebarHeader className="h-16 border-b border-white/5 px-4 py-4 bg-white/[0.01]">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/20 transition-transform group-hover:scale-105">
            <ShieldCheck className="size-5 text-black" />
          </div>
          <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-bold tracking-tight text-foreground group-hover:text-amber-50 transition-colors">
              MCPS
            </span>
            <span className="text-[10px] font-bold text-amber-500/70 tracking-widest uppercase">
              Protection
            </span>
          </div>
        </Link>
      </SidebarHeader>

      {/* ── Main nav + account nav pushed to bottom ── */}
      <SidebarContent className="flex flex-col gap-0 overflow-hidden bg-transparent">
        {/* Platform nav fills the top */}
        <SidebarGroup className="flex-1 px-3 pt-6 pb-2">
          <SidebarGroupLabel className="mb-3 px-3 text-xs font-bold uppercase tracking-widest text-muted-foreground/50">
            Platform
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1.5">
              {mainNav.map(renderItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Account nav pinned to bottom of scroll area */}
        <SidebarGroup className="mt-auto px-3 pb-4">
          <SidebarGroupLabel className="mb-3 px-3 text-xs font-bold uppercase tracking-widest text-muted-foreground/50">
            Account
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1.5 mb-2">
              {accountNav.map(renderItem)}
            </SidebarMenu>
            <ThemeSwitcher />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* ── Status footer ── */}
      <SidebarFooter className="border-t border-white/5 px-4 py-4 bg-white/[0.01]">
        <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
          <span className="relative flex size-2.5 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-60" />
            <span className="relative inline-flex size-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
          </span>
          <span className="text-xs font-semibold text-muted-foreground group-data-[collapsible=icon]:hidden">
            All systems secure
          </span>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
