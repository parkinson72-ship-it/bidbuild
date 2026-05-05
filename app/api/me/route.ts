import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";

export async function GET(req: Request) {
  const session = await getIronSession<{ user?: { id: number; email: string } }>(
    req,
    new Response(),
    sessionOptions
  );

  if (!session.user) {
    return Response.json(
      { loggedIn: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  return Response.json({
    loggedIn: true,
    user: session.user,
  });
}

