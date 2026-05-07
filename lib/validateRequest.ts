import { cookies } from "next/headers";
import { lucia } from "@/lib/auth";

export async function validateRequest() {
  const cookieStore = cookies();
  const sessionId = cookieStore.get("bidbuild_session")?.value;

  if (!sessionId) {
    return { user: null, session: null };
  }

  const { user, session } = await lucia.validateSession(sessionId);

  return { user, session };
}
