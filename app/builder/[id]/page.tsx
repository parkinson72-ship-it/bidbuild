import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function PublicBuilderProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const builder = await prisma.user.findUnique({
    where: { id: params.id },
    include: {
      profile: true,
      jobs: {
        where: { status: "COMPLETED" },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!builder || !builder.profile) {
    return notFound();
  }

  const { profile } = builder;

  return (
    <div style={{ padding: "2rem", maxWidth: "700px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "0.5rem" }}>Builder Profile</h1>

      <p style={{ color: "#666", marginBottom: "2rem" }}>
        Viewing builder: <strong>{builder.email}</strong>
      </p>

      <div
        style={{
          padding: "1.5rem",
          background: "#fafafa",
          borderRadius: "8px",
          border: "1px solid #e5e5e5",
          marginBottom: "2rem",
        }}
      >
        <h2 style={{ marginBottom: "1rem" }}>About This Builder</h2>

        <p>
          <strong>Trade:</strong> {profile.trade}
        </p>

        <p>
          <strong>Experience:</strong> {profile.experience} years
        </p>

        {profile.bio && (
          <p style={{ marginTop: "1rem", whiteSpace: "pre-line" }}>
            <strong>Bio:</strong> {profile.bio}
          </p>
        )}
      </div>

      <div>
        <h2 style={{ marginBottom: "1rem" }}>Completed Jobs</h2>

        {builder.jobs.length === 0 ? (
          <p>This builder has not completed any jobs yet.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {builder.jobs.map((job: any) => (
              <li
                key={job.id}
                style={{
                  padding: "1rem",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  marginBottom: "0.75rem",
                  background: "#fff",
                }}
              >
                <strong>{job.title}</strong>
                <p style={{ margin: "0.25rem 0", color: "#666" }}>
                  Completed on {new Date(job.updatedAt).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
