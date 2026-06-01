import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Not signed in</h1>
        <p>Please sign in to view your dashboard.</p>
      </div>
    );
  }

  // Fetch all relevant data for the dashboard
  const [postedJobs, acceptedJobs, bids, completedJobs] = await Promise.all([
    prisma.job.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    }),

    prisma.job.findMany({
      where: {
        bids: {
          some: {
            userId: user.id,
            status: "ACCEPTED",
          },
        },
      },
      include: {
        bids: true,
      },
      orderBy: { createdAt: "desc" },
    }),

    prisma.bid.findMany({
      where: { userId: user.id },
      include: { job: true },
      orderBy: { createdAt: "desc" },
    }),

    prisma.job.findMany({
      where: {
        OR: [
          { userId: user.id },
          {
            bids: {
              some: {
                userId: user.id,
                status: "ACCEPTED",
              },
            },
          },
        ],
        status: "COMPLETED",
      },
      orderBy: { updatedAt: "desc" },
    }),
  ]);

  return (
    <div className="p-6 space-y-10">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="text-gray-600">Welcome back, {user.name}</p>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4 bg-blue-100 border border-blue-300 rounded">
          <h2 className="text-xl font-semibold">Jobs Posted</h2>
          <p className="text-3xl font-bold">{postedJobs.length}</p>
        </div>

        <div className="p-4 bg-green-100 border border-green-300 rounded">
          <h2 className="text-xl font-semibold">Jobs Accepted</h2>
          <p className="text-3xl font-bold">{acceptedJobs.length}</p>
        </div>

        <div className="p-4 bg-purple-100 border border-purple-300 rounded">
          <h2 className="text-xl font-semibold">Completed Jobs</h2>
          <p className="text-3xl font-bold">{completedJobs.length}</p>
        </div>
      </div>

      {/* Posted Jobs */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Your Posted Jobs</h2>
        {postedJobs.length === 0 ? (
          <p className="text-gray-500">You haven't posted any jobs yet.</p>
        ) : (
          <div className="space-y-3">
            {postedJobs.map((job) => (
              <Link
                key={job.id}
                href={`/jobs/${job.id}`}
                className="block p-4 border rounded hover:bg-gray-50"
              >
                <h3 className="text-xl font-semibold">{job.title}</h3>
                <p>Status: {job.status}</p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Accepted Jobs */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Jobs You're Working On</h2>
        {acceptedJobs.length === 0 ? (
          <p className="text-gray-500">You haven't been hired for any jobs yet.</p>
        ) : (
          <div className="space-y-3">
            {acceptedJobs.map((job) => (
              <Link
                key={job.id}
                href={`/jobs/${job.id}`}
                className="block p-4 border rounded hover:bg-gray-50"
              >
                <h3 className="text-xl font-semibold">{job.title}</h3>
                <p>Status: {job.status}</p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Bids */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Your Bids</h2>
        {bids.length === 0 ? (
          <p className="text-gray-500">You haven't placed any bids yet.</p>
        ) : (
          <div className="space-y-3">
            {bids.map((bid) => (
              <Link
                key={bid.id}
                href={`/jobs/${bid.jobId}`}
                className="block p-4 border rounded hover:bg-gray-50"
              >
                <h3 className="text-xl font-semibold">{bid.job.title}</h3>
                <p>Bid Amount: £{bid.amount}</p>
                <p>Status: {bid.status}</p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Completed Jobs */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Completed Jobs</h2>
        {completedJobs.length === 0 ? (
          <p className="text-gray-500">No completed jobs yet.</p>
        ) : (
          <div className="space-y-3">
            {completedJobs.map((job) => (
              <Link
                key={job.id}
                href={`/jobs/${job.id}`}
                className="block p-4 border rounded hover:bg-gray-50"
              >
                <h3 className="text-xl font-semibold">{job.title}</h3>
                <p>Completed on: {job.updatedAt.toLocaleDateString()}</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}




