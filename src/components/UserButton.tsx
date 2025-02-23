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
import { Lock, UserIcon } from "lucide-react";
import SignOut from "./SignOut";

async function UserButton({ className }: UserButtonProps) {
  const data = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          name="user icon"
          className={cn("flex-none rounded-full", className)}
        >
          <UserAvatar imageUrl={data?.user.image ?? undefined} size={40} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{data?.user.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex items-center gap-1" asChild>
          <Link href={`/users/${data?.user.name}}`}>
            <UserIcon className="mr-2 size-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        {data?.user.role === "ADMIN" && (
          <DropdownMenuItem className="flex items-center gap-1" asChild>
            <Link href={`/admin`}>
              <Lock className="mr-2 size-4" />
              Admin
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <SignOut />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserButton;
