import { requireUser } from "@/lib/auth-helpers";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  await requireUser(); // redirects or throws if not logged in

  return <>{children}</>;
}
