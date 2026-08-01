import { auth } from "@/lib/auth";
import { NavigationMenuLink } from "@radix-ui/react-navigation-menu";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "../ui/navigation-menu";
import UserButton from "../UserButton";
import logo from "./../../assets/logo.png";
import Mobile from "./Mobile";
import { ThemeToggle } from "./ThemeToggle";

async function MainNav() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <nav className="bg-card sticky top-0 z-50 shadow-xs">
      <div className="mx-auto flex max-w-325 items-center justify-between px-3">
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
                <Link href="/about-us" passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    About us
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/books" passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Books
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/articles" passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Articles
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/blog" passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Blog
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/services" passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Services
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/contact" passHref>
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
