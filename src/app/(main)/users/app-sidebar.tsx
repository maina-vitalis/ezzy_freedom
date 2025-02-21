//app sidebar
import { Calendar, PlusCircle, User } from "lucide-react";

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
      title: "Appointments",
      url: `/users/${user?.name}/appointments`,
      icon: Calendar,
    },

    {
      title: "Add book",
      url: `/users/${user?.name}/create`,
      icon: PlusCircle,
    },
  ];
  return (
    <Sidebar className="mt-16" variant="inset">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-base text-primary capitalize font-semibold ">
            @{user?.name}
          </SidebarGroupLabel>
          <Separator />
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
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
