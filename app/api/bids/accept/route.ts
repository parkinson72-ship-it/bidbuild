import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { bidId } = await req.json();

    if (!bidId) {
      return NextResponse.json({ error: "Missing bidId" }, { status: 400 });
    }

    // Fetch bid with job + bidder
    const bid = await prisma.bid.findUnique({
      where: { id: bidId },
      include: {
        job: {
          include: { user: true },
        },
        user: true,
      },
    });

    if (!bid) {
      return NextResponse.json({ error: "Bid not found" }, { status: 404 });
    }

    // Only job owner can accept
    if (bid.job.userId !== user.id) {
      return NextResponse.json(
        { error: "You are not the owner of this job" },
        { status: 403 }
      );
    }

    // Accept this bid
    await prisma.bid.update({
      where: { id: bidId },
      data: { status: "ACCEPTED" },
    });

    // Reject all other bids
    await prisma.bid.updateMany({
      where: {
        jobId: bid.jobId,
        id: { not: bidId },
      },
      data: { status: "REJECTED" },
    });

    // Update job status
    await prisma.job.update({
      where: { id: bid.jobId },
      data: { status: "AWARDED" },
    });

    // Create conversation if not exists
    let conversation = await prisma.conversation.findUnique({
      where: { jobId: bid.jobId },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          jobId: bid.jobId,
        },
      });
    }

    return NextResponse.json(
      {
        success: true,
        conversationId: conversation.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error accepting bid:", error);
    return NextResponse.json(
      { error: "Failed to accept bid" },
      { status: 500 }
    );
  }
}
