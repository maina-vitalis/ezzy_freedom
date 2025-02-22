"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Loader2, LogOut } from "lucide-react";

function SignOut() {
  const router = useRouter();
  const [isSignOut, setIsSignOut] = useState<boolean>(false);
  return (
    <div>
      <Button
        className="z-10 gap-2"
        variant="secondary"
        onClick={async () => {
          setIsSignOut(true);
          await signOut({
            fetchOptions: {
              onSuccess() {
                router.push("/");
              },
            },
          });
          setIsSignOut(false);
        }}
        disabled={isSignOut}
      >
        <span className="text-sm">
          {isSignOut ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <div className="flex items-center gap-2">
              <LogOut size={16} />
              Sign Out
            </div>
          )}
        </span>
      </Button>
    </div>
  );
}

export default SignOut;
