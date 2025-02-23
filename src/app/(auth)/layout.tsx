import MainNav from "@/components/nav/MainNav";
import React from "react";
interface LayoutProps {
  children: React.ReactNode;
}

async function layout({ children }: LayoutProps) {
  return (
    <>
      <MainNav />
      <main className="mx-auto max-w-[1300px] p-3">{children}</main>
    </>
  );
}

export default layout;
