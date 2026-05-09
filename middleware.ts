import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export async function middleware(request: NextRequest) {
    const sessionId = request.cookies.get("auth_session")?.value ?? null;

    // If no session cookie → redirect to login
    if (!sessionId) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // Validate session
    const { session } = await auth.validateSession(sessionId);

    // If session invalid → redirect to login
    if (!session) {
        const response = NextResponse.redirect(new URL("/login", request.url));
        response.cookies.delete("auth_session");
        return response;
    }

    // Session valid → allow request
    return NextResponse.next();
}

// Protect these routes
export const config = {
    matcher: [
        "/dashboard/:path*",
        "/jobs/:path*",
        "/profile/:path*",
        "/builder/:path*"
    ]
};
