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
          className="data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:font-medium data-[active=true]:shadow-[inset_0_0_0_1px_var(--color-primary)] data-[active=true]:shadow-primary/20"
        >
          <Link
            href={item.href}
            onClick={() => isMobile && setOpenMobile(false)}
          >
            <item.icon className="size-4" />
            <span>{item.title}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border">
        <Link href="/" className="flex items-center gap-2.5 px-1.5 py-2">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-primary/30">
            <ShieldCheck className="size-4.5 text-primary" />
          </div>
          <div className="flex flex-col leading-none group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-semibold tracking-tight text-sidebar-foreground">
              MCPS
            </span>
            <span className="text-[11px] text-muted-foreground">
              Content Protection
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{mainNav.map(renderItem)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{accountNav.map(renderItem)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <div className="flex items-center gap-2 rounded-lg px-1.5 py-1.5 group-data-[collapsible=icon]:justify-center">
          <div className="size-2 rounded-full bg-primary shadow-[0_0_8px_var(--color-primary)]" />
          <span className="text-[11px] text-muted-foreground group-data-[collapsible=icon]:hidden">
            All systems secure
          </span>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
