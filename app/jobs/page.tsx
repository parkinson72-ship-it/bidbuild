import { validateRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function JobsPage() {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/login");
  }

  const jobs = await prisma.job.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Your Jobs</h1>

        <Link
          href="/jobs/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Job
        </Link>
      </div>

      {jobs.length === 0 && (
        <p className="text-gray-500">You have no jobs yet.</p>
      )}

      <ul className="space-y-4">
        {jobs.map((job) => (
          <li
            key={job.id}
            className="border p-4 rounded hover:bg-gray-50 transition"
          >
            <Link href={`/jobs/${job.id}`}>
              <h2 className="font-semibold text-lg">{job.title}</h2>
              <p className="text-gray-600 text-sm">{job.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
