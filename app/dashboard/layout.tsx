import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Sidebar from "./sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieHeader = headers().get("cookie") || "";
  const sessionId = auth.readSessionCookie(cookieHeader);
  const session = sessionId ? await auth.validateSession(sessionId) : null;

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar user={session?.user ?? null} />

      <main
        style={{
          flex: 1,
          padding: "2rem",
          fontFamily: "sans-serif",
          background: "#fff",
        }}
      >
        {children}
      </main>
    </div>
  );
}

