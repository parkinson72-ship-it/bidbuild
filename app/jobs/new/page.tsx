import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function CreateJobPage() {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/login");
  }

  async function createJob(formData: FormData) {
    "use server";

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const budget = formData.get("budget") as string;
    const location = formData.get("location") as string;

    await fetch("/api/jobs/new", {
      method: "POST",
      body: JSON.stringify({
        title,
        description,
        budget,
        location
      }),
      headers: {
        "Content-Type": "application/json"
      }
    });

    redirect("/jobs");
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create a New Job</h1>

      <form action={createJob} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Job Title</label>
          <input
            name="title"
            required
            className="w-full border p-2 rounded"
            placeholder="e.g. Kitchen renovation"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            name="description"
            required
            className="w-full border p-2 rounded"
            rows={4}
            placeholder="Describe the job in detail..."
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Budget (£)</label>
          <input
            name="budget"
            type="number"
            required
            className="w-full border p-2 rounded"
            placeholder="e.g. 1500"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Location</label>
          <input
            name="location"
            className="w-full border p-2 rounded"
            placeholder="e.g. Manchester"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Job
        </button>
      </form>

      <Link href="/jobs" className="text-blue-600 underline block mt-4">
        Back to Jobs
      </Link>
    </div>
  );
}
