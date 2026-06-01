import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { headers } from "next/headers";

import Sidebar from "./sidebar";
import MobileToggle from "./sidebar-toggle";
import NotificationsPanel from "./notifications-panel";
import ActivityPanel from "./activity-panel";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Not signed in</h1>
        <p>Please sign in to view your dashboard.</p>
      </div>
    );
  }

  const currentPath = headers().get("x-pathname") || "";

  return (
    <div className="flex min-h-screen relative">
      <div className="md:hidden absolute top-4 left-4 z-50">
        <MobileToggle />
      </div>

      <Sidebar currentPath={currentPath} />

      <NotificationsPanel />
      <ActivityPanel />

      <main className="flex-1 p-10">{children}</main>
    </div>
  );
}
