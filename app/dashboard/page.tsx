// app/dashboard/page.tsx
import { getCurrentUser } from "@/lib/auth-helpers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  // Redirect if not logged in
  if (!user) redirect("/login");

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Welcome to your Dashboard</h1>
      <p>Logged in as: {user.email}</p>
    </main>
  );
}


