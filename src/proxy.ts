import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { SESSION_COOKIE_NAME } from "@/lib/constants";

type SessionPayload = {
  sub: string;
  email: string;
  role: string;
  nameEn: string;
};

async function readSession(request: NextRequest): Promise<SessionPayload | null> {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const secret = process.env.SESSION_SECRET;
  if (!token || !secret) return null;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

const USER_ONLY_PATHS = ["/dashboard", "/quiz", "/apply", "/profile"];
const GUEST_ONLY_PATHS = ["/login", "/signup"];

function matchesPath(pathname: string, paths: string[]) {
  return paths.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminPath = pathname === "/admin" || pathname.startsWith("/admin/");
  const isUserOnlyPath = matchesPath(pathname, USER_ONLY_PATHS);
  const isGuestOnlyPath = matchesPath(pathname, GUEST_ONLY_PATHS);

  if (!isAdminPath && !isUserOnlyPath && !isGuestOnlyPath) {
    return NextResponse.next();
  }

  const session = await readSession(request);

  if ((isAdminPath || isUserOnlyPath) && !session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminPath && session?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isGuestOnlyPath && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/quiz/:path*",
    "/apply/:path*",
    "/profile/:path*",
    "/admin/:path*",
    "/login",
    "/signup",
  ],
};
