import { prisma } from "@/lib/prisma";
import { validateRequest } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { user } = await validateRequest();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const jobId = params.id;
  const body = await req.json();
  const { amount, message } = body;

  if (!amount || isNaN(amount)) {
    return NextResponse.json({ error: "Invalid bid amount" }, { status: 400 });
  }

  // Prevent duplicate bids from the same builder
  const existingBid = await prisma.bid.findFirst({
    where: {
      jobId,
      userId: user.id
    }
  });

  if (existingBid) {
    return NextResponse.json(
      { error: "You have already placed a bid on this job" },
      { status: 400 }
    );
  }

  const bid = await prisma.bid.create({
    data: {
      amount: Number(amount),
      message,
      jobId,
      userId: user.id
    }
  });

  return NextResponse.json(bid);
}
