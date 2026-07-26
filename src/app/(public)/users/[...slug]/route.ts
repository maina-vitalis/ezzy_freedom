import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  if (url.pathname.includes("/appointments")) {
    return NextResponse.redirect(new URL("/dashboard/appointments", request.url));
  }
  if (url.pathname.includes("/library")) {
    return NextResponse.redirect(new URL("/dashboard/library", request.url));
  }
  return NextResponse.redirect(new URL("/dashboard/profile", request.url));
}
