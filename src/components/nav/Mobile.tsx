import React from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "../ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";
import { Separator } from "../ui/separator";

function Mobile() {
  return (
    <Sheet>
      <SheetTrigger>
        <Menu />
      </SheetTrigger>
      <SheetContent side={"top"} className="rounded-br-lg rounded-bl-lg">
        <SheetHeader className="mb-3 text-start">
          <p className="font-semibold text-primary">Ezzy Foundation</p>
        </SheetHeader>
        <div className="space-y-2 flex flex-col">
          <SheetClose className="w-64 text-start" asChild>
            <Link href={"/about-us"} className="w-full">
              About us
            </Link>
          </SheetClose>
          <Separator />

          {/* <SheetClose className="w-64 text-start" asChild>
            <Link href={"/services"} className="w-full">
              Services
            </Link>
          </SheetClose>
          <Separator /> */}

          <SheetClose className="w-64 text-start" asChild>
            <Link href={"/contact"} className="w-full">
              Contact
            </Link>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default Mobile;
