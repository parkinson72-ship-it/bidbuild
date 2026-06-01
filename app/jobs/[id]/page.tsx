import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function JobDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const job = await prisma.job.findUnique({
    where: { id: params.id },
  });

  if (!job) return notFound();

  return (
    <div className="max-w-3xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-4">{job.title}</h1>

      <div className="space-y-4 bg-white p-6 rounded shadow">
        <p className="text-gray-800 whitespace-pre-line">{job.description}</p>

        <div className="flex gap-6 text-gray-700">
          <span className="font-medium">Budget:</span> £{job.budget}
        </div>

        <div className="flex gap-6 text-gray-700">
          <span className="font-medium">Location:</span> {job.location}
        </div>

        <div className="flex gap-6 text-gray-700">
          <span className="font-medium">Category:</span> {job.category}
        </div>
      </div>
    </div>
  );
}

