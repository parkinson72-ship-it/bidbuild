import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return Response.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      return Response.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Compare passwords
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return Response.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    return Response.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    return Response.json(
      { success: false, message: "Server error", error: String(error) },
      { status: 500 }
    );
  }
}
