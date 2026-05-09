import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function BuilderProfilePage() {
  const cookieHeader = headers().get("cookie") || "";
  const sessionId = auth.readSessionCookie(cookieHeader);
  const session = sessionId ? await auth.validateSession(sessionId) : null;

  // Guaranteed non-null from here
  if (!session || !session.user) {
    redirect("/login");
  }

  const userId = session.user.id;

  const existingProfile = await prisma.builderProfile.findUnique({
    where: { userId },
  });

  if (existingProfile) {
    redirect("/dashboard");
  }

  // -----------------------------
  // CREATE PROFILE SERVER ACTION
  // -----------------------------
  async function createProfile(formData: FormData) {
    "use server";

    const trade = formData.get("trade") as string;
    const experience = Number(formData.get("experience"));
    const bio = formData.get("bio") as string;

    await prisma.builderProfile.create({
      data: {
        userId,
        trade,
        experience,
        bio,
      },
    });

    redirect("/dashboard");
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "1rem" }}>Create Your Builder Profile</h1>

      <p style={{ marginBottom: "1.5rem", color: "#555" }}>
        Homeowners will see this information when you bid on jobs.
      </p>

      <form action={createProfile} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>
          <label style={{ fontWeight: "bold" }}>Trade</label>
          <input
            type="text"
            name="trade"
            required
            placeholder="e.g. Plumber, Electrician, Joiner"
            style={{
              width: "100%",
              padding: "0.75rem",
              borderRadius: "6px",
              border: "1px solid #ccc",
              marginTop: "0.25rem",
            }}
          />
        </div>

        <div>
          <label style={{ fontWeight: "bold" }}>Years of Experience</label>
          <input
            type="number"
            name="experience"
            required
            min="0"
            placeholder="e.g. 5"
            style={{
              width: "100%",
              padding: "0.75rem",
              borderRadius: "6px",
              border: "1px solid #ccc",
              marginTop: "0.25rem",
            }}
          />
        </div>

        <div>
          <label style={{ fontWeight: "bold" }}>Bio</label>
          <textarea
            name="bio"
            placeholder="Tell homeowners about your skills, background, and work style..."
            rows={5}
            style={{
              width: "100%",
              padding: "0.75rem",
              borderRadius: "6px",
              border: "1px solid #ccc",
              marginTop: "0.25rem",
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: "0.75rem",
            background: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "1rem",
          }}
        >
          Save Profile
        </button>
      </form>
    </div>
  );
}
