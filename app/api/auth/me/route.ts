import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";

export async function GET(req: Request) {
  try {
    const res = NextResponse.next();
    const session = await getIronSession(req, res, sessionOptions);

    if (!session.user) {
      return NextResponse.json(
        { authenticated: false, user: null },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        authenticated: true,
        user: {
          id: session.user.id,
          email: session.user.email,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Session error:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
