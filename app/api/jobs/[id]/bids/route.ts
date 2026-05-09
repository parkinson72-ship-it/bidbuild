import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET all bids for a job
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const cookie = req.headers.get("cookie") || "";
  const sessionId = auth.readSessionCookie(cookie);
  const session = sessionId ? await auth.validateSession(sessionId) : null;

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const bids = await prisma.bid.findMany({
    where: { jobId: params.id },
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { email: true },
      },
    },
  });

  return NextResponse.json({ bids });
}

// POST a new bid
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const cookie = req.headers.get("cookie") || "";
  const sessionId = auth.readSessionCookie(cookie);
  const session = sessionId ? await auth.validateSession(sessionId) : null;

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { amount, message } = await req.json();

  if (!amount || !message) {
    return NextResponse.json(
      { error: "Amount and message are required" },
      { status: 400 }
    );
  }

  const job = await prisma.job.findUnique({
    where: { id: params.id },
  });

  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  const bid = await prisma.bid.create({
    data: {
      amount,
      message,
      jobId: params.id,
      userId: session.user.id,
    },
  });

  return NextResponse.json({ bid }, { status: 201 });
}
