import Sidebar from "../../components/Sidebar";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";

export default async function MessagesPage() {
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
        <h1>Messages</h1>
        <p>This is where your messages will appear.</p>
      </main>
    </div>
  );
}
