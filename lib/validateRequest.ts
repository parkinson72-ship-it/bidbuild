import { cookies } from "next/headers";
import { auth } from "@/lib/auth";

export async function validateRequest() {
  const cookieStore = cookies();
  const sessionId = cookieStore.get("bidbuild_session")?.value;

  if (!sessionId) {
    return { user: null, session: null };
  }

  const { user, session } = await auth.validateSession(sessionId);

  return { user, session };
}
