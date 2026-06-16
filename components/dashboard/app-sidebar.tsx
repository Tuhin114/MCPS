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
            "h-9 gap-3 rounded-lg px-3 text-[13.5px] font-medium transition-all duration-150",
            "text-sidebar-foreground/60",
            // hover — warm tinted surface, text steps up
            "hover:bg-primary/8 hover:text-sidebar-foreground",
            // active — amber fill, strong text, left-edge accent via box-shadow
            "data-[active=true]:bg-primary/12",
            "data-[active=true]:text-primary",
            "data-[active=true]:font-semibold",
            "data-[active=true]:shadow-[inset_2px_0_0_0_var(--color-primary)]",
          ].join(" ")}
        >
          <Link
            href={item.href}
            onClick={() => isMobile && setOpenMobile(false)}
          >
            <item.icon className="size-[17px] shrink-0" />
            <span>{item.title}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      {/* ── Logo ── */}
      <SidebarHeader className="h-16 border-b border-sidebar-border px-4 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/15 ring-1 ring-primary/25">
            <ShieldCheck className="size-5 text-primary" />
          </div>
          <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
            <span className="text-[14px] font-semibold tracking-tight text-sidebar-foreground">
              MCPS
            </span>
            <span className="text-[11px] font-medium text-muted-foreground/70 tracking-wide uppercase">
              Content Protection
            </span>
          </div>
        </Link>
      </SidebarHeader>

      {/* ── Main nav + account nav pushed to bottom ── */}
      <SidebarContent className="flex flex-col gap-0 overflow-hidden">
        {/* Platform nav fills the top */}
        <SidebarGroup className="flex-1 px-3 pt-5 pb-2">
          <SidebarGroupLabel className="mb-2 px-3 text-[10.5px] font-semibold uppercase tracking-widest text-muted-foreground/50">
            Platform
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {mainNav.map(renderItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Account nav pinned to bottom of scroll area */}
        <SidebarGroup className="mt-auto px-3 pb-3">
          <SidebarGroupLabel className="mb-2 px-3 text-[10.5px] font-semibold uppercase tracking-widest text-muted-foreground/50">
            Account
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {accountNav.map(renderItem)}
            </SidebarMenu>
            <ThemeSwitcher />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* ── Status footer ── */}
      <SidebarFooter className="border-t border-sidebar-border px-4 py-3.5">
        <div className="flex items-center gap-2.5 group-data-[collapsible=icon]:justify-center">
          <span className="relative flex size-2 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-40" />
            <span className="relative inline-flex size-2 rounded-full bg-primary" />
          </span>
          <span className="text-[11.5px] font-medium text-muted-foreground group-data-[collapsible=icon]:hidden">
            All systems secure
          </span>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
