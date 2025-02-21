interface UserButtonProps {
  className?: string;
}

// import { useSession } from "@/app/(main)/SessionProvider";
import React from "react";
import UserAvatar from "./UserAvatar";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

async function UserButton({ className }: UserButtonProps) {
  const data = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <button
      name="user icon"
      className={cn("flex-none rounded-full", className)}
    >
      <Link href={`/users/${data?.user.name}`}>
        <UserAvatar size={40} />
      </Link>
    </button>
  );
}

export default UserButton;
