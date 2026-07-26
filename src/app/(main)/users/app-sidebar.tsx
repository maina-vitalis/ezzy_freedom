//app sidebar
import { Calendar, Library, User } from "lucide-react";

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
import { Separator } from "@/components/ui/separator";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// Menu items.

export async function AppSidebar() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return;

  const user = session?.user;

  const items = [
    {
      title: "Profile",
      url: `/users/${user?.name}`,
      icon: User,
    },
    {
      title: "My Library",
      url: `/users/${user?.name}/library`,
      icon: Library,
    },
    {
      title: "Appointments",
      url: `/users/${user?.name}/appointments`,
      icon: Calendar,
    },
  ];
  return (
    <Sidebar className="mt-16" variant="inset">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="space-x-1 text-base font-semibold capitalize text-primary">
            @{user?.name}
            <span className="ml-1 text-xs lowercase"> ({user.role})</span>
          </SidebarGroupLabel>
          <Separator />
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="hover:bg-card">
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
