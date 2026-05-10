import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteJob } from "./delete/action";

type JobPageProps = {
    params: {
        id: string;
    };
};

export default async function JobPage({ params }: JobPageProps) {
    const job = await prisma.job.findUnique({
        where: { id: params.id }
    });

    if (!job) {
        return (
            <div className="max-w-2xl mx-auto py-10">
                <h1 className="text-2xl font-bold mb-4">Job not found</h1>
                <Link href="/dashboard" className="text-blue-600 underline">
                    Back to dashboard
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto py-10 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">{job.title}</h1>
                <span className="text-lg font-semibold">
                    £{job.budget.toLocaleString()}
                </span>
            </div>

            <p className="text-gray-700 whitespace-pre-line">
                {job.description}
            </p>

            <div className="text-sm text-gray-500">
                Created: {job.createdAt.toLocaleString()}
            </div>

            <div className="flex gap-4">
                <Link
                    href={`/jobs/${job.id}/edit`}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Edit Job
                </Link>

                <form action={async () => deleteJob(job.id)}>
                    <button
                        type="submit"
                        className="bg-red-600 text-white px-4 py-2 rounded"
                    >
                        Delete Job
                    </button>
                </form>

                <Link
                    href="/dashboard"
                    className="ml-auto text-gray-600 underline"
                >
                    Back to dashboard
                </Link>
            </div>
        </div>
    );
}
