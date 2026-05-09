import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const cookie = req.headers.get("cookie") || "";
    const sessionId = auth.readSessionCookie(cookie);
    const session = sessionId ? await auth.validateSession(sessionId) : null;

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description, budget, location } = await req.json();

    const job = await prisma.job.create({
      data: {
        title,
        description,
        budget,
        location,
        status: "ACTIVE",
        userId: session.user.id,
      },
    });

    return NextResponse.json({ job }, { status: 201 });
  } catch (error) {
    console.error("Job creation error:", error);
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 });
  }
}
