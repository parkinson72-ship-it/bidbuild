import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const { jobId } = await req.json();

  const job = await prisma.job.findUnique({ where: { id: jobId } });

  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  // LOCK: If job is already completed, block the action
  if (job.status === "COMPLETED") {
    return NextResponse.json({ error: "Job is locked" }, { status: 403 });
  }

  const updated = await prisma.job.update({
    where: { id: jobId },
    data: { status: "COMPLETED_PENDING" },
  });

  return NextResponse.json(updated);
}
