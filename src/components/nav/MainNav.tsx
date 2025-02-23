import Image from "next/image";
import React from "react";
import logo from "./../../assets/logo.png";
import Link from "next/link";
import UserButton from "../UserButton";
import Mobile from "./Mobile";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Button } from "../ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "../ui/navigation-menu";
import { NavigationMenuLink } from "@radix-ui/react-navigation-menu";
import { ThemeToggle } from "./ThemeToggle";

async function MainNav() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <nav className="sticky top-0 z-50 bg-card shadow-sm">
      <div className="mx-auto flex max-w-[1300px] items-center justify-between px-3">
        <div className="flex items-center gap-10 py-1">
          <Link href={"/"}>
            <Image
              src={logo}
              alt="ezzy foundation logo"
              height={70}
              width={70}
            />
          </Link>

          <NavigationMenu className="hidden gap-5 md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/about-us" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    About us
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/contact" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Contact us
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <>
          <div className="flex items-center justify-center gap-2">
            {session?.user ? (
              <UserButton className="w-8 md:w-11" />
            ) : (
              <Button
                className="rounded-full transition-all duration-200 ease-out hover:shadow-lg"
                asChild
              >
                <Link href={"/sign-in"}>Login</Link>
              </Button>
            )}

            <div className="hidden md:block">
              <ThemeToggle />
            </div>
            <div className="md:hidden">
              <Mobile />
            </div>
          </div>
        </>
      </div>
    </nav>
  );
}

export default MainNav;
