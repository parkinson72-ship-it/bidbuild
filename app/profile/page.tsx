// app/profile/page.tsx
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth-helpers";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <main>
      <h1>Profile</h1>
    </main>
  );
}
