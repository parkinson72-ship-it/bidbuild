import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateRequest } from "@/lib/auth";

interface RouteParams {
  params: { id: string };
}

export async function GET(req: Request, { params }: RouteParams) {
  const { user } = await validateRequest();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const messages = await prisma.message.findMany({
    where: { jobId: params.id },
    orderBy: { createdAt: "asc" },
    include: {
      sender: true,
      recipient: true
    }
  });

  const result = messages.map((msg) => ({
    id: msg.id,
    content: msg.content,
    createdAt: msg.createdAt,
    readAt: msg.readAt,
    sender: {
      id: msg.sender.id,
      name: msg.sender.name,
      email: msg.sender.email
    },
    recipientId: msg.recipientId,
    isOwn: msg.senderId === user.id
  }));

  return NextResponse.json(result);
}

export async function POST(req: Request, { params }: RouteParams) {
  const { user } = await validateRequest();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await req.json();
  const { content, recipientId } = body as {
    content: string;
    recipientId: string;
  };

  if (!content || !recipientId) {
    return NextResponse.json(
      { error: "Missing content or recipientId" },
      { status: 400 }
    );
  }

  const message = await prisma.message.create({
    data: {
      content,
      jobId: params.id,
      senderId: user.id,
      recipientId
    },
    include: {
      sender: true,
      recipient: true
    }
  });

  return NextResponse.json({
    id: message.id,
    content: message.content,
    createdAt: message.createdAt,
    readAt: message.readAt,
    sender: {
      id: message.sender.id,
      name: message.sender.name,
      email: message.sender.email
    },
    recipientId: message.recipientId,
    isOwn: true
  });
}
