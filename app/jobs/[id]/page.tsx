import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function JobDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const cookieHeader = headers().get("cookie") || "";
  const sessionId = auth.readSessionCookie(cookieHeader);
  const session = sessionId ? await auth.validateSession(sessionId) : null;

  const job = await prisma.job.findUnique({
    where: { id: params.id },
    include: {
      user: true,
      bids: {
        include: {
          user: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
      acceptedBid: true,
    },
  });

  if (!job) {
    return (
      <div style={{ padding: "2rem" }}>
        <h1>Job not found</h1>
      </div>
    );
  }

  const jobId = job.id;
  const isOwner = session?.user?.id === job.userId;

  // -----------------------------
  // ACCEPT BID SERVER ACTION
  // -----------------------------
  async function acceptBid(formData: FormData) {
    "use server";

    const bidId = formData.get("bidId") as string;

    await prisma.job.update({
      where: { id: jobId },
      data: {
        acceptedBidId: bidId,
        status: "ASSIGNED",
      },
    });

    redirect(`/jobs/${jobId}`);
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1>{job.title}</h1>
      <p style={{ color: "#666" }}>{job.description}</p>

      <p>
        <strong>Budget:</strong> £{job.budget}
      </p>
      <p>
        <strong>Location:</strong> {job.location}
      </p>

      <hr style={{ margin: "2rem 0" }} />

      <h2>Bids</h2>

      {job.bids.length === 0 && <p>No bids yet.</p>}

      {job.bids.map((bid) => {
        const builder = bid.user;
        const profile = builder.profile;

        return (
          <div
  key={bid.id}
  style={{
    padding: "1rem",
    border: "1px solid #ddd",
    borderRadius: "6px",
    marginBottom: "1rem",
    background: "#fafafa",
  }}
>

            <p>
              <strong>Amount:</strong> £{bid.amount}
            </p>

            <p>
              <strong>Message:</strong> {bid.message}
            </p>

            <hr style={{ margin: "1rem 0" }} />

            <h3>Builder Info</h3>

            <p>
              <strong>Email:</strong> {builder.email}
            </p>

            {profile ? (
              <>
                <p>
                  <strong>Trade:</strong> {profile.trade}
                </p>
                <p>
                  <strong>Experience:</strong> {profile.experience} years
                </p>
                {profile.bio && (
                  <p>
                    <strong>Bio:</strong> {profile.bio}
                  </p>
                )}
                <p style={{ marginTop: "0.5rem" }}>
                  <a
                    href={`/builder/${builder.id}`}
                    style={{ color: "#0070f3", textDecoration: "underline" }}
                  >
                    View Full Profile →
                  </a>
                </p>
              </>
            ) : (
              <p style={{ color: "red" }}>
                This builder has not created a profile yet.
              </p>
            )}

            {job.acceptedBidId === bid.id && (
              <p
                style={{
                  marginTop: "1rem",
                  padding: "0.5rem",
                  background: "#d1ffd1",
                  borderRadius: "4px",
                }}
              >
                ✔ This is the accepted bid
              </p>
            )}

            {isOwner && job.acceptedBidId === null && (
              <form action={acceptBid} style={{ marginTop: "1rem" }}>
                <input type="hidden" name="bidId" value={bid.id} />
                <button
                  type="submit"
                  style={{
                    padding: "0.5rem 1rem",
                    background: "#0070f3",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Accept Bid
                </button>
              </form>
            )}
          </div>
        );
      })}
    </div>
  );
}
