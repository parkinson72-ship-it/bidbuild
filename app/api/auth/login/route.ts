import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";


export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Compare password
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Create session
    const res = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
      },
    });

    const session = await getIronSession(req, res, sessionOptions);

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
