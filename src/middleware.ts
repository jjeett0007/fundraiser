import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const publicPaths = [
    "/",
    "/login",
    "/signup",
    "/explore",
    "/about",
    "/wait-list",
    "/forgot-password",
    "/reset-password",
    "/redirect",
    "/privacy",
    "/terms-and-condition",
    "/help",
    // Allow dynamic fundraiser/[id] route as public
    /^\/fundraiser\/[^\/]+$/,
  ];

  const isPublicPath = publicPaths.includes(path);

  const token = request.cookies.get("Access")?.value;
  const expirationDate = request.cookies.get("expiresIn")?.value;

  const expirationInMs = expirationDate
    ? parseInt(expirationDate) * 1000
    : null;

  const isTokenValid = token && expirationInMs && Date.now() < expirationInMs;
  console.log("IS user authenticated");
  console.log(isTokenValid);

  if (!isPublicPath && !isTokenValid) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (path === "/login" && isTokenValid) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (path === "/signup" && isTokenValid) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*).*)"],
};
