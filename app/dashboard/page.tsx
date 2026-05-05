import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";
import LogoutButton from "../components/LogoutButton";

export default async function DashboardPage() {
  const session = await getIronSession<{ user?: { id: number; email: string } }>(
  { headers: new Headers() } as any,
  new Response(),
  sessionOptions
);

  if (!session.user) {
    return (
      <main style={{ padding: "40px", fontFamily: "sans-serif" }}>
        <h1>Unauthorized</h1>
        <p>You must be logged in to view this page.</p>
      </main>
    );
  }

  return (
    <main style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <h1>Dashboard</h1>
      <p>{session.user.email}</p>

      <LogoutButton />
    </main>
  );
}

