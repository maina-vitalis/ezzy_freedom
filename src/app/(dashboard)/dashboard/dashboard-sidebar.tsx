import {
  Calendar,
  CirclePlus,
  ClipboardPlus,
  CreditCard,
  LayoutDashboard,
  Library,
  NotebookPen,
  PenLine,
  User,
} from "lucide-react";

import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";

export async function DashboardSidebar() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) return null;

  const user = session.user;
  const isAdmin = user.role === "ADMIN";

  const userItems = [
    {
      title: "Overview",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Profile",
      url: "/dashboard/profile",
      icon: User,
    },
    {
      title: "My Library",
      url: "/dashboard/library",
      icon: Library,
    },
    {
      title: "Appointments",
      url: "/dashboard/appointments",
      icon: Calendar,
    },
  ];

  const adminItems = [
    {
      title: "Transactions",
      url: "/dashboard/transactions",
      icon: CreditCard,
    },
    {
      title: "Blog posts",
      url: "/dashboard/blog",
      icon: PenLine,
    },
    {
      title: "Add Book",
      url: "/dashboard/create-books",
      icon: CirclePlus,
    },
    {
      title: "Add Article",
      url: "/dashboard/create-article",
      icon: NotebookPen,
    },
    {
      title: "Add Service",
      url: "/dashboard/create-service",
      icon: ClipboardPlus,
    },
  ];

  return (
    <Sidebar className="mt-16" variant="inset">
      <SidebarContent>
        {/* User Info Group */}
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center justify-between text-base font-semibold capitalize text-primary">
            <span>@{user.name}</span>
            <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-normal lowercase text-primary">
              {user.role}
            </span>
          </SidebarGroupLabel>
          <Separator className="my-2" />
          
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground">
            General
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {userItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="hover:bg-card">
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4 text-primary" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Admin Management Group (Enforced Server-Side for Admin Role Only) */}
        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground">
              Administration
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className="hover:bg-card">
                      <Link href={item.url}>
                        <item.icon className="h-4 w-4 text-primary" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
