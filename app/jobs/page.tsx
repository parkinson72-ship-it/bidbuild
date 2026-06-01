import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function JobsPage() {
  const jobs = await prisma.job.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-4xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-6">Available Jobs</h1>

      {jobs.length === 0 && (
        <p className="text-gray-600">No jobs have been posted yet.</p>
      )}

      <div className="space-y-4">
        {jobs.map((job) => (
          <Link
            key={job.id}
            href={`/jobs/${job.id}`}
            className="block border rounded p-4 bg-white shadow hover:shadow-md transition"
          >
            <h2 className="text-xl font-semibold">{job.title}</h2>
            <p className="text-gray-700 mt-1 line-clamp-2">
              {job.description}
            </p>

            <div className="flex items-center justify-between mt-3 text-sm text-gray-600">
              <span>£{job.budget}</span>
              <span>{job.location}</span>
              <span className="italic">{job.category}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
