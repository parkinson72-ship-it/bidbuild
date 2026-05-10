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
  const { bidId } = body;

  if (!bidId) {
    return NextResponse.json({ error: "Missing bidId" }, { status: 400 });
  }

  // Ensure the job exists and belongs to the logged‑in user
  const job = await prisma.job.findUnique({
    where: { id: jobId }
  });

  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  if (job.userId !== user.id) {
    return NextResponse.json(
      { error: "You are not the owner of this job" },
      { status: 403 }
    );
  }

  // Ensure the bid exists and belongs to this job
  const bid = await prisma.bid.findUnique({
    where: { id: bidId }
  });

  if (!bid || bid.jobId !== jobId) {
    return NextResponse.json(
      { error: "Bid does not belong to this job" },
      { status: 400 }
    );
  }

  // Award the job
  const updatedJob = await prisma.job.update({
    where: { id: jobId },
    data: {
      awardedBidId: bidId,
      status: "AWARDED"
    }
  });

  return NextResponse.json(updatedJob);
}
