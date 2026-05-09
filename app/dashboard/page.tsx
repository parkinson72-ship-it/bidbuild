import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import Link from "next/link";

export default async function DashboardPage() {
  const cookieHeader = headers().get("cookie") || "";
  const sessionId = auth.readSessionCookie(cookieHeader);
  const session = sessionId ? await auth.validateSession(sessionId) : null;
  const user = session?.user;

  if (!user) {
    return (
      <div style={{ padding: "2rem" }}>
        <h1>You are not logged in</h1>
      </div>
    );
  }

  // JOB STATS
  const totalJobs = await prisma.job.count({
    where: { userId: user.id },
  });

  const activeJobs = await prisma.job.count({
    where: { userId: user.id, status: "ACTIVE" },
  });

  const completedJobs = await prisma.job.count({
    where: { userId: user.id, status: "COMPLETED" },
  });

  // RECENT JOBS
  const recentJobs = await prisma.job.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1 style={{ marginBottom: "1rem" }}>Welcome back, {user.email}</h1>

      {/* Create Job Button */}
      <Link
        href="/dashboard/create-job"
        style={{
          display: "inline-block",
          padding: "0.75rem 1.5rem",
          background: "#0070f3",
          color: "white",
          borderRadius: "6px",
          textDecoration: "none",
          marginBottom: "2rem",
        }}
      >
        Create New Job
      </Link>

      {/* Stats Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <div style={{ padding: "1rem", background: "#f5f5f5", borderRadius: "8px" }}>
          <h3>Total Jobs</h3>
          <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{totalJobs}</p>
        </div>

        <div style={{ padding: "1rem", background: "#f5f5f5", borderRadius: "8px" }}>
          <h3>Active Jobs</h3>
          <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{activeJobs}</p>
        </div>

        <div style={{ padding: "1rem", background: "#f5f5f5", borderRadius: "8px" }}>
          <h3>Completed Jobs</h3>
          <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{completedJobs}</p>
        </div>
      </div>

      {/* Recent Jobs */}
      <div style={{ marginTop: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Recent Jobs</h2>

        {recentJobs.length === 0 ? (
          <p>No jobs posted yet.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {recentJobs.map((job) => (
              <Link
                key={job.id}
                href={`/jobs/${job.id}`}
                style={{
                  padding: "1rem",
                  background: "#fafafa",
                  borderRadius: "8px",
                  border: "1px solid #e5e5e5",
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <h3 style={{ margin: 0 }}>{job.title}</h3>
                <p style={{ margin: "0.25rem 0", color: "#555" }}>
                  Status: {job.status}
                </p>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "#777" }}>
                  Posted: {new Date(job.createdAt).toLocaleDateString()}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
