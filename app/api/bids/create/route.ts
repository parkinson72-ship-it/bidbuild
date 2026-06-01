import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(req: Request) {
  const session = await auth();
  const user = session?.user;

  if (!user?.email) {
    return NextResponse.json(
      { error: "You must be logged in to place a bid." },
      { status: 401 }
    );
  }

  const { jobId, amount, message } = await req.json();

  if (!jobId || !amount || !message) {
    return NextResponse.json(
      { error: "Missing required fields." },
      { status: 400 }
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

  const job = await prisma.job.findUnique({
    where: { id: jobId },
  });

  if (!job) {
    return NextResponse.json(
      { error: "Job not found." },
      { status: 404 }
    );
  }

  if (job.userId === dbUser.id) {
    return NextResponse.json(
      { error: "You cannot bid on your own job." },
      { status: 403 }
    );
  }

  const bid = await prisma.bid.create({
    data: {
      amount,
      message,
      userId: dbUser.id,
      jobId,
    },
  });

  return NextResponse.json({ success: true, bid });
}
