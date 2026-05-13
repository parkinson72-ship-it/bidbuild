// app/dashboard/layout.tsx
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth-helpers";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // Redirect to login if not authenticated
  if (!user) redirect("/login");

  return <>{children}</>;
}
