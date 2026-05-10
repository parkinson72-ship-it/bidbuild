import { prisma } from "@/lib/prisma";
import { validateRequest } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";

export default async function DeleteJobPage({
  params
}: {
  params: { id: string };
}) {
  const { user } = await validateRequest();
  if (!user) redirect("/login");

  const job = await prisma.job.findUnique({
    where: { id: params.id }
  });

  if (!job || job.userId !== user.id) {
    return notFound();
  }

  const jobId = job.id;

  async function deleteJob() {
    "use server";

    await prisma.job.delete({
      where: { id: jobId }
    });

    redirect("/jobs");
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Delete Job</h1>

      <p className="mb-6">
        Are you sure you want to delete <strong>{job.title}</strong>? This action
        cannot be undone.
      </p>

      <form action={deleteJob} className="flex gap-4">
        <button
          type="submit"
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Yes, Delete
        </button>

        <a
          href={`/jobs/${job.id}`}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Cancel
        </a>
      </form>
    </div>
  );
}
