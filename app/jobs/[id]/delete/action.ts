"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function deleteJob(id: string) {
  const session = await auth();
  const user = session?.user;

  if (!user) redirect("/login");

  // Optional: ensure the job belongs to the logged‑in user
  const job = await prisma.job.findUnique({
    where: { id },
  });

  if (!job || job.userId !== user.id) {
    redirect("/dashboard");
  }

  await prisma.job.delete({
    where: { id },
  });

  redirect("/dashboard");
}
