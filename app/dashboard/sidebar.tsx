"use client";

import Link from "next/link";

export default function Sidebar({ user }: { user: any | null }) {
  return (
    <aside
      style={{
        width: "220px",
        background: "#f5f5f5",
        padding: "1.5rem",
        borderRight: "1px solid #ddd",
        minHeight: "100vh",
      }}
    >
      <h2 style={{ marginBottom: "1.5rem" }}>Dashboard</h2>

      <nav style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Link href="/dashboard">Home</Link>
        <Link href="/jobs">Jobs</Link>
        <Link href="/message">Messages</Link>

        {/* Profile link */}
        <Link href="/profile/edit">My Profile</Link>

        {/* Show user email if logged in */}
        {user && (
          <p style={{ marginTop: "2rem", fontSize: "0.9rem", color: "#555" }}>
            Logged in as:<br />
            <strong>{user.email}</strong>
          </p>
        )}
      </nav>
    </aside>
  );
}
