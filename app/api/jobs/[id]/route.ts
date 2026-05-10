import { prisma } from "@/lib/prisma";
import { validateRequest } from "@/lib/auth";

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    const { user } = await validateRequest();

    if (!user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401
        });
    }

    const jobId = params.id;

    try {
        // Optional: ensure user owns the job
        const job = await prisma.job.findUnique({
            where: { id: jobId }
        });

        if (!job) {
            return new Response(JSON.stringify({ error: "Job not found" }), {
                status: 404
            });
        }

        // Delete job
        await prisma.job.delete({
            where: { id: jobId }
        });

        return new Response(JSON.stringify({ success: true }), {
            status: 200
        });
    } catch (error) {
        console.error("Job deletion error:", error);
        return new Response(JSON.stringify({ error: "Failed to delete job" }), {
            status: 500
        });
    }
}
