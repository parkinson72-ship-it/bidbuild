import Sidebar from "../../components/Sidebar";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";

export default async function ProfilePage() {
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
    <div style={{ display: "flex" }}>
      <Sidebar />

      <main style={{ padding: "40px", fontFamily: "sans-serif", flex: 1 }}>
        <h1>Profile</h1>
        <p>Email: {session.user.email}</p>
        <p>This is where your profile settings will go.</p>
      </main>
    </div>
  );
}
