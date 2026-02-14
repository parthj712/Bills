import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const userCookie = req.cookies.get("user")?.value;

  // not logged in
  if (!token || !userCookie) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const user = JSON.parse(userCookie);

  const url = req.nextUrl.pathname;

  // 🚫 BLOCK ORDER PAGE FOR TAKEAWAY SHOPS
  if (url.startsWith("/waiter/order") && user.businessCategory !== "DINE_IN") {
    return NextResponse.redirect(new URL("/waiter", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/waiter/:path*"],
};
