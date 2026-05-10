import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";
import { auth } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 400 }
      );
    }

    const storedHash = user.password ?? "";

    const isValid = await compare(password, storedHash);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 400 }
      );
    }

    // LUCIA v3 SESSION CREATION
const session = await auth.createSession(user.id.toString(), {});

// LUCIA v3 COOKIE CREATION
const sessionCookie = auth.createSessionCookie(session.id);

    const response = NextResponse.json({ success: true });

    response.cookies.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
