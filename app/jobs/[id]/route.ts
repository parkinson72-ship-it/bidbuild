import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET JOB
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

  const job = await prisma.job.findUnique({
    where: { id: params.id },
  });

  if (!job || job.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ job });
}

// UPDATE JOB
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const cookie = req.headers.get("cookie") || "";
  const sessionId = auth.readSessionCookie(cookie);
  const session = sessionId ? await auth.validateSession(sessionId) : null;

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await prisma.job.findUnique({
    where: { id: params.id },
  });

  if (!existing || existing.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { title, description, budget, location, status } = await req.json();

  const job = await prisma.job.update({
    where: { id: params.id },
    data: {
      title,
      description,
      budget,
      location,
      status,
    },
  });

  return NextResponse.json({ job });
}

// DELETE JOB
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const cookie = req.headers.get("cookie") || "";
  const sessionId = auth.readSessionCookie(cookie);
  const session = sessionId ? await auth.validateSession(sessionId) : null;

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await prisma.job.findUnique({
    where: { id: params.id },
  });

  if (!existing || existing.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.job.delete({
    where: { id: params.id },
  });

  return NextResponse.json({ success: true });
}
