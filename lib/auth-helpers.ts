// lib/auth-helpers.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  // Prevent redirect loops: return null only if user truly not logged in
  if (!session || !session.user?.email) return null;
  return session.user;
}
