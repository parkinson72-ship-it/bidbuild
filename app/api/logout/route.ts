import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";

export async function POST(req: Request) {
  const session = await getIronSession(req, new Response(), sessionOptions);

  session.destroy();

  return Response.json({
    success: true,
    message: "Logged out successfully",
  });
}
