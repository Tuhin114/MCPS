import {
  LayoutDashboard,
  Upload,
  FolderLock,
  Users,
  ScrollText,
  User,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  subtitle: string;
}

export const mainNav: NavItem[] = [
  {
    title: "Dashboard",
    href: "/protected/",
    icon: LayoutDashboard,
    subtitle: "Overview of your protected media",
  },
  {
    title: "Upload Media",
    href: "/protected/upload",
    icon: Upload,
    subtitle: "Add and protect new content",
  },
  {
    title: "My Media",
    href: "/protected/my-media",
    icon: FolderLock,
    subtitle: "Browse your secured library",
  },
  {
    title: "Shared With Me",
    href: "/protected/share-with-me",
    icon: Users,
    subtitle: "Content others shared with you",
  },
  {
    title: "Activity Log",
    href: "/protected/activity",
    icon: ScrollText,
    subtitle: "Full audit trail of events",
  },
];

export const accountNav: NavItem[] = [
  {
    title: "Profile",
    href: "/profile",
    icon: User,
    subtitle: "Manage your account details",
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    subtitle: "Configure platform preferences",
  },
];

export const allNav: NavItem[] = [...mainNav, ...accountNav];

export function getNavMeta(pathname: string): NavItem {
  const match = allNav.find((item) => item.href === pathname);
  return match ?? mainNav[0];
}
