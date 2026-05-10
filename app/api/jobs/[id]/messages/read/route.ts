import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateRequest } from "@/lib/auth";

interface RouteParams {
  params: { id: string };
}

export async function POST(req: Request, { params }: RouteParams) {
  const { user } = await validateRequest();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Mark all unread messages addressed TO the current user as read
  await prisma.message.updateMany({
    where: {
      jobId: params.id,
      recipientId: user.id,
      readAt: null
    },
    data: {
      readAt: new Date()
    }
  });

  return NextResponse.json({ success: true });
}
