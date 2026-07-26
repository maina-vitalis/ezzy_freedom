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

export const metadata = {
  title: "Profile Settings – EZZ Freedom and Hope",
};

async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) redirect("/sign-in");

  const user = {
    username: session.user.name,
    email: session.user.email,
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 py-4">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account information and security preferences
        </p>
      </div>

      <Card className="flex w-full flex-col items-center justify-center space-y-4 p-6">
        <div className="flex items-center gap-4">
          <UserAvatar
            className="size-16"
            imageUrl={session.user.image ?? undefined}
          />
          <div>
            <p className="text-xl font-bold capitalize">{session.user.name}</p>
            <p className="text-xs text-muted-foreground">{session.user.email}</p>
            <span className="mt-1 inline-block rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              Role: {session.user.role}
            </span>
          </div>
        </div>
        <Separator />
        <div className="w-full">
          <UserDetailsForm user={user} />
        </div>
        <Separator />
        <div className="flex w-full items-center justify-between">
          <ChangePassword />
          <SignOut />
        </div>
      </Card>
    </div>
  );
}

export default ProfilePage;
