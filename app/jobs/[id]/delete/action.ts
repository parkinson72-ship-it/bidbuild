"use server";

import { prisma } from "@/lib/prisma";
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function deleteJob(id: string) {
    const { user } = await validateRequest();
    if (!user) redirect("/login");

    await prisma.job.delete({
        where: { id }
    });

    redirect("/dashboard");
}
