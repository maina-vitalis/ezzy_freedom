import { Menu } from "lucide-react";
import Link from "next/link";
import { Separator } from "../ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "../ui/sheet";
import { ThemeToggle } from "./ThemeToggle";

function Mobile() {
  return (
    <Sheet>
      <SheetTrigger>
        <Menu />
      </SheetTrigger>
      <SheetContent side={"right"} className="rounded-bl-lg rounded-br-lg">
        <SheetHeader className="mb-3 text-start">
          <p className="font-semibold text-primary">Ezzy Foundation</p>
        </SheetHeader>
        <div className="flex flex-col space-y-2">
          <SheetClose className="w-64 text-start" asChild>
            <Link href={"/about-us"} className="w-full">
              About us
            </Link>
          </SheetClose>
          <Separator />

          <SheetClose className="w-64 text-start" asChild>
            <Link href={"/books"} className="w-full">
              Books
            </Link>
          </SheetClose>
          <Separator />

          <SheetClose className="w-64 text-start" asChild>
            <Link href={"/services"} className="w-full">
              Services
            </Link>
          </SheetClose>
          <Separator />

          <SheetClose className="w-64 text-start" asChild>
            <Link href={"/articles"} className="w-full">
              Articles
            </Link>
          </SheetClose>
          <Separator />

          <SheetClose className="w-64 text-start" asChild>
            <Link href={"/blog"} className="w-full">
              Blog
            </Link>
          </SheetClose>
          <Separator />

          <SheetClose className="w-64 text-start" asChild>
            <Link href={"/contact"} className="w-full">
              Contact
            </Link>
          </SheetClose>
          <Separator />
          <ThemeToggle />
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default Mobile;
