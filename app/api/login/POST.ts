import { NextResponse } from "next/server";
import { ironSession } from "iron-session";
import { sessionOptions } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";


export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Check password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Create session
    const res = NextResponse.json({ success: true });

    const session = await ironSession(req, res, sessionOptions);
    session.user = {
      id: user.id,
      email: user.email,
    };
    await session.save();

    return res;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
