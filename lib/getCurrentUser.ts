import { validateRequest } from "@/lib/validateRequest";

export async function getCurrentUser() {
  const { user } = await validateRequest();
  return user;
}
