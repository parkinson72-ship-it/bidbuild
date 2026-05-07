import { lucia } from "@/lib/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = cookies();
  const sessionId = cookieStore.get("bidbuild_session")?.value;

  if (sessionId) {
    await lucia.invalidateSession(sessionId);
  }

  const blankCookie = lucia.createBlankSessionCookie();

  const res = NextResponse.redirect("/login");
  res.headers.append("Set-Cookie", blankCookie.serialize());

  return res;
}

