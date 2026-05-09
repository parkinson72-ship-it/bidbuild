export const runtime = "nodejs";

import { auth } from "@/lib/auth";

export async function GET(request: Request) {
    const authRequest = auth.handleRequest("GET", request);
    return authRequest.redirect();
}

export async function POST(request: Request) {
    const authRequest = auth.handleRequest("POST", request);
    return authRequest.redirect();
}

