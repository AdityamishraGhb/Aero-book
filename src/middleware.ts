import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = Boolean(req.auth);

  // Protected /account pages
  if (pathname.startsWith("/account")) {
    if (!isLoggedIn && process.env.NODE_ENV === "production") {
      const signInUrl = new URL("/auth/signin", req.nextUrl.origin);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  // Protected /api/user endpoints in production
  if (pathname.startsWith("/api/user")) {
    if (!isLoggedIn && process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Authentication required" } },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/account/:path*", "/api/user/:path*"],
};
