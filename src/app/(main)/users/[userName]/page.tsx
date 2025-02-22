import { ChangePassword } from "@/components/changePassword";
import UserDetailsForm from "@/components/forms/UserDetailsForm";
import SignOut from "@/components/SignOut";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import UserAvatar from "@/components/UserAvatar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

type ProfileProps = Promise<{
  userName: string;
}>;

async function page(props: { params: ProfileProps }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.session) redirect("/sign-in");

  await props.params;

  const user = {
    username: session?.user.name,
    email: session?.user.email,
  };

  return (
    <Card className="flex w-full flex-col items-center justify-center space-y-2 p-5">
      <div className="flex items-center gap-2">
        <UserAvatar className="size-16" />
        <p className="capitalize">{session?.user.name}</p>
      </div>
      <Separator />
      <div className="w-full">
        <UserDetailsForm user={user} />
      </div>
      <Separator />
      <div className="flex w-full justify-between">
        <ChangePassword />
        <SignOut />
      </div>
    </Card>
  );
}

export default page;
