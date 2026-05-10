import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateRequest } from "@/lib/auth";

export async function POST(req: Request) {
  const { user } = await validateRequest();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await req.json();
  const { jobId, recipientId, content } = body;

  if (!jobId || !recipientId || !content) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const message = await prisma.message.create({
    data: {
      jobId,
      senderId: user.id,
      recipientId,
      content
    }
  });

  return NextResponse.json(message);
}
