import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateRequest } from "@/lib/auth";

export async function POST(request: Request) {
  const { user } = await validateRequest();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { title, description, budget, location } = body;

  if (!title || !description || !budget) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const job = await prisma.job.create({
    data: {
      title,
      description,
      budget: Number(budget),
      userId: user.id
    }
  });

  return NextResponse.json({ success: true, job });
}
