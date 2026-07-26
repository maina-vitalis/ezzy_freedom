interface UserButtonProps {
  className?: string;
}

import React from "react";
import UserAvatar from "./UserAvatar";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { LayoutDashboard } from "lucide-react";
import SignOut from "./SignOut";

async function UserButton({ className }: UserButtonProps) {
  const data = await auth.api.getSession({
    headers: await headers(),
  });

  if (!data?.user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          name="user icon"
          className={cn("flex-none rounded-full", className)}
        >
          <UserAvatar imageUrl={data.user.image ?? undefined} size={40} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{data.user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {data.user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard" className="flex items-center gap-2 cursor-pointer">
            <LayoutDashboard className="size-4 text-primary" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <SignOut />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserButton;
