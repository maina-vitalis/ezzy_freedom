import PasswordUpdate from "@/components/forms/PasswordUpdate";
import UserDetailsForm from "@/components/forms/UserDetailsForm";
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
    <section className="flex flex-col justify-center items-center w-full space-y-2">
      <div className="flex items-center gap-2">
        <UserAvatar className="size-16" />
        <p className="capitalize">{session?.user.name}</p>
      </div>
      <Separator />
      <div className="w-full">
        <UserDetailsForm user={user} />
      </div>
      <Separator />
      <PasswordUpdate />
    </section>
  );
}

export default page;
