// app/message/page.tsx
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth-helpers";

export default async function MessagePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <main>
      <h1>Messages</h1>
    </main>
  );
}
