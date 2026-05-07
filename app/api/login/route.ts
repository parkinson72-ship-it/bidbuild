import { lucia } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
  }

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
  }

  const session = await lucia.createSession(user.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);

  const res = NextResponse.json({ success: true });
  res.headers.append("Set-Cookie", sessionCookie.serialize());

  return res;
}
