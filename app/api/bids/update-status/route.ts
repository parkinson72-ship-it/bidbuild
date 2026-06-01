import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(req: Request) {
  const session = await auth();
  const user = session?.user;

  if (!user?.email) {
    return NextResponse.json(
      { error: "You must be logged in." },
      { status: 401 }
    );
  }

  const { bidId, status } = await req.json();

  if (!bidId || !status) {
    return NextResponse.json(
      { error: "Missing required fields." },
      { status: 400 }
    );
  }

  if (!["ACCEPTED", "REJECTED"].includes(status)) {
    return NextResponse.json(
      { error: "Invalid status." },
      { status: 400 }
    );
  }

  const bid = await prisma.bid.findUnique({
    where: { id: bidId },
    include: {
      job: {
        include: {
          conversation: true,
        },
      },
      user: true,
    },
  });

  if (!bid) {
    return NextResponse.json(
      { error: "Bid not found." },
      { status: 404 }
    );
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email },
  });

  if (!dbUser) {
    return NextResponse.json(
      { error: "User not found." },
      { status: 404 }
    );
  }

  // Only job owner can update bid status
  if (bid.job.userId !== dbUser.id) {
    return NextResponse.json(
      { error: "You do not have permission to update this bid." },
      { status: 403 }
    );
  }

  // If accepting a bid, reject all others
  if (status === "ACCEPTED") {
    await prisma.bid.updateMany({
      where: {
        jobId: bid.jobId,
        NOT: { id: bidId },
      },
      data: {
        status: "REJECTED",
      },
    });
  }

  // Update the selected bid
  const updatedBid = await prisma.bid.update({
    where: { id: bidId },
    data: { status },
  });

  // Create conversation if accepted and none exists
  let conversation = bid.job.conversation;

  if (status === "ACCEPTED" && !conversation) {
    conversation = await prisma.conversation.create({
      data: {
        jobId: bid.jobId,
      },
    });
  }

  return NextResponse.json({
    success: true,
    bid: updatedBid,
    conversationId: conversation?.id || null,
  });
}
