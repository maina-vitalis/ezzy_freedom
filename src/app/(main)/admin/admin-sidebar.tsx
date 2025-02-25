//app sidebar
import { Calendar, ClipboardPlus, PlusCircle, User } from "lucide-react";

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

export async function AdminSidebar() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return;

  const user = session?.user;

  const items = [
    {
      title: "Dashboard",
      url: `/admin`,
      icon: User,
    },

    {
      title: "Appointments",
      url: `/admin/appointments`,
      icon: Calendar,
    },

    {
      title: "Add book",
      url: `/admin/create-books`,
      icon: PlusCircle,
    },

    {
      title: "Add Service",
      url: `/admin/create-service`,
      icon: ClipboardPlus,
    },
  ];
  return (
    <Sidebar className="mt-16" variant="inset">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="line-clamp-1 text-base font-semibold capitalize text-primary">
            @{user?.name}
            <span className="ml-1 text-xs lowercase"> ({user.role})</span>
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
