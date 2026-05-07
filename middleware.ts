import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function middleware(request: Request) {
  // Get the raw cookie header
  const cookieHeader = request.headers.get("cookie") || "";

  // Extract session ID from cookies
  const sessionId = auth.readSessionCookie(cookieHeader);

  if (!sessionId) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Validate the session
  const session = await auth.validateSession(sessionId);

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/jobs/:path*", "/messages/:path*", "/profile/:path*"],
};



