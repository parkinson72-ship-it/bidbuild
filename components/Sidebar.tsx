import Link from "next/link";
import { User } from "@prisma/client";

export default function Sidebar({ user }: { user: User | null }) {
  return (
    <aside
      style={{
        width: "220px",
        background: "#f5f5f5",
        height: "100vh",
        padding: "20px",
        boxSizing: "border-box",
        borderRight: "1px solid #ddd",
      }}
    >
      <h2 style={{ marginBottom: "30px" }}>BidBuild</h2>

      {user && (
        <div style={{ marginBottom: "20px", fontSize: "14px" }}>
          Logged in as <br />
          <strong>{user.email}</strong>
        </div>
      )}

      <nav style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/jobs">Jobs</Link>
        <Link href="/messages">Messages</Link>
        <Link href="/profile">Profile</Link>
      </nav>

      {user && (
        <form action="/api/logout" method="POST" style={{ marginTop: "30px" }}>
          <button type="submit">Logout</button>
        </form>
      )}
    </aside>
  );
}
