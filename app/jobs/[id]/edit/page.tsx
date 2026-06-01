import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";

export default async function EditJobPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  const user = session?.user;

  if (!user) redirect("/login");

  const job = await prisma.job.findUnique({
    where: { id: params.id },
  });

  if (!job || job.userId !== user.id) {
    return notFound();
  }

  const jobId = job.id;

  async function updateJob(formData: FormData) {
    "use server";

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const budget = Number(formData.get("budget"));

    await prisma.job.update({
      where: { id: jobId },
      data: {
        title,
        description,
        budget,
      },
    });

    redirect(`/jobs/${jobId}`);
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Job</h1>

      <form action={updateJob} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Job Title</label>
          <input
            name="title"
            defaultValue={job.title}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            name="description"
            defaultValue={job.description}
            required
            className="w-full border p-2 rounded"
            rows={4}
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Budget (£)</label>
          <input
            name="budget"
            type="number"
            defaultValue={job.budget}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>

      <a href={`/jobs/${job.id}`} className="text-blue-600 underline block mt-4">
        Back to Job
      </a>
    </div>
  );
}
