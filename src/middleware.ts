import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWT } from "./lib/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/recruitment");

  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginRoute = pathname === "/login";

  const token = request.cookies.get("token")?.value;

  if (isProtectedRoute) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const payload = await verifyJWT(token);
    if (!payload || !payload.id) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("token");
      return response;
    }

    try {
      const verifyUrl = new URL("/api/auth/verify", request.url);
      const verifyRes = await fetch(verifyUrl, {
        headers: {
          Cookie: `token=${token}`,
        },
      });

      if (!verifyRes.ok) {
        const response = NextResponse.redirect(new URL("/login", request.url));
        response.cookies.delete("token");
        return response;
      }

      const data = await verifyRes.json();

      if (data.user.status !== "ACTIVE") {
        const response = NextResponse.redirect(
          new URL("/login?error=inactive", request.url)
        );
        response.cookies.delete("token");
        return response;
      }

      if (isAdminRoute && data.user.role !== "ADMIN") {
        return NextResponse.redirect(
          new URL("/dashboard?error=forbidden", request.url)
        );
      }

      const response = NextResponse.next();
      response.headers.set("x-user-id", data.user.id);
      response.headers.set("x-user-role", data.user.role);
      return response;
    } catch (err) {
      console.error("Middleware verification error:", err);
      // Fail closed: never allow access when live user verification is unavailable
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("token");
      return response;
    }
  }

  if (isLoginRoute && token) {
    const payload = await verifyJWT(token);
    if (payload && payload.id) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/dashboard/:path*",
    "/profile/:path*",
    "/admin/:path*",
    "/recruitment",
    "/recruitment/:path*",
  ],
};
